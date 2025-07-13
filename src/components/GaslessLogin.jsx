import React, { useState } from 'react';

const GaslessLogin = ({ onLogin }) => {
  const [sessionKey, setSessionKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(sessionKey);
  };

  return (
    <form onSubmit={handleSubmit} className="gasless-login">
      <h2>Gasless Login</h2>
      <input
        type="text"
        placeholder="Session Key"
        value={sessionKey}
        onChange={e => setSessionKey(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default GaslessLogin;
