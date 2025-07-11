import React from 'react';

function StatusBadge({ status, size = 'md' }) {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'done':
      case 'confirmed':
        return {
          color: 'bg-accent-100 text-accent-800 border-accent-200',
          label: 'Completed'
        };
      case 'in progress':
      case 'in-progress':
      case 'active':
        return {
          color: 'bg-amani-orange-100 text-amani-orange-800 border-amani-orange-200',
          label: 'In Progress'
        };
      case 'pending':
      case 'scheduled':
        return {
          color: 'bg-amani-blue-100 text-amani-blue-800 border-amani-blue-200',
          label: 'Pending'
        };
      case 'overdue':
      case 'urgent':
        return {
          color: 'bg-danger-100 text-danger-800 border-danger-200',
          label: 'Overdue'
        };
      case 'not started':
      case 'not-started':
      case 'draft':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Not Started'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: status || 'Unknown'
        };
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base',
  };

  const { color, label } = getStatusConfig();

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${color} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
}

export default StatusBadge;