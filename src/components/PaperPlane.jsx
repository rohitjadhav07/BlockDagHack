// SVG Paper Plane Animation for Send Action
// Usage: <PaperPlane animate={shouldAnimate} />
import React from "react";

export default function PaperPlane({ animate }) {
  return (
    <svg
      className={animate ? "paper-plane" : ""}
      width="32" height="32" viewBox="0 0 32 32" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{verticalAlign:'middle'}}
    >
      <g filter="url(#shadow)">
        <path d="M3 29L29 16L3 3L7 16L3 29Z" fill="#6a82fb" stroke="#fc5c7d" strokeWidth="2"/>
      </g>
      <defs>
        <filter id="shadow" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#fc5c7d"/>
        </filter>
      </defs>
    </svg>
  );
}
