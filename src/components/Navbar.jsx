import React from "react";

const Navbar = ({ onNav, current }) => (
  <nav className="navbar">
    <div className="navbar-brand" style={{cursor:'pointer'}} onClick={() => onNav('home')}>TrustChain</div>
    <div className="navbar-links">
      <button className={current === 'recover' ? 'active' : ''} onClick={() => onNav('recover')}>Recover Wallet</button>
      <button className={current === 'guardians' ? 'active' : ''} onClick={() => onNav('guardians')}>Guardians</button>
      <button className={current === 'send' ? 'active' : ''} onClick={() => onNav('send')}>Send Tokens</button>
      <button className={current === 'messages' ? 'active' : ''} onClick={() => onNav('messages')}>Messages</button>
    </div>
  </nav>
);

export default Navbar;
