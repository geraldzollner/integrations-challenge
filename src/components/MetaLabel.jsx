import React from 'react';

export default function MetaLabel({ children, className = '' }) {
  return (
    <div className={`meta-label ${className}`}>
      {children}
    </div>
  );
}
