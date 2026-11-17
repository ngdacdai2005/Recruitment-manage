import React from 'react';
import { AppBootstrap } from './AppBootstrap';
import { AppRoutes } from './router';

export const App: React.FC = () => {
  return (
    <AppBootstrap>
      <AppRoutes />
    </AppBootstrap>
  );
};

export default App;
