import React from 'react';
import portfolioData from '../data/portfolioData';
import { publicAsset } from '../config/publicAsset';

const Certifications = () => {
  return (
    <div id="certifications" className="bg-white text-black py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-6xl font-mono font-bold mb-2">CERTIFICATIONS</h2>
          <div className="h-1 w-24 bg-black"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioData.certifications.map((cert) => (
            <div
              key={cert.id}
              className="border-8 border-black p-8 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex justify-between items-start mb-4 gap-4">
                  <span className="bg-black text-white px-2 py-1 text-xs font-mono font-bold shrink-0">
                    {cert.code}
                  </span>
                  <span className="font-mono text-xs text-gray-600 uppercase">{cert.issuer}</span>
                </div>
                <h3 className="text-2xl font-mono font-bold mb-2 leading-tight">
                  {cert.issuer} {cert.code}
                </h3>
                <p className="font-mono text-gray-700 text-lg">{cert.name}</p>
              </div>

              <a
                href={publicAsset(cert.credentialUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 font-mono text-sm uppercase bg-black text-white px-4 py-3 hover:bg-gray-900 transition-colors inline-block self-start"
              >
                VIEW CERTIFICATE ↓
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certifications;
