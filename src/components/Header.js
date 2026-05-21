// src/components/Header.js
import React, { useState } from 'react';
import Logo from './Logo'; // Import the Logo component if you've created it

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleLogoClick = (e) => {
    // Call the function to reveal the celebration button
    if (window.revealCelebration) {
      window.revealCelebration();
    }
  };

  return (
    <div className="bg-black text-white p-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a 
          href="https://yashwanthanantha.us" 
          className="text-2xl font-mono"
          onClick={handleLogoClick}
        >
          <Logo size={30} />
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 text-sm">
          <button 
            onClick={() => scrollToSection('experience')} 
            className="uppercase hover:text-gray-400 transition-colors"
          >
            Experience
          </button>
          <button 
            onClick={() => scrollToSection('education')} 
            className="uppercase hover:text-gray-400 transition-colors"
          >
            Education
          </button>
          <button 
            onClick={() => scrollToSection('certifications')} 
            className="uppercase hover:text-gray-400 transition-colors"
          >
            Certifications
          </button>
          <button 
            onClick={() => scrollToSection('projects')} 
            className="uppercase hover:text-gray-400 transition-colors"
          >
            Projects
          </button>
          <button 
            onClick={() => scrollToSection('skills')} 
            className="uppercase hover:text-gray-400 transition-colors"
          >
            Skills
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="uppercase hover:text-gray-400 transition-colors"
          >
            Contact
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            // Close (X) icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            // Hamburger icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black z-20 border-t border-gray-800">
          <div className="flex flex-col p-4">
            <button 
              onClick={() => scrollToSection('experience')} 
              className="py-3 px-4 uppercase hover:bg-gray-900 transition-colors text-left"
            >
              Experience
            </button>
            <button 
              onClick={() => scrollToSection('education')} 
              className="py-3 px-4 uppercase hover:bg-gray-900 transition-colors text-left"
            >
              Education
            </button>
            <button 
              onClick={() => scrollToSection('certifications')} 
              className="py-3 px-4 uppercase hover:bg-gray-900 transition-colors text-left"
            >
              Certifications
            </button>
            <button 
              onClick={() => scrollToSection('projects')} 
              className="py-3 px-4 uppercase hover:bg-gray-900 transition-colors text-left"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('skills')} 
              className="py-3 px-4 uppercase hover:bg-gray-900 transition-colors text-left"
            >
              Skills
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="py-3 px-4 uppercase hover:bg-gray-900 transition-colors text-left"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;