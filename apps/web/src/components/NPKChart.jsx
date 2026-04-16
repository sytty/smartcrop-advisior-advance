import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AnimatedChart from './AnimatedChart.jsx';

const NPKChart = ({ title }) => {
  const [data, setData] = useState([
    { name: 'N', value: 0, color: '#00d4ff' },
    { name: 'P', value: 0, color: '#1a4d2e' },
    { name: 'K', value: 0, color: '#00d4ff' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData([
        { name: 'N', value: 65 + Math.random() * 15, color: '#00d4ff' },
        { name: 'P', value: 45 + Math.random() * 20, color: '#1a4d2e' },
        { name: 'K', value: 70 + Math.random() * 10, color: '#00d4ff' }
      ]);
    }, 3000);

    setData([
      { name: 'N', value: 72, color: '#00d4ff' },
      { name: 'P', value: 58, color: '#1a4d2e' },
      { name: 'K', value: 76, color: '#00d4ff' }
    ]);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-lg">
          <p className="text-white font-semibold">{payload[0].payload.name}</p>
          <p className="text-[#00d4ff]">{payload[0].value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <AnimatedChart title={title}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" animationDuration={1000} radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AnimatedChart>
  );
};

export default NPKChart;