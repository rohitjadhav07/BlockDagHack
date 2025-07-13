import React, { useState } from "react";

const SendTransaction = ({ onSend, txHistory = [], onUndo }) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (to && amount) {
      onSend({ to, amount });
      setTo("");
      setAmount("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="send-transaction">
        <h2>Send Transaction</h2>
        <input
          type="text"
          placeholder="Recipient address (0x...)"
          value={to}
          onChange={e => setTo(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
          step="any"
          required
        />
        <button type="submit">Send</button>
      </form>
      {txHistory.length > 0 && (
        <div className="recent-tx-list" style={{marginTop:32}}>
          <h3 style={{marginBottom:12}}>Recent Transactions</h3>
          <table style={{width:'100%',fontSize:'0.95rem'}}>
            <thead>
              <tr>
                <th>Time</th>
                <th>To</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Take Back</th>
              </tr>
            </thead>
            <tbody>
              {txHistory.slice(0,5).map(tx => (
                <tr key={tx.hash}>
                  <td>{new Date(tx.timestamp * 1000).toLocaleString()}</td>
                  <td>{tx.to.slice(0,6)}...{tx.to.slice(-4)}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.status || "confirmed"}</td>
                  <td>{tx.canUndo ? <button onClick={() => onUndo(tx)}>Take Back</button> : (tx.status?.includes('undo') ? 'Requested' : '-')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SendTransaction;
