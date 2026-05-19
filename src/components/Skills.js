import React from 'react';
import portfolioData from '../data/portfolioData';

const Skills = () => {
  const skillCategories = [
    { title: "Frontend & UI/UX", data: portfolioData.skills[0].technologies.split(', ') },
    { title: "Backend & APIs", data: portfolioData.skills[1].technologies.split(', ') },
    { title: "DATABASES", data: portfolioData.skills[2].technologies.split(', ') },
    { title: "Cloud & DevOps", data: portfolioData.skills[3].technologies.split(', ') }
  ];

  return (
    <div id="skills" className="bg-white text-black py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-16">
          <h2 className="text-6xl font-mono font-bold mb-2">
            SKILLS
          </h2>
          <div className="h-1 w-24 bg-black"></div>
        </div>

        <div className="space-y-12">
          {skillCategories.map((category, index) => (
            <div key={index} className="border-b-4 border-black pb-6">

              <h3 className="text-3xl font-mono font-bold mb-4">
                {category.title}
              </h3>

              <p className="font-mono text-xl leading-relaxed">
                {category.data.join(' • ')}
              </p>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Skills;