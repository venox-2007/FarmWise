import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { CameraCapture } from './components/CameraCapture';
import { AnalysisResult } from './components/AnalysisResult';
import { MarketView } from './components/MarketView';
import { SchemesView } from './components/SchemesView';
import { MenuBar } from './components/MenuBar';
import { Cart } from './components/Cart';
import { LiveVoiceAssistant } from './components/LiveVoiceAssistant';
import { AppView, DiagnosisResult, Language, User, CartItem, InputProduct } from './types';
import { analyzeCropImage } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [analysisResult, setAnalysisResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Initialize theme from system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const handleLogin = (userInfo: User, language: Language) => {
    setUser(userInfo);
    setLang(language);
    // Determine initial view based on role
    if (userInfo.role === 'consumer') {
        setView(AppView.MARKET);
    } else {
        setView(AppView.HOME);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]); // Clear cart on logout
    setView(AppView.LOGIN);
    setIsMenuOpen(false);
  };

  const handleCapture = async (base64: string) => {
    setIsLoading(true);
    try {
        const result = await analyzeCropImage(base64, "Analyze this plant.", lang);
        setAnalysisResult(result);
        setView(AppView.ANALYSIS);
    } catch (err) {
        alert("Analysis failed. Please try again.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const updateLocation = (loc: string) => {
    if (user) {
      setUser({ ...user, location: loc });
    }
  }

  const resetAnalysis = () => {
      setAnalysisResult(null);
      setView(AppView.CAMERA);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const showToast = (msg: string) => {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(null), 2000);
  };

  // Cart Functions
  const addToCart = (product: InputProduct) => {
      setCart(prev => {
          const existing = prev.find(item => item.id === product.id);
          if (existing) {
              return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
          }
          return [...prev, { ...product, quantity: 1 }];
      });
      showToast(`${product.name} added!`);
  };

  const updateCartQuantity = (id: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
      }));
  };

  const removeFromCart = (id: string) => {
      setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-white max-w-md mx-auto shadow-2xl overflow-hidden relative transition-colors duration-300">
        
        {/* Toast Notification */}
        {toastMsg && (
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-900/95 dark:bg-white/95 text-white dark:text-gray-900 px-6 py-3 rounded-full text-sm font-bold shadow-2xl z-[60] animate-fade-in flex items-center gap-2 backdrop-blur-sm border border-white/10 dark:border-gray-200">
                <span className="text-lg">✅</span> <span>{toastMsg}</span>
            </div>
        )}

        {/* Render View */}
        {currentView === AppView.LOGIN ? (
             <Login onLogin={handleLogin} />
        ) : (
            <>
                {/* Content */}
                {(() => {
                    switch (currentView) {
                    case AppView.HOME:
                        return (
                        <Dashboard 
                            onStartScan={() => setView(AppView.CAMERA)} 
                            user={user!} 
                            lang={lang} 
                            setLang={setLang}
                            setLocation={updateLocation}
                            onOpenMenu={toggleMenu}
                        />
                        );
                    case AppView.CAMERA:
                        return <CameraCapture onCapture={handleCapture} isLoading={isLoading} lang={lang} />;
                    case AppView.ANALYSIS:
                        return analysisResult ? <AnalysisResult result={analysisResult} onReset={resetAnalysis} lang={lang} /> : <div className="p-4 dark:text-white">No result</div>;
                    case AppView.MARKET:
                        return (
                            <MarketView 
                                lang={lang} 
                                onOpenMenu={toggleMenu} 
                                userRole={user!.role} 
                                onAddToCart={addToCart}
                                location={user!.location}
                            />
                        );
                    case AppView.CART:
                        return (
                            <Cart 
                                cart={cart} 
                                updateQuantity={updateCartQuantity} 
                                removeFromCart={removeFromCart} 
                                clearCart={clearCart} 
                                lang={lang}
                            />
                        );
                    case AppView.SCHEMES:
                        return <SchemesView lang={lang} onOpenMenu={toggleMenu} />;
                    case AppView.LIVE:
                        return <LiveVoiceAssistant user={user!} lang={lang} onClose={() => setView(AppView.HOME)} />;
                    default:
                        return null;
                    }
                })()}

                {/* Bottom Nav */}
                {currentView !== AppView.LOGIN && currentView !== AppView.LIVE && (
                    <Navigation 
                        currentView={currentView} 
                        setView={setView} 
                        lang={lang} 
                        userRole={user!.role}
                        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
                    />
                )}

                {/* Menu Overlay */}
                <MenuBar 
                    isOpen={isMenuOpen} 
                    onClose={() => setIsMenuOpen(false)}
                    user={user}
                    lang={lang}
                    setLang={setLang}
                    darkMode={darkMode}
                    toggleTheme={() => setDarkMode(!darkMode)}
                    onLogout={handleLogout}
                />
            </>
        )}
      </div>
    </div>
  );
};

export default App;
