import React from 'react';
import Header from '../components/Header';
import Intro from '../components/Intro';
import Experience from '../components/Experience';
import Education from '../components/Education';
import Certifications from '../components/Certifications';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col bg-white text-black min-h-screen font-mono">
      <Header />
      <Intro />
      <Experience />
      <Education />
      <Certifications />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;