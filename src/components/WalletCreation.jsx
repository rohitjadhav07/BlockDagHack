import React, { useState } from 'react';

const WalletCreation = ({ onAddGuardian }) => {
  const [guardian, setGuardian] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guardian) {
      onAddGuardian(guardian);
      setGuardian('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="wallet-creation">
      <h2>Add Guardian</h2>
      <input
        type="text"
        placeholder="Guardian address (0x...)"
        value={guardian}
        onChange={e => setGuardian(e.target.value)}
        required
      />
      <button type="submit">Add Guardian</button>
    </form>
  );
};

export default WalletCreation;
