
import React from 'react';

interface Props {
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionHeading: React.FC<Props> = ({ title, subtitle, light }) => {
  return (
    <div className="mb-12 text-center">
      <h2 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${light ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      {subtitle && <p className={`max-w-2xl mx-auto ${light ? 'text-gray-200' : 'text-gray-600'}`}>{subtitle}</p>}
      <div className={`w-24 h-1 mx-auto mt-4 rounded-full ${light ? 'bg-white' : 'bg-emerald-theme'}`}></div>
    </div>
  );
};

export default SectionHeading;
