import React from 'react';
import portfolioData from '../data/portfolioData';

const Experience = () => {
  return (
    <div id="experience" className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-6xl font-mono font-bold mb-2">EXPERIENCE</h2>
          <div className="h-1 w-24 bg-white"></div>
        </div>
        
        <div className="border-8 border-white p-8">
          <h3 className="text-2xl font-mono font-bold mb-6">WORK EXPERIENCE</h3>
          
          {portfolioData.experience.map((exp, index) => (
  <div
    key={index}
    className={`mb-8 ${
      index < portfolioData.experience.length - 1
        ? 'border-b border-gray-700 pb-4'
        : ''
    }`}
  >
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-mono font-bold">{exp.title}</h4>

      <span className="bg-white text-black p-1 text-xs font-mono">
        {exp.startDate}-{exp.endDate}
      </span>
    </div>

    <p className="font-mono text-sm mb-3 text-gray-300">
      {exp.company}
      {exp.location ? `, ${exp.location}` : ''}
    </p>

    {Array.isArray(exp.description) ? (
      <ul className="list-disc pl-5 space-y-2 text-gray-400 font-mono text-sm">
        {exp.description.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    ) : (
      <p className="font-mono text-sm text-gray-400">
        {exp.description}
      </p>
    )}
  </div>
))}
        </div>
      </div>
    </div>
  );
};

export default Experience;