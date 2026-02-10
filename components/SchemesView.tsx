import React, { useMemo } from 'react';
import { getSchemes, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface SchemesViewProps {
  lang: Language;
  onOpenMenu: () => void;
}

export const SchemesView: React.FC<SchemesViewProps> = ({ lang, onOpenMenu }) => {
  const t = TRANSLATIONS[lang];
  const schemes = useMemo(() => getSchemes(lang), [lang]);

  return (
    <div className="pb-24 px-4 pt-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
       <div className="mb-6 flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.schemes}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Government Benefits</p>
        </div>
        <button 
            onClick={onOpenMenu}
            className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-full flex items-center justify-center text-gray-700 dark:text-white"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        {schemes.map((scheme, idx) => (
            <a 
                key={idx} 
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group"
            >
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-farm-600 dark:group-hover:text-farm-400 transition-colors">{scheme.name}</h3>
                        <p className="text-xs text-farm-600 dark:text-farm-400 font-medium bg-farm-50 dark:bg-farm-900/30 px-2 py-1 rounded-md inline-block mt-1">
                            {scheme.localName}
                        </p>
                    </div>
                    <div className="text-farm-600 dark:text-farm-400 bg-white dark:bg-gray-800 border border-farm-200 dark:border-gray-700 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-farm-50 dark:group-hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </div>
                </div>
                
                <div className="space-y-3 pt-2 border-t border-gray-50 dark:border-gray-800">
                    <div className="flex gap-3">
                        <div className="min-w-[4px] bg-green-500 rounded-full"></div>
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Benefit</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{scheme.benefits}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="min-w-[4px] bg-blue-400 rounded-full"></div>
                        <div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Eligibility</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.eligibility}</p>
                        </div>
                    </div>
                </div>
            </a>
        ))}
      </div>
    </div>
  );
};