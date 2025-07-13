import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import WalletConnectButton from "./components/WalletConnectButton";
import { WalletProvider, useWallet } from "./context/WalletContext";
import WalletCreation from "./components/WalletCreation";
import GuardianRecovery from "./components/GuardianRecovery";
import GaslessLogin from "./components/GaslessLogin";
import { useTrustChainWallet } from "./hooks/useTrustChainWallet";
import { ethers } from "ethers";
import "./App.css";
import "./modern-ui.css";
import SendTransaction from "./components/SendTransaction";
import GuardianOfList from "./components/GuardianOfList";
import GuardiansList from "./components/GuardiansList";
import AddGuardianForm from "./components/AddGuardianForm";
import HomePage from "./components/HomePage";
import Messages from "./components/Messages";
import Notification from "./components/Notification";
import NotificationBell from "./components/NotificationBell";

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  if (error) {
    return <div className="info" style={{ color: 'red' }}>App Error: {error.message}</div>;
  }
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {React.cloneElement(children, { onError: setError })}
    </React.Suspense>
  );
}

function App() {
  const { wallet } = useWallet();
  const [view, setView] = useState("home");
  const [address, setAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [txHistory, setTxHistory] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const trustChain = useTrustChainWallet(signer);
  const guardiansListRef = useRef();
  const [notification, setNotification] = useState(null);

  // Load txHistory for current wallet address
  useEffect(() => {
    if (address) {
      const key = `txHistory_${address}`;
      try {
        const stored = localStorage.getItem(key);
        setTxHistory(stored ? JSON.parse(stored) : []);
      } catch {
        setTxHistory([]);
      }
    } else {
      setTxHistory([]);
    }
  }, [address]);

  // Persist txHistory for current wallet address
  useEffect(() => {
    if (address) {
      const key = `txHistory_${address}`;
      localStorage.setItem(key, JSON.stringify(txHistory));
    }
  }, [txHistory, address]);

  // Add a state for take back requests
  const [takeBackRequests, setTakeBackRequests] = useState([]);
  // Add a state for sent take back requests
  const [sentTakeBackRequests, setSentTakeBackRequests] = useState([]);

  // Load take back requests for current wallet address (received)
  useEffect(() => {
    if (address) {
      const key = `takeBackRequests_${address}`;
      try {
        const stored = localStorage.getItem(key);
        setTakeBackRequests(stored ? JSON.parse(stored) : []);
      } catch {
        setTakeBackRequests([]);
      }
    } else {
      setTakeBackRequests([]);
    }
  }, [address]);

  // Load sent take back requests for current wallet address (sent)
  useEffect(() => {
    if (address) {
      const key = `sentTakeBackRequests_${address}`;
      try {
        const stored = localStorage.getItem(key);
        setSentTakeBackRequests(stored ? JSON.parse(stored) : []);
      } catch {
        setSentTakeBackRequests([]);
      }
    } else {
      setSentTakeBackRequests([]);
    }
  }, [address]);

  // Persist take back requests for current wallet address (received)
  useEffect(() => {
    if (address) {
      const key = `takeBackRequests_${address}`;
      localStorage.setItem(key, JSON.stringify(takeBackRequests));
    }
  }, [takeBackRequests, address]);

  // Persist sent take back requests for current wallet address (sent)
  useEffect(() => {
    if (address) {
      const key = `sentTakeBackRequests_${address}`;
      localStorage.setItem(key, JSON.stringify(sentTakeBackRequests));
    }
  }, [sentTakeBackRequests, address]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accs) => {
        if (accs.length > 0) {
          setAddress(accs[0]);
          const provider = new ethers.BrowserProvider(window.ethereum);
          provider.getSigner(accs[0]).then(setSigner);
        } else {
          setAddress(null);
          setSigner(null);
        }
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const handleConnect = async (account) => {
    setAddress(account);
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setSigner(await provider.getSigner());
    }
  };

  const handleLogout = () => {
    setAddress(null);
    setSigner(null);
  };

  const handleSend = async ({ to, amount }) => {
    if (!signer) return;
    let txObj = null;
    try {
      const tx = await signer.sendTransaction({ to, value: ethers.parseEther(amount) });
      const now = Math.floor(Date.now() / 1000);
      txObj = {
        hash: tx.hash,
        from: address,
        to,
        amount,
        timestamp: now,
        canUndo: true,
        undoEligibleUntil: now + 30, // 30 seconds window
        status: "pending"
      };
      setTxHistory(prev => [txObj, ...prev]);
      await tx.wait();
      setTxHistory(prev => prev.map(t => t.hash === tx.hash ? { ...t, status: "confirmed" } : t));
    } catch (e) {
      if (txObj) setTxHistory(prev => prev.map(t => t.hash === txObj.hash ? { ...t, status: "failed" } : t));
      alert("Transaction failed: " + e.message);
    }
  };

  // Undo: only allowed within 30s and if status is pending
  const handleUndo = async (tx) => {
    const now = Math.floor(Date.now() / 1000);
    if (tx.status !== "pending" || now > tx.undoEligibleUntil) {
      alert("Undo is only allowed within 30 seconds and while transaction is pending.");
      return;
    }
    // Simulate undo by marking as undone (real blockchain undo is not possible)
    setTxHistory(prev => prev.map(t => t.hash === tx.hash ? { ...t, canUndo: false, status: "undone" } : t));
    alert("Transaction marked as undone (simulated, not on-chain).");
  };

  // Take Back: after confirmation, send a request to recipient's wallet and store in sender's sent requests
  const handleTakeBack = async (tx) => {
    if (tx.status !== "confirmed") {
      alert("Take Back can only be requested after confirmation.");
      return;
    }
    // Store request in recipient's localStorage (legacy/local)
    const key = `takeBackRequests_${tx.to}`;
    let requests = [];
    try {
      const stored = localStorage.getItem(key);
      requests = stored ? JSON.parse(stored) : [];
    } catch { /* ignore JSON parse errors */ }
    const req = {
      from: tx.from,
      to: tx.to,
      amount: tx.amount,
      timestamp: Math.floor(Date.now() / 1000),
      txHash: tx.hash
    };
    requests.unshift(req);
    localStorage.setItem(key, JSON.stringify(requests));
    // Also store in sender's sentTakeBackRequests
    const sentKey = `sentTakeBackRequests_${tx.from}`;
    let sentRequests = [];
    try {
      const stored = localStorage.getItem(sentKey);
      sentRequests = stored ? JSON.parse(stored) : [];
    } catch {}
    sentRequests.unshift(req);
    localStorage.setItem(sentKey, JSON.stringify(sentRequests));
    // Send a message to the recipient via messaging server
    try {
      await fetch("http://localhost:3001/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: tx.from,
          to: tx.to,
          message: `Take Back Request: Please return ${tx.amount} tokens for transaction ${tx.hash}`
        })
      });
    } catch (e) {
      // Optionally show a toast or notification for failure
      console.error("Failed to send take back request message", e);
    }
    alert("Take Back request sent to recipient wallet.");
  };

  // Only show transactions for the current wallet address (from or to)
  const filteredTxHistory = txHistory.filter(tx => tx.from === address || tx.to === address);

  // Show take back requests received by the current wallet
  const receivedTakeBackRequests = takeBackRequests;

  // Helper for formatting date/time
  function formatDateTime(seconds) {
    const d = new Date(seconds * 1000);
    return d.toLocaleString();
  }

  // Watch for new take back requests and show notification
  useEffect(() => {
    if (!address) return;
    const key = `takeBackRequests_${address}`;
    let lastSeen = 0;
    try {
      lastSeen = parseInt(localStorage.getItem(`${key}_lastSeen`), 10) || 0;
    } catch {
      // intentionally ignore JSON parse errors
    }
    if (takeBackRequests.length > 0) {
      const latest = takeBackRequests[0];
      if (latest && latest.timestamp > lastSeen) {
        setNotification({
          type: "success",
          message: `Take Back Request: ${latest.from.slice(0,6)}...${latest.from.slice(-4)} asked you to return tokens`,
          details: {
            from: latest.from,
            to: latest.to,
            amount: latest.amount,
            txHash: latest.txHash,
            time: formatDateTime(latest.timestamp)
          }
        });
        localStorage.setItem(`${key}_lastSeen`, latest.timestamp.toString());
      }
    }
  }, [takeBackRequests, address]);

  return (
    <div className={`app-shell theme-${theme}`}>
      <Sidebar onNav={setView} current={view}>
        <WalletConnectButton onConnect={handleConnect} address={address} onLogout={handleLogout} />
        <button
          className="btn-gradient"
          style={{marginTop: 32, width: '100%', fontSize: 16}}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </Sidebar>
      <div className="main-content">
        <NotificationBell 
          requests={[...receivedTakeBackRequests, ...sentTakeBackRequests]} 
          onSelect={req => setNotification({
            type: "success",
            message: req.from === address
              ? `You requested a refund from ${req.to.slice(0,6)}...${req.to.slice(-4)}`
              : `${req.from.slice(0,6)}...${req.from.slice(-4)} asked you to return tokens`,
            details: {
              from: req.from,
              to: req.to,
              amount: req.amount,
              txHash: req.txHash,
              time: formatDateTime(req.timestamp)
            }
          })}
        />
        <Notification notification={notification} onClose={() => setNotification(null)} />
        {view === "home" && <HomePage />}
        {!address && view !== "home" && <p className="info">Connect your wallet to use TrustChain features.</p>}
        {address && view !== "home" && <GuardianOfList />}
        {address && view === "recover" && <GuardianRecovery onInitiateRecovery={trustChain.initiateRecovery} onApproveRecovery={trustChain.approveRecovery} />}
        {address && view === "guardians" && (
          <section className="wallet-info">
            <h2>Guardian Management</h2>
            <p>Current Guardians:</p>
            <ul>
              {trustChain && trustChain.getGuardians && (
                <React.Suspense fallback={<li>Loading...</li>}>
                  <GuardiansList ref={guardiansListRef} trustChain={trustChain} />
                </React.Suspense>
              )}
            </ul>
            <AddGuardianForm onAddGuardian={trustChain.addGuardian} trustChain={trustChain} onGuardianAdded={() => guardiansListRef.current && guardiansListRef.current.refresh()} />
          </section>
        )}
        {address && view === "send" && <SendTransaction onSend={handleSend} txHistory={filteredTxHistory} onUndo={handleUndo} onTakeBack={handleTakeBack} />}
        {address && view === "messages" && <Messages trustChain={trustChain} address={address} />}
        {receivedTakeBackRequests.length > 0 && view !== "home" && (
          <section className="wallet-info" style={{marginBottom:24}}>
            <h2>Take Back Requests Received</h2>
            <table style={{width:'100%',fontSize:'0.95rem'}}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>From (Requester)</th>
                  <th>Amount</th>
                  <th>Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {receivedTakeBackRequests.map((req, i) => (
                  <tr key={req.txHash + i}>
                    <td>{formatDateTime(req.timestamp)}</td>
                    <td>{req.from.slice(0,6)}...{req.from.slice(-4)}</td>
                    <td>{req.amount}</td>
                    <td>{req.txHash.slice(0,8)}...{req.txHash.slice(-4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {/* Show sent take back requests for the sender */}
        {sentTakeBackRequests.length > 0 && view !== "home" && (
          <section className="wallet-info" style={{marginBottom:24}}>
            <h2>Take Back Requests Sent</h2>
            <table style={{width:'100%',fontSize:'0.95rem'}}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>To (Recipient)</th>
                  <th>Amount</th>
                  <th>Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {sentTakeBackRequests.map((req, i) => (
                  <tr key={req.txHash + i}>
                    <td>{formatDateTime(req.timestamp)}</td>
                    <td>{req.to.slice(0,6)}...{req.to.slice(-4)}</td>
                    <td>{req.amount}</td>
                    <td>{req.txHash.slice(0,8)}...{req.txHash.slice(-4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {filteredTxHistory.length > 0 && view !== "home" && (
          <section className="wallet-info">
            <h2>Transaction History</h2>
            <table style={{width:'100%',fontSize:'0.95rem'}}>
              <thead>
                <tr>
                  <th>Time (s)</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Undo</th>
                  <th>Take Back</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxHistory.map(tx => {
                  const now = Math.floor(Date.now() / 1000);
                  const canUndo = tx.status === "pending" && now <= tx.undoEligibleUntil;
                  const canTakeBack = tx.status === "confirmed";
                  return (
                    <tr key={tx.hash}>
                      <td>{formatDateTime(tx.timestamp)}</td>
                      <td>{tx.from.slice(0,6)}...{tx.from.slice(-4)}</td>
                      <td>{tx.to.slice(0,6)}...{tx.to.slice(-4)}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.status || "confirmed"}</td>
                      <td>{canUndo ? <button onClick={() => handleUndo(tx)}>Undo</button> : "-"}</td>
                      <td>{canTakeBack ? <button onClick={() => handleTakeBack(tx)}>Take Back</button> : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}
        {trustChain.txStatus && view !== "home" && <p className="info">Status: {trustChain.txStatus}</p>}
        {trustChain.error && view !== "home" && <p className="info" style={{color:'red'}}>Error: {trustChain.error}</p>}
        {wallet && view !== "home" && (
          <section className="wallet-info">
            <h2>Wallet Info</h2>
            <pre>{JSON.stringify(wallet, null, 2)}</pre>
          </section>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default function AppWithProvider() {
  return (
    <WalletProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </WalletProvider>
  );
}
