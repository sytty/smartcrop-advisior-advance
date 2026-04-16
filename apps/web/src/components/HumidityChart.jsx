import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AnimatedChart from './AnimatedChart.jsx';

const HumidityChart = ({ title }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const generateData = () => {
      const newData = [];
      const baseHumidity = 65;
      for (let i = 0; i < 12; i++) {
        newData.push({
          time: `${i}:00`,
          humidity: baseHumidity + Math.sin(i * 0.5) * 10 + Math.random() * 5
        });
      }
      return newData;
    };

    setData(generateData());

    const interval = setInterval(() => {
      setData(generateData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-lg">
          <p className="text-white font-semibold">{payload[0].payload.time}</p>
          <p className="text-[#00d4ff]">{payload[0].value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <AnimatedChart title={title}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" stroke="#fff" />
          <YAxis stroke="#fff" domain={[40, 90]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="humidity"
            stroke="#00d4ff"
            strokeWidth={2}
            fill="url(#humidityGradient)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </AnimatedChart>
  );
};

export default HumidityChart;