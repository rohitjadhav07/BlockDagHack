import React, { useState } from "react";

function parseGuardianError(message) {
  if (message && message.includes("Already a guardian")) {
    return "This address is already a guardian.";
  }
  if (message && message.includes("Not a guardian")) {
    return "This address is not a guardian.";
  }
  if (message && message.includes("Threshold too high")) {
    return "Recovery threshold is too high.";
  }
  return "An error occurred. Please check your input.";
}

export default function AddGuardianForm({ onAddGuardian, trustChain, onGuardianAdded }) {
  const [guardian, setGuardian] = useState("");
  const [status, setStatus] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setChecking(true);
    try {
      if (trustChain && trustChain.getGuardians) {
        const currentGuardians = await trustChain.getGuardians();
        if (currentGuardians.map(g => g.toLowerCase()).includes(guardian.toLowerCase())) {
          setStatus("This address is already a guardian.");
          setChecking(false);
          return;
        }
      }
      await onAddGuardian(guardian);
      setStatus("Guardian added!");
      setGuardian("");
      if (onGuardianAdded) onGuardianAdded();
    } catch (e) {
      setStatus(parseGuardianError(e.message));
    }
    setChecking(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{marginTop:10}}>
      <input
        type="text"
        placeholder="Guardian address"
        value={guardian}
        onChange={e => setGuardian(e.target.value)}
        required
        style={{marginRight:8}}
      />
      <button type="submit" disabled={checking}>Add Guardian</button>
      {status && <div style={{marginTop:6, color:status.startsWith('Error')? 'red' : status.includes('already') ? 'orange' : 'green'}}>{status}</div>}
    </form>
  );
}
