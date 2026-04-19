import React from 'react';

const Skeleton = ({ width, height, borderRadius, className = "", style = {} }) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius || '8px',
        ...style
      }}
    />
  );
};

export default Skeleton;
