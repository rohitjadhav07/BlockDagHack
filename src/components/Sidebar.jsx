import React from "react";

const Sidebar = ({ onNav, current, children }) => (
  <nav className="sidebar-nav">
    <div className="sidebar-brand" onClick={() => onNav('home')}>TrustChain</div>
    <div className="sidebar-links">
      <button className={current === 'recover' ? 'active' : ''} onClick={() => onNav('recover')}>Recover Wallet</button>
      <button className={current === 'guardians' ? 'active' : ''} onClick={() => onNav('guardians')}>Guardians</button>
      <button className={current === 'send' ? 'active' : ''} onClick={() => onNav('send')}>Send Tokens</button>
      <button className={current === 'messages' ? 'active' : ''} onClick={() => onNav('messages')}>Messages</button>
    </div>
    <div style={{marginTop:'auto', marginLeft:32}}>{children}</div>
  </nav>
);

export default Sidebar;
