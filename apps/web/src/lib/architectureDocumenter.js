export const architectureDocumenter = {
  generate() {
    return {
      frontend: {
        framework: 'React 18.3.1',
        routing: 'React Router 7.13.0',
        state: 'Context API + Local State',
        styling: 'TailwindCSS 3.4.17 + shadcn/ui',
        structure: 'Feature-based component architecture with shared UI library'
      },
      backend: {
        database: 'PocketBase 0.25.0',
        api: 'Express.js Custom Server',
        auth: 'PocketBase JWT Auth'
      },
      database: {
        collections: 18,
        keyCollections: ['users', 'diagnoses', 'subsidy_applications', 'crop_data']
      },
      dataFlow: 'Client -> API Server / PocketBase -> Database -> Client (Real-time via SSE/WebSockets)'
    };
  }
};