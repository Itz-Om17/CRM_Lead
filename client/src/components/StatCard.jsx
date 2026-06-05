import React from 'react';
import '../styles/stats.css';

function StatCard({ label, value, status }) {
  const statusClass = status ? `status-${status.toLowerCase()}` : 'total';
  return (
    <div className={`stat-card border-${statusClass}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export default StatCard;
