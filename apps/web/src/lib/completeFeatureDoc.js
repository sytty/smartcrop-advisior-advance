export const completeFeatureDoc = {
  generate() {
    return [
      {
        category: 'Core Features',
        items: [
          { name: 'Authentication', desc: 'Secure login, signup, and password reset with JWT.' },
          { name: 'Dashboard', desc: 'Real-time metrics, NPK charts, and field overview.' }
        ]
      },
      {
        category: 'Analytics (8 Pages)',
        items: [
          { name: 'Yield Prediction', desc: 'ML-based harvest forecasting.' },
          { name: 'Soil Health', desc: 'pH, moisture, and nutrient tracking.' },
          { name: 'Cost-Benefit', desc: 'Financial ROI calculations for treatments.' }
        ]
      },
      {
        category: 'Monitoring (5 Pages)',
        items: [
          { name: 'Digital Twin', desc: 'Real-time geospatial field simulation.' },
          { name: 'Pest Risk Heatmap', desc: 'Visual risk assessment across regions.' }
        ]
      },
      {
        category: 'Futuristic (15 Pages)',
        items: [
          { name: 'AI Crop Advisor', desc: 'Quantum-powered crop recommendations.' },
          { name: 'Drone Monitoring', desc: 'Autonomous aerial surveillance integration.' },
          { name: 'Blockchain Certification', desc: 'Immutable farm-to-market traceability.' }
        ]
      }
    ];
  }
};