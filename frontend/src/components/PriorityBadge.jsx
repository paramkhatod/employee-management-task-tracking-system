import React from 'react';

const PriorityBadge = ({ priority }) => {
  const priorityKey = (priority || '').toLowerCase();

  return (
    <span className={`badge badge-${priorityKey}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
