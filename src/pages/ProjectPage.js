import React from 'react';
import { useParams, Link } from 'react-router-dom';
import portfolioData from '../data/portfolioData';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProjectPage = () => {
  const { id } = useParams();
  const project = portfolioData.projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="flex flex-col bg-white text-black min-h-screen font-mono">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-mono mb-6">Project Not Found</h2>
            <Link to="/" className="bg-black text-white font-mono py-3 px-6 hover:bg-gray-900 transition-colors">
              Return to Homepage
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white text-black min-h-screen font-mono">
      <Header />
      
      {/* Project Hero */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/" className="inline-block mb-8 text-gray-400 hover:text-white transition-colors">
            ← BACK TO PROJECTS
          </Link>
          
          <div className="mb-8">
            <h1 className="text-6xl font-mono font-bold mb-4">{project.name}</h1>
            <p className="text-xl font-mono text-gray-300 mb-6">{project.subtitle}</p>
            {project.liveUrl && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm uppercase bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors inline-block text-center"
                >
                  OPEN LIVE APP ↗
                </a>
                <span className="font-mono text-sm text-gray-400 break-all">{project.liveUrl}</span>
              </div>
            )}
            {project.liveUrlNote && (
              <p className="font-mono text-sm text-gray-500 mt-4 max-w-2xl">{project.liveUrlNote}</p>
            )}
          </div>
          
          <div className="border-8 border-white mb-12">
            <img src={project.image || "/placeholder.jpg"} alt={project.name} className="w-full grayscale" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-mono font-bold mb-4 border-b border-gray-700 pb-2">TECHNOLOGIES</h3>
              <ul className="space-y-2">
                {project.technologies.map((tech, index) => (
                  <li key={index} className="font-mono text-gray-300">{tech}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-mono font-bold mb-4 border-b border-gray-700 pb-2">CHALLENGES</h3>
              <ul className="space-y-2">
                {project.challenges.map((challenge, index) => (
                  <li key={index} className="font-mono text-gray-300">{challenge}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-mono font-bold mb-4 border-b border-gray-700 pb-2">OUTCOMES</h3>
              <ul className="space-y-2">
                {project.outcomes.map((outcome, index) => (
                  <li key={index} className="font-mono text-gray-300">{outcome}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Project Details */}
      <div className="bg-white text-black py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-mono font-bold mb-2">PROJECT DETAILS</h2>
            <div className="h-1 w-24 bg-black"></div>
          </div>
          
          <div className="space-y-8">
            {project.description.map((paragraph, index) => (
              <p key={index} className="text-lg font-mono leading-relaxed">{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-16 space-y-8">
            <div className="border-8 border-black p-8">
              <h3 className="text-2xl font-mono font-bold mb-4">KEY FEATURES</h3>
              <ul className="space-y-4">
                {project.description.slice(0, 4).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-xl">→</span>
                    <span className="font-mono">{item.replace(/^• /, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-8 border-black">
                <img src="/placeholder.jpg" alt="Project Screenshot 1" className="w-full grayscale" />
              </div>
              <div className="border-8 border-black">
                <img src="/placeholder.jpg" alt="Project Screenshot 2" className="w-full grayscale" />
              </div>
            </div>
          </div>
          
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm uppercase border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors inline-block"
              >
                OPEN LIVE APP ↗
              </a>
            )}
            <Link to="/" className="bg-black text-white font-mono py-3 px-6 hover:bg-gray-900 transition-colors inline-block">
              ← BACK TO PROJECTS
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProjectPage;