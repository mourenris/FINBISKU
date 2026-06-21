import React from 'react';
import { ResponsiveContainer } from 'recharts';

const ChartContainer = ({ children, height = 300, title }) => {
  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-semibold font-display text-neutral-500 mb-4">{title}</h4>}
      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartContainer;
