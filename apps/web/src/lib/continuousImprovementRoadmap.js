export const continuousImprovementRoadmap = {
  getRoadmap() {
    return {
      shortTerm: [
        { title: 'PWA Implementation', desc: 'Add Service Worker for full offline capabilities.' },
        { title: 'Advanced Caching', desc: 'Implement Redis for API response caching.' }
      ],
      mediumTerm: [
        { title: 'Predictive Maintenance', desc: 'Machine learning models for equipment failure prediction.' },
        { title: 'Marketplace Integration', desc: 'Direct B2B crop selling platform.' }
      ],
      longTerm: [
        { title: 'Autonomous Drone Fleet', desc: 'Full API integration with DJI enterprise drones.' },
        { title: 'Global Satellite Network', desc: 'Real-time 10cm resolution imagery integration.' }
      ],
      techUpgrades: [
        'React 19 Migration (when stable)',
        'WebGPU for Advanced Digital Twin rendering'
      ]
    };
  }
};