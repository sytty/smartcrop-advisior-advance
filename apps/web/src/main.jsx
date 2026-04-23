import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { errorService } from '@/lib/errorDetectionService.js';

// Initialize global error detection (window.onerror, unhandledrejection, console.error intercept)
errorService.init();

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);