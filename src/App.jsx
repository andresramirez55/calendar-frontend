import React from 'react';
import { EventProvider } from './contexts/EventContext';
import Layout from './components/Layout/Layout';
import MainApp from './components/MainApp/MainApp';

function App() {
  return (
    <EventProvider>
      <Layout>
        <MainApp />
      </Layout>
    </EventProvider>
  );
}

export default App;
