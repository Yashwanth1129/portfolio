// src/components/Intro.js
import React from 'react';
import portfolioData from '../data/portfolioData';
import TypingAnimation from './TypingAnimation';

const Intro = () => {
  // This will help with GitHub Pages deployment
  const PUBLIC_URL = process.env.PUBLIC_URL || '';
  
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-7 flex flex-col justify-between">
            {/* Top section with typing animation */}
            <div>
              <TypingAnimation />
            </div>
            
            {/* Middle section with bio - with appropriate spacing */}
            <div className="mt-8 mb-16">
              <p className="font-mono">{portfolioData.profile.bio}</p>
            </div>
            
            {/* Bottom section with button */}
            <div>
              <a 
                href={`${PUBLIC_URL}/resume.pdf`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-black text-white font-mono py-3 px-6 hover:bg-gray-900 transition-colors inline-block"
              >
                VIEW RESUME ↓
              </a>
            </div>
          </div>
          
          <div className="md:col-span-5">
            <div className="relative overflow-hidden border-8 border-black">
              <img 
                src={`${PUBLIC_URL}/Yashwanth.JPG`} 
                alt="Portrait" 
                className="grayscale w-full max-h-80 md:max-h-96 object-cover object-center" 
              />
              <div className="absolute bottom-6 right-6 bg-white p-2 font-mono text-sm text-black">
                {portfolioData.profile.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;