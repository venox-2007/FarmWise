import React from 'react';
import { AppView, Language, UserRole } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  lang: Language;
  userRole: UserRole;
  cartCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, lang, userRole, cartCount }) => {
  const t = TRANSLATIONS[lang];
  
  const cartIcon = (active: boolean) => (
      <div className="relative">
          <span className="text-2xl">🛒</span>
          {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 font-bold">
                  {cartCount}
              </span>
          )}
      </div>
  );

  const farmerNavItems = [
    { id: AppView.HOME, label: t.home, icon: (active: boolean) => <span className="text-2xl">🏠</span> },
    { id: AppView.CAMERA, label: t.scan, icon: (active: boolean) => <span className="text-2xl">📷</span> },
    { id: AppView.LIVE, label: 'Live AI', icon: (active: boolean) => <div className="relative"><span className="text-2xl">🎙️</span><span className="absolute -top-1 -right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-farm-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-farm-500"></span></span></div> },
    { id: AppView.MARKET, label: t.mandi, icon: (active: boolean) => <span className="text-2xl">📊</span> },
    { id: AppView.SCHEMES, label: t.schemes, icon: (active: boolean) => <span className="text-2xl">📜</span> },
  ];

  const consumerNavItems = [
    { id: AppView.MARKET, label: t.shop, icon: (active: boolean) => <span className="text-2xl">🛍️</span> },
    { id: AppView.CART, label: t.cart, icon: cartIcon },
  ];

  const navItems = userRole === 'farmer' ? farmerNavItems : consumerNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-2 py-3 flex justify-around items-center z-50 safe-area-bottom transition-colors duration-300">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
            <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center w-full transition-all duration-200 ${
                isActive ? 'transform -translate-y-1' : 'opacity-60 hover:opacity-100'
            }`}
            >
            <div className={`mb-1 filter ${isActive ? 'drop-shadow-sm' : 'grayscale'} ${isActive ? '' : 'dark:invert dark:opacity-70'}`}>
                {item.icon(isActive)}
            </div>
            <span className={`text-[9px] font-semibold tracking-wide ${
                isActive ? 'text-farm-600 dark:text-farm-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
                {item.label}
            </span>
            </button>
        )
      })}
    </nav>
  );
};
