import React from 'react';
import { MapPin } from 'lucide-react';
import GlassCard from './GlassCard.jsx';
import LiveIndicator from './LiveIndicator.jsx';
import NPKChart from './NPKChart.jsx';
import PHGaugeChart from './pHGaugeChart.jsx';
import HumidityChart from './HumidityChart.jsx';
import { useTranslation } from 'react-i18next';

const FieldCard = ({ location, delay = 0 }) => {
  const { t } = useTranslation();

  return (
    <GlassCard delay={delay} className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#00d4ff]" />
          <h3 className="text-lg font-semibold text-white">{location}</h3>
        </div>
        <LiveIndicator />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <NPKChart title={t('liveFeed.npk')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PHGaugeChart title={t('liveFeed.ph')} />
          <HumidityChart title={t('liveFeed.humidity')} />
        </div>
      </div>
    </GlassCard>
  );
};

export default FieldCard;