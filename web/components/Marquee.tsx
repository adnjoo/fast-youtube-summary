import React from 'react';

export function Marquee({ children }) {
  return (
    <div className='marquee-container'>
      <div className='marquee-content gap-12'>
        {children}
        {children} {/* Duplicate the content for infinite scroll effect */}
      </div>
    </div>
  );
}
