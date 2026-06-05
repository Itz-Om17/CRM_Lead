import React from 'react';
import '../styles/badge.css';

function StatusBadge({ status }) {
  const badgeClass = status ? status.toLowerCase() : 'new';
  return (
    <span className={`status-badge status-${badgeClass}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
