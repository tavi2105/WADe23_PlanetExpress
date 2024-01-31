import React from 'react';
import {
  Route,
  BrowserRouter,
  Routes
} from 'react-router-dom'
import Welcome from './routes/Welcome/index'
import MigrationMap from './routes/MigrationMap';
import AddEvent from './routes/AddEvent';
import './App.css';
import { HistoryProvider } from './context/historyContext';

function App() {
  return (
    <BrowserRouter>
      <div style={{ height: '100vh', display: 'flex', flex: 1 }}>
        <HistoryProvider>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/migration" element={<MigrationMap />} />
            <Route path="/event" element={<AddEvent />} />
          </Routes>
        </HistoryProvider>
      </div>
    </BrowserRouter>
  );

}

export default App;