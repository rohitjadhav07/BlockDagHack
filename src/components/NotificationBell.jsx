import React, { useState } from "react";

export default function NotificationBell({ requests, onSelect }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{position:'fixed',top:24,left:24,zIndex:200}}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background:'rgba(255,255,255,0.85)',
          border:'none',
          borderRadius:'50%',
          width:48,
          height:48,
          boxShadow:'0 2px 12px #a5b4fc44',
          cursor:'pointer',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          position:'relative',
        }}
        title="Show refund requests"
      >
        <span style={{fontSize:28}}>🔔</span>
        {requests.length > 0 && (
          <span style={{
            position:'absolute',top:6,right:6,
            background:'#f472b6',color:'#fff',borderRadius:'50%',
            fontSize:13,padding:'2px 7px',fontWeight:700
          }}>{requests.length}</span>
        )}
      </button>
      {open && (
        <div style={{
          position:'absolute',top:56,left:0,minWidth:320,maxWidth:400,
          background:'rgba(255,255,255,0.97)',
          borderRadius:16,boxShadow:'0 8px 32px #a5b4fc33',
          padding:18,zIndex:201
        }}>
          <div style={{fontWeight:700,marginBottom:10,fontSize:'1.1em'}}>Refund Requests</div>
          {requests.length === 0 ? (
            <div style={{color:'#888'}}>No refund requests.</div>
          ) : (
            <ul style={{listStyle:'none',padding:0,margin:0,maxHeight:320,overflowY:'auto'}}>
              {requests.map((req,i) => (
                <li key={req.txHash + i} style={{marginBottom:14,paddingBottom:10,borderBottom:'1px solid #eee'}}>
                  <div><b>From:</b> {req.from.slice(0,6)}...{req.from.slice(-4)}</div>
                  <div><b>Amount:</b> {req.amount}</div>
                  <div><b>Tx Hash:</b> {req.txHash.slice(0,8)}...{req.txHash.slice(-4)}</div>
                  <div><b>Time:</b> {new Date(req.timestamp*1000).toLocaleString()}</div>
                  {onSelect && <button className="btn-gradient" style={{marginTop:6}} onClick={()=>onSelect(req)}>View</button>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
