import React, { useRef, useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  isLoading: boolean;
  lang: Language;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, isLoading, lang }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const t = TRANSLATIONS[lang];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        const base64 = result.split(',')[1];
        onCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-screen bg-black p-8 text-center animate-fade-in">
        <div className="relative">
             <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center animate-pulse border-4 border-gray-700">
                <span className="text-5xl">🌱</span>
            </div>
        </div>
       
        <h3 className="text-2xl font-bold text-white mt-6 mb-2 tracking-wide">{t.analyzing}</h3>
        <p className="text-gray-400 max-w-xs mx-auto text-sm">{t.analyzing_desc}</p>
        
        <div className="mt-8 flex gap-2 justify-center">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-[#050B14] overflow-hidden relative">
        
        {/* Viewfinder Corners */}
        <div className="absolute top-10 left-8 w-16 h-16 border-t-4 border-l-4 border-gray-400 rounded-tl-xl opacity-50 pointer-events-none"></div>
        <div className="absolute top-10 right-8 w-16 h-16 border-t-4 border-r-4 border-gray-400 rounded-tr-xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-32 left-8 w-16 h-16 border-b-4 border-l-4 border-gray-400 rounded-bl-xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-32 right-8 w-16 h-16 border-b-4 border-r-4 border-gray-400 rounded-br-xl opacity-50 pointer-events-none"></div>

        {!preview ? (
            <>
                <div className="flex-1 flex flex-col justify-center items-center w-full px-6 z-10">
                    <div className="bg-[#0A101A] border border-gray-800 p-8 rounded-[2rem] shadow-2xl w-full max-w-xs text-center relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-green-500/10 blur-[50px] rounded-full"></div>

                        <div className="mb-4 relative z-10">
                            <span className="text-5xl drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">🌿</span>
                        </div>
                        
                        <h2 className="text-xl font-bold text-white mb-6 relative z-10">{t.cam_title}</h2>
                        
                        <div className="text-left space-y-3 relative z-10">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">{t.cam_tips}</p>
                            
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <span className="text-green-500 text-lg">✓</span>
                                <span>{t.cam_steady}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <span className="text-green-500 text-lg">✓</span>
                                <span>{t.cam_light}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <span className="text-green-500 text-lg">✓</span>
                                <span>{t.cam_focus}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="pb-12 w-full flex flex-col items-center justify-center z-10">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 bg-white rounded-full border-4 border-[#050B14] outline outline-4 outline-white/20 shadow-lg active:scale-95 transition-transform flex items-center justify-center"
                    >
                        <div className="w-16 h-16 bg-white rounded-full border border-gray-200"></div>
                    </button>
                    <p className="text-gray-400 text-sm font-medium mt-4">{t.tap_scan}</p>
                    
                    <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                    />
                </div>
            </>
        ) : (
             <div className="flex flex-col items-center justify-center h-full w-full">
                 <div className="relative w-full h-full">
                    <img src={preview} alt="Crop Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                         <div className="w-full max-w-xs p-6">
                            <button 
                                onClick={() => { setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                className="w-full bg-white text-black font-bold py-4 rounded-xl shadow-lg hover:bg-gray-100 mb-4"
                            >
                                {t.process_img}
                            </button>
                            <button 
                                onClick={() => { setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                className="w-full bg-black/50 backdrop-blur-md text-white font-bold py-4 rounded-xl border border-white/20"
                            >
                                {t.retake}
                            </button>
                         </div>
                    </div>
                 </div>
             </div>
        )}
    </div>
  );
};