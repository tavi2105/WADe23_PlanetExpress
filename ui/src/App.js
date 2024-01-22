import React from 'react';
import {
  Route,
  BrowserRouter,
  Routes
} from 'react-router-dom'
import Welcome from './routes/Welcome/index'
import MigrationMap from './routes/MigrationMap';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div style={{ height: '100vh', display: 'flex', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/migration" element={<MigrationMap />} />
        </Routes>
      </div>
    </BrowserRouter>
  );

}

export default App;