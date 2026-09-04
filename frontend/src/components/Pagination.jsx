import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pageNo, totalPages, totalElements, pageSize, onPageChange }) => {
  if (totalPages <= 1 && totalElements <= pageSize) return null;

  const startIdx = pageNo * pageSize + 1;
  const endIdx = Math.min((pageNo + 1) * pageSize, totalElements);

  return (
    <div className="pagination">
      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
        Showing <strong style={{ color: '#0f172a' }}>{totalElements > 0 ? startIdx : 0}</strong> to{' '}
        <strong style={{ color: '#0f172a' }}>{endIdx}</strong> of{' '}
        <strong style={{ color: '#0f172a' }}>{totalElements}</strong> items
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          className="btn btn-outline"
          style={{ padding: '0.4rem 0.6rem' }}
          disabled={pageNo === 0}
          onClick={() => onPageChange(pageNo - 1)}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <span style={{ fontSize: '0.875rem', fontWeight: 600, padding: '0 0.5rem' }}>
          Page {pageNo + 1} of {totalPages || 1}
        </span>

        <button
          className="btn btn-outline"
          style={{ padding: '0.4rem 0.6rem' }}
          disabled={pageNo >= totalPages - 1}
          onClick={() => onPageChange(pageNo + 1)}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
