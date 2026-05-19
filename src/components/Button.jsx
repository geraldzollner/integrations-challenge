import React from 'react';

export default function Button({ variant = 'primary', children, className = '', ...props }) {
  const base = variant === 'ghost' ? 'button-primary--ghost' : 'button-primary';
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}
