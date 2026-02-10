import React, { useState, useEffect } from 'react';
import { getMarketPricesForLocation, TRANSLATIONS, LOCATIONS } from '../constants';
import { askAdvisor, getWeather, reverseGeocode, AIMode } from '../services/geminiService';
import { Language, User, WeatherData, MarketItem } from '../types';

interface DashboardProps {
    onStartScan: () => void;
    user: User;
    lang: Language;
    setLang: (l: Language) => void;
    setLocation: (loc: string) => void;
    onOpenMenu: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartScan, user, lang, setLocation, onOpenMenu }) => {
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isChatting, setIsChatting] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [aiMode, setAiMode] = useState<AIMode>('fast');
  
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    setMarketData(getMarketPricesForLocation(user.location, lang));
    const fetchWeather = async () => {
        setWeather(null);
        const w = await getWeather(user.location);
        setWeather(w);
    };
    fetchWeather();
  }, [user.location, lang]);

  const handleAsk = async (queryOverride?: string, modeOverride?: AIMode) => {
      const query = queryOverride || chatInput;
      const mode = modeOverride || aiMode;

      if (!query.trim()) return;
      setIsChatting(true);
      const answer = await askAdvisor(query, lang, user.location, mode);
      setChatResponse(answer || "Could not get an answer.");
      setIsChatting(false);
      if (!queryOverride) setChatInput("");
  };

  const handleModeSelect = (mode: AIMode) => {
      setAiMode(mode);
      if (mode === 'store') {
          const autoQuery = `Find agricultural stores, fertilizer shops, and seeds dealers near ${user.location}`;
          // Temporarily show the auto-query or just a placeholder
          setChatInput(autoQuery); 
          handleAsk(autoQuery, 'store');
      }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === 'Detect My Location') {
          setIsLocating(true);
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const detectedName = await reverseGeocode(latitude, longitude);
                    setLocation(detectedName);
                    setIsLocating(false);
                },
                (err) => {
                    console.error(err);
                    setIsLocating(false);
                    alert("Could not detect location. Please check permissions.");
                }
              );
          } else {
            setIsLocating(false);
            alert("Geolocation not supported by this browser.");
          }
      } else {
          setLocation(val);
      }
  };

  // Improved Markdown Formatter with Link Support
  const formatText = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
        // Link Regex: [Title](URL)
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const lineParts = [];
        let lastIndex = 0;
        let match;

        // Parse Links first
        while ((match = linkRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
                lineParts.push({ type: 'text', content: line.slice(lastIndex, match.index) });
            }
            lineParts.push({ type: 'link', content: match[1], url: match[2] });
            lastIndex = linkRegex.lastIndex;
        }
        if (lastIndex < line.length) {
            lineParts.push({ type: 'text', content: line.slice(lastIndex) });
        }

        // Render Parts (Bold support inside text)
        const renderedLine = lineParts.map((part, partIdx) => {
            if (part.type === 'link') {
                return <a key={partIdx} href={part.url} target="_blank" rel="noopener noreferrer" className="text-farm-400 hover:underline">{part.content}</a>;
            } else {
                const parts = part.content.split(/(\*\*.*?\*\*)/g);
                return (
                    <span key={partIdx}>
                        {parts.map((p, i) => {
                            if (p.startsWith('**') && p.endsWith('**')) {
                                return <strong key={i} className="font-bold text-white">{p.slice(2, -2)}</strong>;
                            }
                            return p;
                        })}
                    </span>
                );
            }
        });

        // List Item detection
        const trimmed = line.trim();
        if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
             return (
                 <li key={idx} className="flex gap-2 mb-1 text-gray-300 items-start">
                     <span className="text-farm-400 mt-1">•</span>
                     <span className="flex-1 break-words">
                          {renderedLine}
                     </span>
                 </li>
             );
        }
        
        // Paragraph
        if (trimmed.length > 0) {
            return <p key={idx} className="mb-2 text-gray-300 leading-relaxed break-words">{renderedLine}</p>;
        }
        return null;
    });
  };

  const getWeatherIcon = (condition: string) => {
     switch(condition) {
         case 'Sunny': return '☀️';
         case 'Cloudy': return '☁️';
         case 'Rainy': return '🌧️';
         case 'Stormy': return '⛈️';
         case 'Foggy': return '🌫️';
         default: return '⛅';
     }
  };

  const getWeatherGradient = (condition: string) => {
      switch(condition) {
          case 'Sunny':
              return 'from-amber-400 to-orange-500';
          case 'Cloudy':
              return 'from-blue-400 to-slate-400';
          case 'Rainy':
              return 'from-blue-600 to-indigo-700';
          case 'Stormy':
              return 'from-indigo-700 to-purple-800';
          case 'Foggy':
              return 'from-slate-400 to-gray-500';
          default:
              return 'from-[#5FA4FF] to-[#6086E5]'; // Default Blue
      }
  };
  
  const getWeatherConditionText = (condition: string) => {
      return t[`weather_${condition.toLowerCase()}`] || condition;
  }

  // Date formatter
  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="pb-24 px-5 pt-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">FarmWise</h1>
            <div className="flex items-center gap-1 mt-1 text-farm-600 dark:text-farm-400 bg-white dark:bg-gray-900 px-3 py-1 rounded-full shadow-sm w-fit border border-gray-100 dark:border-gray-800">
                <span className="text-xs">📍</span>
                {isLocating ? (
                   <span className="text-xs font-semibold text-gray-500 animate-pulse">Detecting...</span>
                ) : (
                    <select 
                        value={LOCATIONS.includes(user.location) ? user.location : "Detect My Location"} 
                        onChange={handleLocationChange}
                        className="text-xs font-semibold bg-transparent outline-none max-w-[160px] truncate text-gray-700 dark:text-gray-300"
                    >
                        {LOCATIONS.map((loc, i) => <option key={i} value={loc} className="dark:bg-gray-800">{loc}</option>)}
                        {!LOCATIONS.includes(user.location) && <option value={user.location} className="dark:bg-gray-800">{user.location}</option>}
                    </select>
                )}
            </div>
        </div>
        
        <button 
            onClick={onOpenMenu}
            className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-full flex items-center justify-center text-gray-700 dark:text-white active:scale-95 transition-transform"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>
      </header>

      {/* 1. Weather Widget */}
      <div className={`rounded-3xl p-6 shadow-2xl relative overflow-hidden bg-gradient-to-b ${weather ? getWeatherGradient(weather.condition) : 'from-[#5FA4FF] to-[#6086E5]'} text-white transition-colors duration-500`}>
        {weather ? (
            <>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">{user.location.split(',')[0]}</h2>
                        <p className="text-white/80 text-sm font-medium">{todayDate}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        <span className="text-xs font-bold uppercase tracking-wide">{getWeatherConditionText(weather.condition)}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <h1 className="text-7xl font-bold tracking-tighter relative">
                        {weather.temp}<span className="text-4xl absolute top-2 align-top">°C</span>
                    </h1>
                    <div className="flex gap-4 mt-2 text-white/80 text-sm font-medium">
                        <span>Humidity: {weather.humidity}%</span>
                        <span>Wind: {weather.windSpeed} km/h</span>
                    </div>
                </div>

                {/* Alert Box (Glassmorphism) */}
                {weather.alert && (
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center gap-3 mb-6">
                        <div className="bg-yellow-400/20 p-2 rounded-full">
                             <span className="text-xl">⚠️</span>
                        </div>
                        <p className="text-sm font-semibold leading-tight flex-1">
                            {weather.alert}
                        </p>
                    </div>
                )}

                {/* Forecast Row */}
                <div className="grid grid-cols-3 divide-x divide-white/10 mt-auto">
                    {weather.forecast.map((day, idx) => (
                         <div key={idx} className="flex flex-col items-center gap-1">
                             <span className="text-white/80 text-xs font-medium">{day.day}</span>
                             <span className="text-2xl my-1 drop-shadow-sm">{getWeatherIcon(day.condition)}</span>
                             <span className="font-bold text-sm">{day.temp}°</span>
                         </div>
                    ))}
                    {weather.forecast.length === 0 && (
                        // Fallback visuals
                        ['Tue', 'Wed', 'Thu'].map((d, i) => (
                             <div key={i} className="flex flex-col items-center gap-1">
                                 <span className="text-white/80 text-xs font-medium">{d}</span>
                                 <span className="text-2xl my-1">⛅</span>
                                 <span className="font-bold text-sm">--°</span>
                             </div>
                        ))
                    )}
                </div>
            </>
        ) : (
            <div className="h-[320px] flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <p className="text-white/80 font-medium animate-pulse">Updating Weather...</p>
            </div>
        )}
      </div>

      {/* 2. Main Action - Scan */}
      <button 
        onClick={onStartScan}
        className="w-full bg-farm-600 hover:bg-farm-700 text-white rounded-2xl p-6 shadow-farm-200 dark:shadow-none shadow-lg flex items-center justify-between group active:scale-[0.99] transition-all"
      >
        <div className="text-left">
            <h3 className="font-bold text-xl">{t.crop_diagnosis}</h3>
            <p className="text-farm-100 text-sm mt-1 opacity-90">{t.instant_check}</p>
        </div>
        <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
            📸
        </div>
      </button>

      {/* 3. Market Ticker */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{t.market_pulse}</h3>
              <span className="text-[10px] bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-bold">{t.live}</span>
          </div>
          <div className="space-y-3">
              {marketData.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm animate-fade-in">
                      <div className="flex items-center gap-3">
                          <span className="w-1 h-8 rounded-full bg-gray-100 dark:bg-gray-800 block"></span>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{item.crop}</p>
                            <p className="text-[10px] text-gray-400 uppercase">{item.mandi}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">₹{item.price}</p>
                          <p className={`text-[10px] font-bold ${item.trend === 'up' ? 'text-green-500' : item.trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                              {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '—'}
                          </p>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* 4. AI Assistant - Dark Card UI */}
      <div className="bg-[#0B1221] rounded-3xl p-5 shadow-xl border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h3 className="font-bold text-white text-sm mb-4 relative z-10">{t.ask_ai}</h3>
          
          {/* Mode Chips */}
          <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar relative z-10">
              <button 
                onClick={() => handleModeSelect('fast')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    aiMode === 'fast' 
                    ? 'bg-white text-black' 
                    : 'bg-[#1E293B] text-gray-400 border border-gray-700'
                }`}
              >
                <span>⚡</span> {t.ai_fast}
              </button>
              <button 
                onClick={() => handleModeSelect('think')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    aiMode === 'think' 
                    ? 'bg-white text-black' 
                    : 'bg-[#1E293B] text-gray-400 border border-gray-700'
                }`}
              >
                <span>🧠</span> {t.ai_think}
              </button>
              <button 
                onClick={() => handleModeSelect('store')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    aiMode === 'store' 
                    ? 'bg-white text-black' 
                    : 'bg-[#1E293B] text-gray-400 border border-gray-700'
                }`}
              >
                <span>🗺️</span> {t.ai_store}
              </button>
          </div>

          {/* Input Area */}
          <div className="relative flex items-center z-10">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={t.ask_placeholder}
                className="w-full bg-[#1E293B] border border-gray-700 rounded-xl py-3.5 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-farm-500 outline-none transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              />
              <button 
                onClick={() => handleAsk()}
                disabled={isChatting}
                className="absolute right-2 w-8 h-8 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center justify-center shadow-md disabled:opacity-50 transition-colors"
              >
                {isChatting ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                )}
              </button>
          </div>

          {/* Response Area */}
          {chatResponse && (
              <div className="mt-5 bg-[#052e16]/40 p-4 rounded-xl border border-green-900/50 relative z-10 animate-fade-in">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">GEMINI RESPONSE</span>
                    {aiMode === 'think' && <span className="text-[9px] bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800">Reasoning</span>}
                    {aiMode === 'store' && <span className="text-[9px] bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">Web Search</span>}
                  </div>
                  <div className="text-sm font-light">
                     {formatText(chatResponse)}
                  </div>
              </div>
          )}
      </div>

    </div>
  );
};