export const systemStatus = {
  overall: "Operational",
  uptime: "99.99%",
  lastUpdated: new Date().toISOString(),
  services: [
    { name: "AI Prediction Engine", status: "Operational", latency: "120ms" },
    { name: "IoT Data Ingestion", status: "Operational", latency: "45ms" },
    { name: "Satellite Imagery API", status: "Operational", latency: "850ms" },
    { name: "Blockchain Ledger", status: "Operational", latency: "2.1s" }
  ],
  metrics: {
    satisfaction: 98,
    activeUsers: 12450,
    dataProcessed: "4.2 TB/day"
  }
};