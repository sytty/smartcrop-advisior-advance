export const detailedArchitectureDoc = {
  generate() {
    return {
      frontend: {
        stack: 'React 18.3.1, React Router 7.13.0, TailwindCSS 3.4.17',
        stateManagement: 'Context API (AuthContext) + Local State',
        styling: 'TailwindCSS + shadcn/ui + Framer Motion',
        i18n: 'i18next with 16 languages and RTL support'
      },
      backend: {
        stack: 'Express.js API Server',
        middleware: 'Auth, Validation, CORS, Rate Limiting, Error Handling',
        logging: 'Structured request/error logging'
      },
      database: {
        provider: 'PocketBase 0.25.0',
        collections: 18,
        keyCollections: ['users', 'diagnoses', 'subsidy_applications', 'crop_data', 'weather_data'],
        security: 'Role-based access control (RBAC) via Collection Rules'
      },
      authentication: {
        flow: 'Email/Password → JWT → LocalStorage',
        features: 'Password Reset, Email Verification, Session Management'
      },
      dataFlow: {
        read: 'Client → API/PocketBase → DB → Client',
        write: 'Client Form → Validation → API/PocketBase → DB'
      }
    };
  }
};