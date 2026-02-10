import React from 'react';
import { User, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MenuBarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  lang: Language;
  setLang: (lang: Language) => void;
  darkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  isOpen, onClose, user, lang, setLang, darkMode, toggleTheme, onLogout
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang]; // In a real app, translate menu items too

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'മലയാളം' },
    { code: 'or', label: 'ଓଡ଼ିଆ' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-80 bg-white dark:bg-gray-900 h-full shadow-2xl p-6 flex flex-col animate-slide-in-right border-l dark:border-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-bold text-gray-900 dark:text-white">Menu</span>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            &times;
            </button>
        </div>

        {/* User Profile */}
        <div className="mb-8 flex flex-col items-center">
           <div className="w-20 h-20 bg-gradient-to-br from-farm-400 to-farm-600 rounded-full flex items-center justify-center text-4xl mb-3 shadow-lg ring-4 ring-white dark:ring-gray-800">
             👨‍🌾
           </div>
           <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || 'Farmer'}</h2>
           <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
             📍 {user?.location || 'India'}
           </p>
        </div>

        {/* Settings */}
        <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6">
          
          {/* Dark Mode Toggle */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
                <span className="text-xl">{darkMode ? '🌙' : '☀'}</span>
                <span className="font-medium text-gray-700 dark:text-gray-200">App Theme</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-farm-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Language</label>
            <div className="grid grid-cols-2 gap-3">
               {languages.map((l) => (
                 <button
                   key={l.code}
                   onClick={() => setLang(l.code as Language)}
                   className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                       lang === l.code 
                       ? 'bg-farm-50 dark:bg-farm-900/50 border-farm-500 text-farm-700 dark:text-farm-400 ring-1 ring-farm-500' 
                       : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                   }`}
                 >
                   {l.label}
                 </button>
               ))}
            </div>
          </div>

          {/* Customer Support */}
          <div>
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Support</label>
             <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-4 border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                        📞
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">+91 1800-456-7890</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Toll Free • 24/7</p>
                    </div>
                </div>
                
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        ✉️
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">support@farmwise.ai</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Response within 24h</p>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <p className="text-xs text-center font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                        <span>🕒</span> Mon - Sat • 9:00 AM - 6:00 PM
                    </p>
                </div>
             </div>
          </div>

        </div>

        {/* Logout */}
        <button onClick={onLogout} className="mt-4 w-full py-3.5 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
           <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};