export const documentationGenerator = {
  generate() {
    return {
      architecture: {
        frontend: "React 18 + Vite",
        styling: "TailwindCSS + shadcn/ui",
        routing: "React Router v7",
        stateManagement: "React Context + Local State",
        i18n: "i18next (16 languages)",
        backend: "PocketBase (Auth, DB, Storage) + Express API Server"
      },
      features: [
        { name: "Authentication", description: "Email/Password, JWT, Session Management" },
        { name: "Dashboard", description: "Real-time metrics, charts, field overview" },
        { name: "AI Crop Advisor", description: "Quantum-powered recommendations" },
        { name: "Digital Twin", description: "Real-time geospatial monitoring" },
        { name: "Subsidy Portal", description: "Government grant applications and tracking" }
      ],
      database: {
        collections: 18,
        authProviders: ["email"]
      },
      generatedAt: new Date().toISOString()
    };
  }
};