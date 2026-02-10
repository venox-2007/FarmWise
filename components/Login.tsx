import React, { useState } from 'react';
import { TRANSLATIONS, LOCATIONS } from '../constants';
import { Language, User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User, lang: Language) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(LOCATIONS[1]);
  const [role, setRole] = useState<UserRole | null>(null);

  const t = TRANSLATIONS[selectedLang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone && role) {
      onLogin({ name, phone, location, role }, selectedLang);
    }
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'Aa' },
    { code: 'hi', label: 'Hindi', native: 'अ' },
    { code: 'mr', label: 'Marathi', native: 'म' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰ' },
    { code: 'gu', label: 'Gujarati', native: 'ગ' },
    { code: 'bn', label: 'Bengali', native: 'অ' },
    { code: 'ta', label: 'Tamil', native: 'அ' },
    { code: 'te', label: 'Telugu', native: 'అ' },
    { code: 'kn', label: 'Kannada', native: 'ಅ' },
    { code: 'ml', label: 'Malayalam', native: 'അ' },
    { code: 'or', label: 'Odia', native: 'ଅ' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-farm-50 to-farm-100 dark:from-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-farm-200 dark:bg-farm-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-200 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-sm z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          {/* Custom SVG Logo to avoid broken images */}
          <svg width="220" height="120" viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 drop-shadow-xl">
             {/* Plant Stem & Leaves */}
             <path d="M150 130V60" stroke="#16a34a" strokeWidth="4" strokeLinecap="round"/>
             <path d="M150 130C150 130 150 110 120 90C120 90 110 110 150 130Z" fill="url(#leaf-gradient-left)"/>
             <path d="M150 110C150 110 150 80 190 60C190 60 200 80 150 110Z" fill="url(#leaf-gradient-right)"/>
             <path d="M150 90C150 90 140 60 110 50C110 50 120 70 150 90Z" fill="#86efac"/>
             <circle cx="150" cy="40" r="12" fill="#d9f99d"/>
             
             {/* Connection Line & Dot */}
             <path d="M70 145H230" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round"/>
             <circle cx="150" cy="145" r="8" fill="white" stroke="#0ea5e9" strokeWidth="3" className="animate-pulse"/>

             {/* Text */}
             <text x="75" y="115" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="36" fill="#a3e635" letterSpacing="2">FARM</text>
             <text x="180" y="115" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="36" fill="#38bdf8" letterSpacing="2">WISE</text>

             {/* Gradients */}
             <defs>
                <linearGradient id="leaf-gradient-left" x1="120" y1="90" x2="150" y2="130" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4ade80"/>
                    <stop offset="1" stopColor="#16a34a"/>
                </linearGradient>
                <linearGradient id="leaf-gradient-right" x1="190" y1="60" x2="150" y2="110" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22c55e"/>
                    <stop offset="1" stopColor="#15803d"/>
                </linearGradient>
             </defs>
          </svg>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight mt-2">{t.welcome}</h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">{t.subtitle}</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 border border-white/50 dark:border-gray-700/50">
          
          {!role ? (
            <>
                {/* Language Selector */}
                <div className="mb-8">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase text-center mb-4 tracking-widest">Select Language</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setSelectedLang(lang.code)}
                            className={`w-[calc(33.33%-0.5rem)] sm:w-[calc(25%-0.5rem)] flex flex-col items-center justify-center py-3 px-1 rounded-2xl transition-all duration-200 border-2 ${
                            selectedLang === lang.code
                                ? 'bg-farm-50 dark:bg-farm-900/40 border-farm-500 shadow-lg scale-105 z-10'
                                : 'bg-white dark:bg-gray-700/50 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                            }`}
                        >
                            <span className={`text-lg font-bold mb-1 ${selectedLang === lang.code ? 'text-farm-700 dark:text-farm-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {lang.native}
                            </span>
                            <span className={`text-[9px] font-bold uppercase tracking-wide truncate w-full text-center ${selectedLang === lang.code ? 'text-farm-600 dark:text-farm-400' : 'text-gray-400'}`}>
                            {lang.label}
                            </span>
                        </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 animate-fade-in">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase text-center mb-2 tracking-widest">I am a</p>
                     <button 
                        onClick={() => setRole('farmer')}
                        className="w-full bg-gradient-to-r from-farm-50 to-white dark:from-farm-900/40 dark:to-gray-800 hover:from-farm-100 dark:hover:from-farm-900/60 border border-farm-100 dark:border-farm-800 p-4 rounded-2xl flex items-center gap-4 transition-all group shadow-sm hover:shadow-md"
                     >
                        <div className="w-12 h-12 bg-farm-100 dark:bg-farm-800 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👨‍🌾</div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.role_farmer}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sell crops, check diseases</p>
                        </div>
                        <div className="ml-auto text-gray-300 group-hover:text-farm-500 transition-colors">➔</div>
                     </button>
                     <button 
                        onClick={() => setRole('consumer')}
                        className="w-full bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 hover:from-blue-100 dark:hover:from-blue-900/30 border border-blue-100 dark:border-blue-800 p-4 rounded-2xl flex items-center gap-4 transition-all group shadow-sm hover:shadow-md"
                     >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🏠</div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t.role_consumer}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Buy fresh from farms</p>
                        </div>
                        <div className="ml-auto text-gray-300 group-hover:text-blue-500 transition-colors">➔</div>
                     </button>
                </div>
            </>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5 animate-fade-in py-2">
              <div 
                className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-farm-600 transition-colors" 
                onClick={() => setRole(null)}
              >
                  <span>← BACK</span>
              </div>
              
              <div className="text-center mb-6">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {role === 'farmer' ? 'Farmer Login' : 'Consumer Login'}
                 </h2>
                 <p className="text-sm text-gray-500">Enter your details to continue</p>
              </div>

              <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Full Name</label>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.name_placeholder}
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-farm-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    required
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Phone Number</label>
                    <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phone_placeholder}
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-farm-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    required
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">{t.location_label}</label>
                    <div className="relative">
                        <select 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-farm-500 focus:border-transparent transition-all text-gray-900 dark:text-white appearance-none"
                        >
                        {LOCATIONS.map((loc, idx) => (
                            <option key={idx} value={loc} className="dark:bg-gray-800">{loc}</option>
                        ))}
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                        </div>
                    </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-farm-600 to-farm-500 hover:from-farm-700 hover:to-farm-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-farm-200/50 dark:shadow-none active:scale-[0.98] transition-all mt-6 text-lg"
              >
                {t.login_btn}
              </button>
            </form>
          )}
        </div>
        
        <div className="text-center mt-8 opacity-60">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">
                FarmWise AI • Powered by Gemini 3
            </p>
        </div>
      </div>
    </div>
  );
};