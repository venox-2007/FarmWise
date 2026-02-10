
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { Language, User } from '../types';
import { TRANSLATIONS } from '../constants';

interface LiveVoiceAssistantProps {
  user: User;
  lang: Language;
  onClose: () => void;
}

export const LiveVoiceAssistant: React.FC<LiveVoiceAssistantProps> = ({ user, lang, onClose }) => {
  const t = TRANSLATIONS[lang];
  const [status, setStatus] = useState<'connecting' | 'ready' | 'listening' | 'speaking' | 'error'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [zoom, setZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);
  
  const sessionRef = useRef<any>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const initialPinchDistanceRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(1);

  // Function to implement PCM encoding
  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Function to implement PCM decoding
  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  // Handle Pinch to Zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      initialPinchDistanceRef.current = dist;
      initialZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistanceRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const factor = dist / initialPinchDistanceRef.current;
      const newZoom = Math.min(maxZoom, Math.max(1, initialZoomRef.current * factor));
      
      applyZoom(newZoom);
    }
  };

  const applyZoom = (value: number) => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      try {
        const capabilities = track.getCapabilities() as any;
        if (capabilities.zoom) {
          track.applyConstraints({ advanced: [{ zoom: value } as any] });
          setZoom(value);
        }
      } catch (e) {
        console.warn("Zoom not supported on this device/browser.");
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  useEffect(() => {
    let scriptProcessor: ScriptProcessorNode | null = null;
    let frameInterval: number | null = null;

    const startSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        // Request specific camera
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: { 
            facingMode: facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });

        streamRef.current = stream;

        // Check zoom capabilities
        const track = stream.getVideoTracks()[0];
        if (track) {
          const capabilities = track.getCapabilities() as any;
          if (capabilities.zoom) {
            setMaxZoom(capabilities.zoom.max || 1);
            setZoom(capabilities.zoom.min || 1);
          }
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const langMap: Record<string, string> = {
          en: 'English (strictly with a natural Indian Accent)', 
          hi: 'Hindi (हिन्दी)', 
          mr: 'Marathi (मराठी)', 
          pa: 'Punjabi (ਪੰਜਾਬੀ)', 
          bn: 'Bengali (বাংলা)',
          gu: 'Gujarati (ગુજરાતી)', 
          ta: 'Tamil (தமிழ்)', 
          te: 'Telugu (తెలుగు)', 
          kn: 'Kannada (ಕನ್ನಡ)', 
          ml: 'Malayalam (മലയാളം)', 
          or: 'Odia (ଓଡ଼ିଆ)'
        };

        const targetLang = langMap[lang] || lang;

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          callbacks: {
            onopen: () => {
              setStatus('ready');
              
              const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
              scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContextRef.current!.destination);

              frameInterval = window.setInterval(() => {
                if (videoRef.current && canvasRef.current) {
                  const video = videoRef.current;
                  const canvas = canvasRef.current;
                  const ctx = canvas.getContext('2d');
                  if (ctx && video.videoWidth > 0) {
                    canvas.width = 320; 
                    canvas.height = (video.videoHeight / video.videoWidth) * 320;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    const base64Data = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
                    sessionPromise.then((session) => {
                      session.sendRealtimeInput({
                        media: { data: base64Data, mimeType: 'image/jpeg' }
                      });
                    });
                  }
                }
              }, 1000); 
            },
            onmessage: async (message: LiveServerMessage) => {
              if (message.serverContent?.modelTurn) {
                setStatus('speaking');
              }
              
              const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
              if (base64EncodedAudioString && outputAudioContextRef.current) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                const audioBuffer = await decodeAudioData(
                  decode(base64EncodedAudioString),
                  outputAudioContextRef.current,
                  24000,
                  1,
                );
                const source = outputAudioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                const outputNode = outputAudioContextRef.current.createGain();
                source.connect(outputNode);
                outputNode.connect(outputAudioContextRef.current.destination);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) setStatus('ready');
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              const interrupted = message.serverContent?.interrupted;
              if (interrupted) {
                for (const source of sourcesRef.current.values()) {
                  try { source.stop(); } catch(e) {}
                  sourcesRef.current.delete(source);
                }
                nextStartTimeRef.current = 0;
                setStatus('ready');
              }

              if (message.serverContent?.turnComplete) {
                if (sourcesRef.current.size === 0) setStatus('ready');
              }
            },
            onerror: (e: any) => {
              console.error('Live API Error:', e);
              setStatus('error');
              setErrorMessage('Connection failed. Please check your network.');
            },
            onclose: (e: any) => {
              console.log('Live API Closed:', e);
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
            },
            systemInstruction: `You are FarmWise Live, the personal AI Agricultural Scientist for ${user.name} in ${user.location}.
            
            YOU HAVE EYES:
            - You are receiving a real-time video stream from the farmer's camera.
            - Use this visual information to identify pests, diseases, nutrient deficiencies, or soil conditions.
            
            CORE CONSTRAINTS:
            - Speak EXCLUSIVELY in ${targetLang}. 
            - DO NOT USE ENGLISH unless the preferred language is English.
            - If language is English, use a professional and natural Indian Accent.
            
            PERSONA:
            - Helpful, respectful, and authoritative male expert.
            - Provide advice grounded in both the farmer's questions AND the live video feed.
            - Keep responses conversational and practical for field work.`,
          },
        });

        sessionRef.current = await sessionPromise;
      } catch (err: any) {
        console.error('Failed to start Live session:', err);
        setStatus('error');
        setErrorMessage(err.message || 'Microphone/Camera access denied or connection issue.');
      }
    };

    startSession();

    return () => {
      if (sessionRef.current) {
        sessionRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (scriptProcessor) {
        scriptProcessor.disconnect();
      }
      if (frameInterval) {
        clearInterval(frameInterval);
      }
      if (inputAudioContextRef.current) {
        inputAudioContextRef.current.close();
      }
      if (outputAudioContextRef.current) {
        outputAudioContextRef.current.close();
      }
    };
  }, [user.location, user.name, lang, facingMode]);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white animate-fade-in overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      
      {/* Live Video Feed Background */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      
      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay: HUD / Persona */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />

      {/* Top Bar Status */}
      <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center z-20">
         <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'ready' || status === 'listening' || status === 'speaking' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{status}</span>
         </div>
         
         <div className="flex gap-2">
            <button 
              onClick={toggleCamera}
              className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center active:scale-95 transition-all"
              title="Switch Camera"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
            <div className="bg-farm-600 px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg">LIVE AI</div>
         </div>
      </div>

      {/* Zoom Indicator */}
      {maxZoom > 1 && (
        <div className="absolute top-24 right-6 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <span className="text-[10px] font-bold text-white/80">{zoom.toFixed(1)}x</span>
        </div>
      )}

      {/* Center Visualization */}
      <div className="relative z-10 flex flex-col items-center pointer-events-none">
        <div className={`mb-8 w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-sm relative transition-all duration-500 ${status === 'speaking' ? 'scale-110 border-farm-400' : ''}`}>
             <span className="text-4xl">👨‍🌾</span>
             {status === 'speaking' && (
                <div className="absolute inset-0 border-2 border-farm-400 rounded-full animate-ping opacity-40"></div>
             )}
        </div>
        
        <div className="text-center px-10">
           <h2 className="text-xl font-bold drop-shadow-lg">
             {status === 'connecting' ? t.live_connecting : t.live_ai}
           </h2>
           <p className={`text-xs mt-2 font-medium drop-shadow-md ${status === 'error' ? 'text-red-400' : 'text-gray-200'}`}>
             {status === 'error' ? errorMessage : 
              status === 'ready' ? t.live_ready : 
              status === 'listening' ? t.live_listening : 
              status === 'speaking' ? t.live_speaking : t.live_hint}
           </p>
        </div>

        {/* Waveform Visualization Overlay */}
        {(status === 'speaking' || status === 'listening') && (
          <div className="h-12 flex items-center gap-1 mt-6">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1 bg-farm-400 rounded-full transition-all duration-150 ${status === 'speaking' ? 'animate-bounce' : 'animate-pulse'}`}
                style={{ 
                  height: status === 'speaking' ? `${Math.random() * 80 + 20}%` : '20%',
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="absolute bottom-12 flex items-center gap-8 z-20">
          <button 
            onClick={onClose}
            className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all border-4 border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
      </div>

      {/* Target Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
          <div className="w-64 h-64 border border-white/20 rounded-3xl relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-farm-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-farm-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-farm-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-farm-400" />
          </div>
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] text-center mt-4">Pinch to Zoom</div>
      </div>
    </div>
  );
};
