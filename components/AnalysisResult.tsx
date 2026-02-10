import React from 'react';
import { DiagnosisResult, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AnalysisResultProps {
  result: DiagnosisResult;
  onReset: () => void;
  lang: Language;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset, lang }) => {
  const t = TRANSLATIONS[lang];
  const isHealthy = result.diseaseName.toLowerCase().includes('healthy') || result.treatment.length === 0;

  return (
    <div className="pb-24 px-5 pt-6 animate-fade-in bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Header Card */}
      <div className={`rounded-3xl p-6 mb-6 text-white shadow-lg relative overflow-hidden ${isHealthy ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-rose-500 to-red-600'}`}>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-1">
                <span className="text-white/80 text-xs font-bold uppercase tracking-wider">{t.crop_diagnosis}</span>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">{result.confidence}% Match</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-1">{result.diseaseName}</h2>
            <p className="text-lg text-white/90 font-medium mb-4">{result.marathiName}</p>
            
            {!isHealthy && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {result.symptoms.slice(0, 3).map((s, i) => (
                        <span key={i} className="bg-black/20 text-xs px-2.5 py-1 rounded-md font-medium border border-white/10">{s}</span>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 mb-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
            {t.analysis}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm font-medium">{result.explanation}</p>
      </div>

      {/* Treatment Plan */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 mb-4">
        <h3 className="text-sm font-bold text-farm-600 dark:text-farm-400 uppercase tracking-wide mb-4 flex items-center gap-2">
            {t.treatment}
        </h3>
        <div className="space-y-4">
            {result.treatment.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-farm-50 dark:bg-farm-900 text-farm-600 dark:text-farm-400 rounded-full flex items-center justify-center font-bold text-xs border border-farm-100 dark:border-farm-800 shadow-sm">{idx + 1}</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-snug pt-0.5">{step}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Fertilizer */}
       <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-900/20 p-5 mb-8">
        <h3 className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wide mb-2 flex items-center gap-2">
            {t.fertilizer}
        </h3>
        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">{result.fertilizerAdvice}</p>
      </div>

      <button 
        onClick={onReset}
        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
      >
        <span>{t.scan}</span>
        <span>↺</span>
      </button>

      <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-6 px-4 pb-4">
        {t.consult_disclaimer}
      </p>
    </div>
  );
};