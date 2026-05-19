import React from 'react';
import { Link } from 'react-router-dom';
import portfolioData from '../data/portfolioData';

const Projects = () => {
  return (
    <div id="projects" className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-6xl font-mono font-bold mb-2">PROJECTS</h2>
          <div className="h-1 w-24 bg-white"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {portfolioData.projects.map((project) => (
            <div key={project.id} className="group">
              <div className="border-8 border-white mb-4">
                <img src={project.image || "/placeholder.jpg"} alt={`Project ${project.name}`} className="w-full grayscale h-72 object-cover" />
              </div>
              <div className="px-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-mono font-bold">{project.name}</h3>
                  <span className="bg-white text-black p-1 text-xs font-mono">{project.year}</span>
                </div>
                <p className="font-mono mb-4 text-gray-300">{project.summary}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-xs border border-white px-2 py-1 font-mono text-white">{tech}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/project/${project.id}`}
                    className="font-mono text-sm uppercase bg-white text-black px-3 py-1 hover:bg-gray-200 transition-colors inline-block"
                  >
                    View Project
                  </Link>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm uppercase border border-white text-white px-3 py-1 hover:bg-white hover:text-black transition-colors inline-block"
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;