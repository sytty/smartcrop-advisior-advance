export const completeTroubleshootingGuide = {
  generate() {
    return {
      commonIssues: [
        { issue: 'Authentication Token Expired', solution: 'User will be automatically redirected to login. Clear localStorage if loop occurs.' },
        { issue: 'Real-time Data Not Updating', solution: 'Check WebSocket/SSE connection in network tab. Verify PocketBase subscription rules.' },
        { issue: 'RTL Layout Broken', solution: 'Ensure <html dir="rtl"> is set and Tailwind RTL variants are compiling.' }
      ],
      errorMessages: [
        { code: '403 Forbidden', meaning: 'User lacks role permissions for this collection.', action: 'Verify user role in Admin Dashboard.' },
        { code: '429 Too Many Requests', meaning: 'API rate limit exceeded.', action: 'Implement exponential backoff on client.' }
      ],
      recoveryProcedures: [
        { name: 'Database Restore', steps: '1. Access PocketBase Admin. 2. Go to Backups. 3. Select latest snapshot and restore.' },
        { name: 'Clear Client Cache', steps: '1. Open DevTools. 2. Application Tab. 3. Clear Site Data.' }
      ]
    };
  }
};