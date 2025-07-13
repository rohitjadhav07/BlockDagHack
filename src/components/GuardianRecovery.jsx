import React, { useState } from 'react';

const GuardianRecovery = ({ onInitiateRecovery, onApproveRecovery }) => {
  const [newOwner, setNewOwner] = useState('');

  const handleInitiate = (e) => {
    e.preventDefault();
    if (newOwner) {
      onInitiateRecovery(newOwner);
      setNewOwner('');
    }
  };

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
      <form onSubmit={handleInitiate} style={{marginBottom:32}}>
        <h2 className="card-title" style={{marginBottom: 24}}>Initiate Recovery</h2>
        <input
          type="text"
          placeholder="New owner address (0x...)"
          value={newOwner}
          onChange={e => setNewOwner(e.target.value)}
          required
        />
        <button type="submit" className="btn-gradient" style={{marginTop:16}}>Initiate Recovery</button>
      </form>
      <hr className="divider" />
      <form onSubmit={e => { e.preventDefault(); onApproveRecovery(); }}>
        <h2 className="card-title" style={{marginBottom: 24, fontSize:'1.5rem'}}>Approve Recovery</h2>
        <button type="submit" className="btn-gradient">Approve as Guardian</button>
      </form>
    </div>
  );
};

export default GuardianRecovery;
