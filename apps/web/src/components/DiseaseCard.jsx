import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Leaf, Activity, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const DiseaseCard = ({ disease }) => {
  if (!disease) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'text-[hsl(var(--severity-mild))] bg-[hsl(var(--severity-mild))]/10 border-[hsl(var(--severity-mild))]/20';
      case 'moderate': return 'text-[hsl(var(--severity-moderate))] bg-[hsl(var(--severity-moderate))]/10 border-[hsl(var(--severity-moderate))]/20';
      case 'severe': return 'text-[hsl(var(--severity-severe))] bg-[hsl(var(--severity-severe))]/10 border-[hsl(var(--severity-severe))]/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 90) return 'bg-[hsl(var(--severity-mild))]';
    if (score >= 75) return 'bg-[hsl(var(--severity-moderate))]';
    return 'bg-[hsl(var(--severity-severe))]';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 border border-white/10"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <ShieldAlert className="w-6 h-6 mr-2 text-[#00d4ff]" />
            {disease.name}
          </h2>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getSeverityColor(disease.severity)}`}>
              {disease.severity} Severity
            </span>
            <span className="flex items-center text-sm text-gray-400 bg-white/5 px-2 py-1 rounded-md">
              <Leaf className="w-4 h-4 mr-1" />
              Affected: <span className="text-white ml-1 capitalize">{disease.affectedPart}</span>
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">AI Confidence</div>
          <div className="text-2xl font-bold text-white">{disease.confidence}%</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${disease.confidence}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${getConfidenceColor(disease.confidence)}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1a4d2e]/20 border border-[#1a4d2e]/40 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-[#22c55e] mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Organic Treatment
          </h4>
          <p className="text-white font-medium mb-1">{disease.treatments.organic.name}</p>
          <p className="text-sm text-gray-300 mb-2">{disease.treatments.organic.schedule}</p>
          <p className="text-xs text-gray-400">Est. Cost: {disease.treatments.organic.cost}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-[#00d4ff] mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Chemical Treatment
          </h4>
          <p className="text-white font-medium mb-1">{disease.treatments.chemical.name}</p>
          <p className="text-sm text-gray-300 mb-2">{disease.treatments.chemical.schedule}</p>
          <p className="text-xs text-gray-400">Est. Cost: {disease.treatments.chemical.cost}</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
          <Info className="w-4 h-4 mr-2 text-gray-400" />
          Prevention Tips
        </h4>
        <ul className="space-y-2">
          {disease.preventionTips.map((tip, idx) => (
            <li key={idx} className="text-sm text-gray-300 flex items-start">
              <span className="text-[#00d4ff] mr-2">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {disease.similarDiseases && disease.similarDiseases.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-gray-400 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
            Low confidence. Also consider: <span className="text-white ml-2">{disease.similarDiseases.join(', ')}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default DiseaseCard;