import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";

const GuardiansList = forwardRef(function GuardiansList({ trustChain }, ref) {
  const [guardians, setGuardians] = useState([]);

  const fetchGuardians = async () => {
    if (trustChain && trustChain.getGuardians) {
      const g = await trustChain.getGuardians();
      // Filter out mock/test addresses (e.g., all-zeros or short demo addresses)
      const filtered = g.filter(
        (addr) =>
          addr &&
          addr !== "0x0000000000000000000000000000000000000001" &&
          addr !== "0x0000000000000000000000000000000000000002" &&
          addr !== "0x0000000000000000000000000000000000000003"
      );
      setGuardians(filtered);
    }
  };

  useEffect(() => {
    fetchGuardians();
    // eslint-disable-next-line
  }, [trustChain]);

  useImperativeHandle(ref, () => ({
    refresh: fetchGuardians,
  }));

  if (!guardians.length) return <li>No guardians found.</li>;
  return <>{guardians.map((g, i) => <li key={i}>{g}</li>)}</>;
});

export default GuardiansList;
