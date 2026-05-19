import React from 'react';

const Footer = () => {
  return (
    <div className="bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-mono font-bold">YASHWANTH.DEV</h2>
            <p className="font-mono text-sm text-gray-400">© {new Date().getFullYear()} All Rights Reserved</p>
          </div>
          
          <div className="flex gap-8">
            <a href="https://github.com/Yashwanth1129" target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:text-gray-400 transition-colors">GITHUB</a>
            <a href="https://www.linkedin.com/in/yashwanth-anantha-13a099192/" target="_blank" rel="noopener noreferrer" className="font-mono text-sm hover:text-gray-400 transition-colors">LINKEDIN</a>
            <a href="mailto:yashwanthanantha99@gmail.com" className="font-mono text-sm hover:text-gray-400 transition-colors">EMAIL</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;