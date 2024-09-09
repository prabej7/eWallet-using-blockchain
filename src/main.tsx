import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ActorProvider, AgentProvider } from '@ic-reactor/react';
import { idlFactory, canisterId } from './declarations/backend';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AgentProvider withProcessEnv>
      <ActorProvider idlFactory={idlFactory} canisterId={canisterId}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ActorProvider>
    </AgentProvider>
  </React.StrictMode>,
);
