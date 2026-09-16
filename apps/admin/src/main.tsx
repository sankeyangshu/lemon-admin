import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@workspace/web-ui/globals.css';
import App from './App.tsx';
import { setupI18n } from './locales';

async function bootstrap() {
  const container = document.getElementById('root');

  if (!container) return;

  await setupI18n();

  const root = createRoot(container);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap();
