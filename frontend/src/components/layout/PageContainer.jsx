import React from 'react';

export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`max-w-container-max mx-auto px-margin-desktop w-full ${className}`}>
      {children}
    </div>
  );
}
