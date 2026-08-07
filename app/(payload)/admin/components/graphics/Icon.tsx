import React from "react";

/**
 * Compact brand mark used for the collapsed navigation / favicon-style slot.
 */
export function Icon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ab-icon-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#003B73" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="url(#ab-icon-grad)" />
      <path
        d="M20 8c-4.5 5.4-8 10-8 14.2C12 26.6 15.6 30 20 30s8-3.4 8-7.8C28 18 24.5 13.4 20 8Z"
        fill="#fff"
      />
      <circle cx="20" cy="21.5" r="3" fill="#4CAF50" />
    </svg>
  );
}

export default Icon;
