import React from 'react';
import { MapPin, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const RegionalOutbreakCard = ({ outbreak }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'bg-[hsl(var(--severity-mild))]';
      case 'moderate': return 'bg-[hsl(var(--severity-moderate))]';
      case 'severe': return 'bg-[hsl(var(--severity-severe))]';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-400" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  return (
    <div className="glass-card p-5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 shadow-lg ${getSeverityColor(outbreak.severity)}`} />
          <h3 className="text-lg font-semibold text-white flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            {outbreak.region}
          </h3>
        </div>
        <div className="flex items-center bg-white/5 px-2 py-1 rounded-md">
          {getTrendIcon(outbreak.trend)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Affected Fields</p>
          <p className="text-xl font-bold text-white">{outbreak.fieldCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Severity</p>
          <p className="text-sm font-medium text-white capitalize">{outbreak.severity}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-400 mb-2">Affected Crops</p>
        <div className="flex flex-wrap gap-2">
          {outbreak.affectedCrops.map((crop, idx) => (
            <span key={idx} className="text-xs px-2 py-1 rounded-md bg-[#1a4d2e]/30 text-[#22c55e] border border-[#1a4d2e]/50">
              {crop}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionalOutbreakCard;