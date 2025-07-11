import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Page Components
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import Tasks from './pages/Tasks';
import Meetings from './pages/Meetings';
import Pledges from './pages/Pledges';
import Analytics from './pages/Analytics';
import TripSetup from './pages/TripSetup';
import TripPlanner from './pages/TripPlanner';

// Providers
import { TripProvider } from './context/TripContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <TripProvider>
        <NotificationProvider>
          <Router>
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/setup" element={<TripSetup />} />
                      <Route path="/timeline" element={<Timeline />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/trip-planner" element={<TripPlanner />} />
                      <Route path="/meetings" element={<Meetings />} />
                      <Route path="/pledges" element={<Pledges />} />
                      <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                  </AnimatePresence>
                </main>
              </div>
            </div>
          </Router>
        </NotificationProvider>
      </TripProvider>
    </DndProvider>
  );
}

export default App;