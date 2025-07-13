import React, { useEffect, useState } from "react";
import PaperPlane from "./PaperPlane";
// If you have Lucide or Heroicons, import them here. Otherwise, fallback to emoji.

const MESSAGES_API_URL = "http://localhost:3001/messages";

function Toast({ type = "info", message, onClose }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}>
      {type === "success" && <span className="status-indicator status-success">✅</span>}
      {type === "error" && <span className="status-indicator status-error">❌</span>}
      {type === "loading" && <span className="status-indicator status-loading">⏳</span>}
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close">✖️</button>
    </div>
  );
}

export default function Messages({ trustChain, address }) {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animatePlane, setAnimatePlane] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    fetch(`${MESSAGES_API_URL}?to=${address}`)
      .then(res => res.json())
      .then(data => setInbox(data))
      .catch(() => setInbox([]))
      .finally(() => setLoading(false));
  }, [address, sent]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipient || !message) return;
    setLoading(true);
    setToast({ type: 'loading', message: 'Sending message...' });
    try {
      await fetch(MESSAGES_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: address, to: recipient, message })
      });
      setSent({ to: recipient, message });
      setMessage("");
      setRecipient("");
      setAnimatePlane(true);
      setTimeout(() => setAnimatePlane(false), 1000);
      setToast({ type: 'success', message: 'Message sent successfully!' });
    } catch {
      setSent({ to: recipient, message: "Failed to send message." });
      setToast({ type: 'error', message: 'Failed to send message.' });
    }
    setLoading(false);
  };

  const closeToast = () => setToast({ type: '', message: '' });

  return (
    <div className="wallet-card glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      background: 'rgba(255,255,255,0.30)',
      boxShadow: '0 8px 40px 0 rgba(80,80,120,0.18)',
      borderRadius: 32,
      margin: '64px auto',
      padding: '40px 32px',
      width: '96vw',
      maxWidth: 600,
      minHeight: 520,
      border: '1.5px solid rgba(180,180,255,0.18)',
      backdropFilter: 'blur(18px) saturate(1.2)',
      WebkitBackdropFilter: 'blur(18px) saturate(1.2)'
    }}>
      <Toast type={toast.type} message={toast.message} onClose={closeToast} />
      <div style={{display:'flex', flexDirection:'column', flex:1, minHeight:0}}>
        <h2 className="card-title" style={{marginBottom: 32, fontSize: '2.3rem', fontWeight: 800, color: '#2e3a8c', letterSpacing: 1}}>Send a Message</h2>
        <form onSubmit={handleSend} style={{marginBottom:36, display:'flex', flexDirection:'column', gap:18}}>
          <label style={{fontWeight:'bold', marginBottom:4, color:'#2e3a8c', fontSize:17}}>
            To Address:
            <input
              type="text"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              placeholder="0x..."
              style={{marginLeft:8, padding: '10px 18px', borderRadius: 14, border: '1.5px solid #a5b4fc', minWidth:160, fontSize:17, background:'rgba(255,255,255,0.7)', color:'#2e3a8c'}}
              required
            />
          </label>
          <textarea
            placeholder="Type your message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            style={{width:'100%', borderRadius:16, border:'1.5px solid #a5b4fc', padding:16, fontSize:17, resize:'vertical', marginBottom:0, background:'rgba(255,255,255,0.7)', color:'#2e3a8c'}}
            required
          />
          <div style={{display:'flex', justifyContent:'flex-end', width:'100%'}}>
            <button type="submit" className="btn-gradient glass-btn" disabled={loading} style={{minWidth:180, fontSize:19, marginTop:10, width:'100%', maxWidth:260, borderRadius: 999, boxShadow:'0 4px 24px 0 rgba(120,80,255,0.13)'}}>
              {loading ? <span className="status-indicator status-loading">⏳</span> : <span>Send Message</span>}
              {animatePlane && <PaperPlane animate={animatePlane} />}
            </button>
          </div>
        </form>
        <div style={{height:4, width:'100%', margin:'0 0 28px 0', background:'linear-gradient(90deg,#a5b4fc 0%,#f472b6 100%)', borderRadius:2, opacity:0.7}} />
        {sent && (
          <div style={{color:'#1a7f37',marginTop:8,marginBottom:16,background:'#e6f9ed',padding:14,borderRadius:12, fontWeight:500}}>
            <span className="status-indicator status-success">✅</span>
            Message sent to {sent.to || recipient}:<br/>
            <span style={{fontStyle:'italic'}}>{sent.message}</span>
          </div>
        )}
        <h3 className="card-section-title" style={{marginBottom:14, color:'#a21caf', fontWeight:700, fontSize:'1.25rem'}}>Inbox</h3>
        <div style={{maxHeight:220, overflowY:'auto', width:'100%'}}>
        {loading ? <p>Loading messages...</p> : (
          inbox.length === 0 ? <p style={{textAlign:'center'}}>No messages.</p> :
          <ul style={{paddingLeft:0, listStyle:'none', margin:0, display:'flex', flexDirection:'column', gap:12}}>
            {inbox.map((msg, i) => (
              <li key={i} style={{background:'rgba(245,245,255,0.85)',padding:14,borderRadius:12,boxShadow:'0 1px 8px 0 rgba(120,80,255,0.06)', display:'flex', alignItems:'center', gap:10}}>
                <span className="status-indicator status-success">✅</span>
                <div>
                  <b style={{color:'#6366f1'}}>From:</b> {msg.from}<br/>
                  <span>{msg.message}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>
    </div>
  );
}
