import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import ScrollToTop from './components/ScrollToTop';
import Celebration from './components/Celebration';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
      <Celebration />
      <Chatbot />
    </>
  );
}

export default App;
