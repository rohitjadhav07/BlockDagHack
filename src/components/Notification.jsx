import React from "react";

export default function Notification({ notification, onClose }) {
  if (!notification) return null;
  const { type, message, details } = notification;
  return (
    <div className={`toast toast-${type || "info"}`} style={{zIndex:100}}>
      <span className="status-indicator status-success">🔔</span>
      <div style={{flex:1}}>
        <div style={{fontWeight:700, marginBottom:2}}>{message}</div>
        {details && (
          <div style={{fontSize:'0.97em', marginTop:4}}>
            <div><b>From:</b> {details.from}</div>
            <div><b>To:</b> {details.to}</div>
            <div><b>Amount:</b> {details.amount}</div>
            <div><b>Tx Hash:</b> {details.txHash}</div>
            <div><b>Time:</b> {details.time}</div>
          </div>
        )}
      </div>
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  );
}
