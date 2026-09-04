import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusLabel = (st) => {
    switch (st) {
      case 'TODO': return 'To Do';
      case 'IN_PROGRESS': return 'In Progress';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return st || 'Unknown';
    }
  };

  const statusKey = (status || '').toLowerCase();

  return (
    <span className={`badge badge-${statusKey}`}>
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
