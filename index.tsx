import React, { useState, useEffect, useRef, useMemo, createContext, useContext, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  X, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  MapPin, 
  Phone,
  Sparkles,
  Award,
  Stethoscope,
  MessageCircle,
  Menu,
  Instagram,
  Youtube,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  ArrowUpDown,
  Loader2,
  Plus,
  Minus,
  Globe,
  Sun,
  Moon,
  Mic,
  StopCircle,
  Volume2,
  FileText,
  CreditCard,
  Truck,
  ShieldAlert,
  Undo2
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import Lenis from 'lenis';

import { TRANSLATIONS } from './translations';
import { getPrices } from './prices';
import { getServicesData } from './servicesData';
import { getDoctorAccordionItems } from './doctorData';
import { getPortfolioItems } from './portfolioData';

// --- Design System Constants ---
const PREMIUM_TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

type Language = 'ru' | 'en';
type Theme = 'light' | 'dark';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS.ru;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'ru',
  setLanguage: () => {},
  t: TRANSLATIONS.ru,
});

const useLanguage = () => useContext(LanguageContext);

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

const useTheme = () => useContext(ThemeContext);

// --- Smooth Scroll Context ---
const SmoothScrollContext = createContext<any>(null);
const useSmoothScroll = () => useContext(SmoothScrollContext);


// --- SEO Hook ---

const useScrollTitle = () => {
  const { t } = useLanguage();
  
  useEffect(() => {
    const sections = [
      { id: 'hero', title: `Dr. Mironova | ${t.hero.tag}` },
      { id: 'operations', title: `${t.operations.title} | Dr. Mironova` },
      { id: 'portfolio', title: `${t.portfolio.title} | Dr. Mironova` },
      { id: 'price', title: `${t.price.title} | Dr. Mironova` },
      { id: 'about', title: `${t.doctor.tag} | Dr. Mironova` },
      { id: 'contacts', title: `${t.nav.contacts} | Dr. Mironova` }
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      let foundSection = false;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (document.title !== section.title) {
              document.title = section.title;
            }
            foundSection = true;
            break;
          }
        }
      }
      
      if (!foundSection && window.scrollY < 100) {
        document.title = `Dr. Mironova | ${t.hero.tag}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [t]);
};

// --- Booking Context ---

type BookingContextType = {
  isBookingOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextType>({
  isBookingOpen: false,
  openBooking: () => {},
  closeBooking: () => {},
});

const useBooking = () => useContext(BookingContext);

// --- Shared Components ---

const GoldButton = ({ children, onClick, className = "", variant = "filled" }: any) => {
  const baseClasses = "px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 relative overflow-hidden group";
  
  if (variant === "filled") {
    return (
      <button onClick={onClick} className={`${baseClasses} text-white ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#B7C9CC] via-[#CFB997] to-[#EED6A6] opacity-100 transition-opacity duration-500 group-hover:opacity-90"></div>
        <div className="absolute inset-0 bg-[#006E77] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply"></div>
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
  
  // Outline variant
  return (
    <button onClick={onClick} className={`${baseClasses} text-[#1A202C] dark:text-white group hover:text-[#006E77] dark:hover:text-[#80DED9] ${className}`}>
      <span className="absolute inset-0 border border-[#CFB997]/50 group-hover:border-[#006E77]/30 dark:group-hover:border-[#80DED9]/30 transition-colors duration-500"></span>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

const SectionTitle = ({ children, subtitle, align = "center", dark = false }: { children?: React.ReactNode, subtitle?: string, align?: "left" | "center" | "right", dark?: boolean }) => (
  <div className={`mb-20 px-6 ${align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right'}`}>
    <motion.h2 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`text-5xl md:text-7xl font-normal mb-8 leading-tight ${dark ? 'text-white' : 'text-[#1A202C] dark:text-white'}`}
      style={{ fontFamily: 'Bodoni Moda, serif' }}
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="flex flex-col items-center"
      >
        <div className={`h-px w-24 bg-gradient-to-r from-transparent via-[#CFB997] to-transparent mb-6 ${align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : 'mr-auto'}`}></div>
        <p className={`text-lg md:text-xl max-w-2xl font-light leading-relaxed italic ${dark ? 'text-white/60' : 'text-[#5A6A7A] dark:text-[#94A3B8]'} ${align === 'center' ? 'mx-auto' : ''}`} style={{ fontFamily: 'Playfair Display, serif' }}>
          {subtitle}
        </p>
      </motion.div>
    )}
  </div>
);

const Lightbox = ({ images, initialIndex = 0, onClose }: { images: string[], initialIndex?: number, onClose: () => void }) => {
  const [index, setIndex] = useState(initialIndex);
  
  const next = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev, onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2">
        <X className="w-8 h-8" />
      </button>

      {/* Main Image Area */}
      <div className="relative w-full h-full flex items-center justify-center max-h-[85vh]">
        <button onClick={prev} className="absolute left-2 md:left-8 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-20">
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <AnimatePresence mode='wait'>
            <motion.img 
                key={index}
                src={images[index]}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-h-full max-w-full object-contain shadow-2xl rounded-sm"
                alt={`Image ${index + 1}`}
                onClick={(e) => e.stopPropagation()}
            />
        </AnimatePresence>

        <button onClick={next} className="absolute right-2 md:right-8 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-20">
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-0 right-0 h-20 flex justify-center gap-2 overflow-x-auto px-4 py-2 z-20" onClick={(e) => e.stopPropagation()}>
         {images.map((src, i) => (
             <button 
                key={i} 
                onClick={() => setIndex(i)}
                className={`flex-shrink-0 relative h-full aspect-[4/3] overflow-hidden rounded-sm transition-all ${index === i ? 'ring-2 ring-[#CFB997] opacity-100' : 'opacity-40 hover:opacity-70'}`}
             >
                 <img src={src} className="w-full h-full object-cover" />
             </button>
         ))}
      </div>
    </motion.div>
  );
};

// --- Helper Functions for Telegram ---

const getDeviceString = () => {
  if (typeof navigator === 'undefined') return "Unknown";
  const ua = navigator.userAgent;
  let device = "Computer";
  if (/Android/i.test(ua)) device = "Android Device";
  else if (/iPhone|iPad|iPod/i.test(ua)) device = "iOS Device";
  
  return device;
};

const getUTMString = () => {
  if (typeof window === 'undefined') return "None";
  try {
    const params = new URLSearchParams(window.location.search);
    const entries = Array.from(params.entries());
    if (entries.length === 0) return "Нет меток";
    return entries.map(([k, v]) => `${k}=${v}`).join('; ');
  } catch(e) {
    return "Unknown";
  }
};

// --- Audio Helper Functions for Gemini Live ---

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// --- Voice Assistant Component ---

const VoiceAssistant = () => {
  const { t, language } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [volume, setVolume] = useState(0);
  
  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const activeSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null); // Gemini Session

  const stop = async () => {
    setIsActive(false);
    setStatus('idle');
    
    // Close session
    if (sessionRef.current) {
      sessionRef.current = null; 
    }

    // Stop audio output context
    if (audioContextRef.current) {
        try {
            activeSourceNodeRef.current?.stop();
            await audioContextRef.current.close();
        } catch(e) { console.log(e); }
        audioContextRef.current = null;
    }

    // Stop input processing
    if (inputContextRef.current) {
         try {
             await inputContextRef.current.close();
         } catch(e) { console.log(e); }
         inputContextRef.current = null;
    }

    // Stop tracks
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    
    setVolume(0);
  };

  const start = async () => {
    try {
        setIsActive(true);
        setStatus('connecting');

        // 1. Init Audio Input Stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: { 
                sampleRate: 16000, 
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true
            } 
        });
        mediaStreamRef.current = stream;

        // 2. Init Audio Output Context - 24kHz for Gemini
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx({ sampleRate: 24000 });
        audioContextRef.current = ctx;
        nextStartTimeRef.current = ctx.currentTime;

        // 3. Connect to Gemini
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const session = await ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            config: {
                systemInstruction: `You are the voice assistant for "Sculpted Elegance", the premium aesthetic medicine clinic of Dr. Elena Mironova in Moscow.
Your goal is to politely and professionally answer questions about plastic surgery services (Face, Breast, Body), Dr. Mironova's experience (15 years, PhD), and encourage users to book a consultation.
Do not provide specific medical advice or diagnoses.
If asked about prices, provide the ranges from your knowledge base (approximate).
Speak in the language the user speaks (default to Russian if unsure).
Keep responses concise and elegant.`,
            },
            callbacks: {
                onopen: () => {
                    setStatus('listening');
                    // Start streaming audio input
                    const InputCtx = window.AudioContext || (window as any).webkitAudioContext;
                    const inputCtx = new InputCtx({ sampleRate: 16000 });
                    inputContextRef.current = inputCtx;

                    const source = inputCtx.createMediaStreamSource(stream);
                    const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                    
                    processor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        
                        // Simple volume meter
                        let sum = 0;
                        for(let i=0; i<inputData.length; i+=10) sum += Math.abs(inputData[i]);
                        const avg = sum / (inputData.length/10);
                        setVolume(Math.min(100, avg * 100 * 5)); 

                        // Convert Float32 to Int16 PCM
                        const pcmData = new Int16Array(inputData.length);
                        for (let i = 0; i < inputData.length; i++) {
                            const s = Math.max(-1, Math.min(1, inputData[i]));
                            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
                        }
                        
                        // Send to Gemini
                        const base64 = uint8ArrayToBase64(new Uint8Array(pcmData.buffer));
                        session.sendRealtimeInput({ 
                            media: { 
                                mimeType: 'audio/pcm;rate=16000', 
                                data: base64 
                            } 
                        });
                    };

                    source.connect(processor);
                    processor.connect(inputCtx.destination);
                    processorRef.current = processor;
                },
                onmessage: async (msg) => {
                     // Handle Audio Output
                     const data = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                     if (data && audioContextRef.current) {
                        setStatus('speaking');
                        
                        // Convert PCM 16-bit to Float32
                        const bytes = base64ToUint8Array(data);
                        const data16 = new Int16Array(bytes.buffer);
                        const float32 = new Float32Array(data16.length);
                        for(let i=0; i<data16.length; i++) float32[i] = data16[i] / 32768.0;

                        // Create Buffer
                        const buffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
                        buffer.copyToChannel(float32, 0);

                        // Play
                        const source = audioContextRef.current.createBufferSource();
                        source.buffer = buffer;
                        source.connect(audioContextRef.current.destination);
                        
                        // Schedule for gapless playback
                        const now = audioContextRef.current.currentTime;
                        const start = Math.max(now, nextStartTimeRef.current);
                        source.start(start);
                        nextStartTimeRef.current = start + buffer.duration;
                        
                        source.onended = () => {
                             // Reset to listening if queue empty
                             if (audioContextRef.current && audioContextRef.current.currentTime >= nextStartTimeRef.current - 0.1) {
                                 setStatus('listening');
                             }
                        };
                        activeSourceNodeRef.current = source;
                     }
                },
                onclose: () => {
                    stop();
                },
                onerror: (e) => {
                    console.error("Gemini Error:", e);
                    stop();
                }
            }
        });
        sessionRef.current = session;

    } catch (e) {
        console.error("Voice Assistant Connection Error:", e);
        setStatus('idle');
        setIsActive(false);
    }
  };

  const toggle = () => {
      if (isActive) stop();
      else start();
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[140] flex flex-col items-end gap-4">
          <AnimatePresence>
            {isActive && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={PREMIUM_TRANSITION}
                    className="bg-white dark:bg-[#151E32] rounded-2xl shadow-2xl p-6 w-72 md:w-80 border border-gray-200 dark:border-white/10"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                             <span className="text-xs font-bold uppercase tracking-widest text-[#006E77] dark:text-[#80DED9]">{t.assistant.start}</span>
                        </div>
                        <button onClick={stop} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center py-4">
                        {/* Visualizer */}
                        <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                             <motion.div 
                                animate={{ scale: 1 + (volume / 100) * 0.5 }}
                                className="absolute inset-0 bg-[#CFB997]/20 rounded-full"
                             />
                             <motion.div 
                                animate={{ scale: 1 + (volume / 100) * 0.3 }}
                                className="absolute inset-2 bg-[#CFB997]/40 rounded-full"
                             />
                             <div className="absolute inset-4 bg-gradient-to-br from-[#CFB997] to-[#B7C9CC] rounded-full flex items-center justify-center shadow-inner">
                                <Mic className="w-8 h-8 text-white" />
                             </div>
                        </div>
                        
                        <p className="text-sm font-medium text-[#1A202C] dark:text-white mb-1">
                            {status === 'connecting' ? t.assistant.connecting : 
                             status === 'speaking' ? t.assistant.speaking :
                             t.assistant.listening}
                        </p>
                        <p className="text-xs text-[#718096] dark:text-[#94A3B8] text-center">
                            {t.assistant.active_desc}
                        </p>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          <button 
             onClick={toggle}
             className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${isActive ? 'bg-red-500 text-white' : 'bg-[#006E77] text-white hover:bg-[#CFB997]'}`}
          >
              {isActive ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
      </div>
    </>
  );
};

// --- Custom Cursor Component ---

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null); // For the main dot
  const [isHovering, setIsHovering] = useState(false);
  
  // Spring animation for the trailing circle
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth spring configuration
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Update dot position directly for high performance (no React render loop)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }
      // Update spring target for the trailing circle
      cursorX.set(e.clientX - 16); // Center 32px circle
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if target is interactive
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' ||
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        (target.classList && target.classList.contains('cursor-pointer')) ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(!!isClickable);
    };

    // Hide default cursor
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @media (min-width: 768px) {
        body, a, button, input, select, textarea {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(styleElement);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.head.removeChild(styleElement);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"> 
      {/* Main Dot - Instant tracking */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#CFB997] rounded-full shadow-[0_0_8px_rgba(207,185,151,0.6)] z-50"
        style={{ willChange: 'transform' }}
      />
      
      {/* Trailing Circle - Spring animation */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[#006E77] dark:border-[#80DED9] rounded-full z-40"
        style={{ 
          x: cursorXSpring, 
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.6 : 0.3,
          backgroundColor: isHovering ? 'rgba(0, 110, 119, 0.1)' : 'transparent',
          borderWidth: isHovering ? '1px' : '1px'
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />
    </div>
  );
};

// --- Booking Panel Component ---

const BookingPanel = () => {
  const { isBookingOpen, closeBooking } = useBooking();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    operation: '',
    name: '',
    email: '',
    phone: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const message = `
<b>✨ Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${formData.name}
📧 <b>Email:</b> ${formData.email}
📱 <b>Телефон:</b> ${formData.phone}
🏥 <b>Операция:</b> ${formData.operation}

💻 <b>Устройство:</b> ${getDeviceString()}
🔗 <b>UTM:</b> ${getUTMString()}
    `;

    try {
      const token = "7875251064:AAEGeusE6fgwkjCrbZFRF4sUEQHeqdpvuEU";
      const chatId = "@MironovaWebLead"; 
      
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      const data = await response.json();

      if (data.ok) {
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          setFormData({ operation: '', name: '', email: '', phone: '' });
          closeBooking();
        }, 3000);
      } else {
        console.error("Telegram Error:", data);
        setStatus('error');
      }
    } catch (error) {
      console.error("Network Error:", error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBooking}
            className="fixed inset-0 bg-[#1A202C]/60 backdrop-blur-sm z-[150]"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ...PREMIUM_TRANSITION }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white dark:bg-[#151E32] z-[160] shadow-2xl flex flex-col"
          >
            <div className="p-6 md:p-8 flex justify-end">
              <button onClick={closeBooking} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-[#1A202C] dark:text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-12">
              <div className="mb-10 text-center">
                 <div className="w-16 h-16 rounded-full border border-[#006E77] dark:border-[#80DED9] flex items-center justify-center mx-auto mb-6">
                   <Sparkles className="w-6 h-6 text-[#006E77] dark:text-[#80DED9]" />
                 </div>
                 <h2 className="text-3xl font-serif text-[#006E77] dark:text-[#80DED9] mb-2">{t.booking.title}</h2>
                 <p className="text-[#718096] dark:text-[#CBD5E1] text-sm">{t.booking.subtitle}</p>
              </div>

              {status === 'success' ? (
                <div className="text-center py-20">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-[#CFB997] rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-serif text-[#1A202C] dark:text-white mb-2">{t.booking.successTitle}</h3>
                  <p className="text-[#5A6A7A] dark:text-[#94A3B8]">{t.booking.successDesc}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#718096] dark:text-[#94A3B8] mb-2">{t.booking.labels.operation}</label>
                    <div className="relative">
                      <select 
                        required
                        name="operation"
                        value={formData.operation}
                        onChange={handleChange}
                        className="w-full bg-[#F8F9F9] dark:bg-[#0B1121] border border-gray-200 dark:border-white/10 p-4 text-[#1A202C] dark:text-white appearance-none focus:outline-none focus:border-[#006E77] dark:focus:border-[#80DED9] transition-colors"
                      >
                        <option value="" disabled>{t.booking.labels.select}</option>
                        <option value={t.booking.ops.face}>{t.booking.ops.face}</option>
                        <option value={t.booking.ops.breast}>{t.booking.ops.breast}</option>
                        <option value={t.booking.ops.body}>{t.booking.ops.body}</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#718096] dark:text-[#94A3B8] mb-2">{t.booking.labels.name}</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.booking.labels.name}
                      className="w-full bg-[#F8F9F9] dark:bg-[#0B1121] border border-gray-200 dark:border-white/10 p-4 text-[#1A202C] dark:text-white focus:outline-none focus:border-[#006E77] dark:focus:border-[#80DED9] transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#718096] dark:text-[#94A3B8] mb-2">{t.booking.labels.email}</label>
                    <input 
                      required
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="w-full bg-[#F8F9F9] dark:bg-[#0B1121] border border-gray-200 dark:border-white/10 p-4 text-[#1A202C] dark:text-white focus:outline-none focus:border-[#006E77] dark:focus:border-[#80DED9] transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#718096] dark:text-[#94A3B8] mb-2">{t.booking.labels.phone}</label>
                    <input 
                      required
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+7 (999) 000-00-00"
                      className="w-full bg-[#F8F9F9] dark:bg-[#0B1121] border border-gray-200 dark:border-white/10 p-4 text-[#1A202C] dark:text-white focus:outline-none focus:border-[#006E77] dark:focus:border-[#80DED9] transition-colors placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-[#80DED9] hover:bg-[#68C5C0] text-[#004D53] font-medium py-4 px-6 transition-all flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t.booking.labels.sending}
                        </>
                      ) : (
                        t.booking.labels.send
                      )}
                    </button>
                    {status === 'error' && (
                      <p className="text-red-500 text-xs text-center mt-3">{t.booking.error}</p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Doctor Info Modal ---

const DoctorInfoModal = ({ onClose }: { onClose: () => void }) => {
  const { openBooking } = useBooking();
  const { t } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>("practice");

  const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const accordionItems = useMemo(() => getDoctorAccordionItems(t), [t]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 overflow-y-auto"
    >
      <div className="absolute inset-0 bg-[#1A202C]/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={PREMIUM_TRANSITION}
        className="bg-white dark:bg-[#151E32] w-full max-w-6xl md:max-h-[90vh] md:overflow-hidden relative shadow-2xl flex flex-col md:flex-row overflow-y-auto h-full md:h-auto"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 flex items-center justify-center transition-colors shadow-sm"
        >
          <X className="w-5 h-5 text-[#1A202C] dark:text-white" />
        </button>

        {/* Left Column: Image */}
        <div className="w-full md:w-5/12 h-[400px] md:h-auto relative flex-shrink-0">
          <img 
            src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/emir-mob-9.jpg" 
            alt="Миронова Елена" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A202C]/50 to-transparent md:hidden"></div>
        </div>

        {/* Right Column: Content */}
        <div className="w-full md:w-7/12 overflow-y-auto">
          <div className="p-8 md:p-12">
            
            {/* Header */}
            <div className="mb-10">
               <span className="text-[#006E77] dark:text-[#80DED9] text-xs uppercase tracking-[0.2em] mb-3 block">{t.doctor.tag}</span>
               <h2 className="text-4xl md:text-5xl mb-4 text-[#1A202C] dark:text-white" style={{ fontFamily: 'Bodoni Moda, serif' }}>
                 {t.doctor.name}
               </h2>
               <p className="text-[#5A6A7A] dark:text-[#94A3B8] text-lg font-light">
                 {t.doctor.title}
               </p>
            </div>

            {/* Accordion */}
            <div className="mb-12 border-t border-gray-200 dark:border-white/10">
              {accordionItems.map((item) => (
                <div key={item.id} className="border-b border-gray-200 dark:border-white/10">
                  <button 
                    onClick={() => toggle(item.id)}
                    className={`w-full py-5 flex items-center justify-between text-left transition-colors ${openSection === item.id ? 'bg-[#006E77]/5 dark:bg-white/5 px-4' : 'hover:bg-gray-50 dark:hover:bg-white/5 px-2'}`}
                  >
                    <span className="text-lg font-medium text-[#1A202C] dark:text-white">{item.title}</span>
                    {openSection === item.id ? <Minus className="w-4 h-4 text-[#006E77] dark:text-[#80DED9]" /> : <Plus className="w-4 h-4 text-[#CFB997]" />}
                  </button>
                  <AnimatePresence>
                    {openSection === item.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-6 pt-2 text-sm leading-relaxed">
                          {item.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mb-12">
               <button 
                  onClick={openBooking}
                  className="w-full py-5 bg-[#80DED9] hover:bg-[#68C5C0] text-[#004D53] font-medium uppercase tracking-widest text-xs transition-colors shadow-sm"
               >
                 {t.doctor.cta}
               </button>
            </div>

            {/* Quote/Stats */}
            <div className="mb-16 border-l-4 border-[#CFB997] pl-6">
              <h3 className="text-2xl md:text-3xl font-serif text-[#1A202C] dark:text-white leading-snug">
                {t.doctor.quote}
              </h3>
            </div>

            {/* Publications Grid */}
            <div className="mb-16">
               <h3 className="text-xl font-serif mb-8 text-[#1A202C] dark:text-white">{t.doctor.sections.publications}</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 flex items-end mb-4">
                      <img src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/wmc.webp" alt="WIMC" className="max-h-full max-w-full" loading="lazy" />
                    </div>
                    <p className="text-xs text-[#5A6A7A] dark:text-[#94A3B8] leading-tight">4-ый международный конкурс учёных WIMC (Варшава 2018 г.)</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 flex items-end mb-4">
                      <img src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/euro.webp" alt="EACMF" className="max-h-full max-w-full" loading="lazy" />
                    </div>
                    <p className="text-xs text-[#5A6A7A] dark:text-[#94A3B8] leading-tight">Международный конгресс EACMF</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 flex items-end mb-4">
                      <img src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/est.webp" alt="Esthetic" className="max-h-full max-w-full" loading="lazy" />
                    </div>
                    <p className="text-xs text-[#5A6A7A] dark:text-[#94A3B8] leading-tight">Advance-Esthetic (Санкт-Петербург, 2018-2020 гг,)</p>
                  </div>
               </div>
            </div>

            {/* Media Logos */}
            <div className="flex flex-wrap items-center justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <img src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/moscow.svg" alt="Evening Moscow" className="h-6 md:h-8 w-auto invert dark:invert-0" loading="lazy" />
               <img src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/tatler.svg" alt="Tatler" className="h-6 md:h-8 w-auto invert dark:invert-0" loading="lazy" />
               <img src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/news.svg" alt="Izvestia" className="h-6 md:h-8 w-auto invert dark:invert-0" loading="lazy" />
               <img src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/people.svg" alt="People Talk" className="h-6 md:h-8 w-auto invert dark:invert-0" loading="lazy" />
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Modal Component ---

const ServiceModal = ({ data, onClose }: { data: any, onClose: () => void }) => {
  const { openBooking } = useBooking();
  const { t } = useLanguage();
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-[#1A202C]/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={PREMIUM_TRANSITION}
        className="bg-white dark:bg-[#151E32] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-[#1A202C] dark:text-white" />
        </button>

        <div className="p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl mb-6 text-[#1A202C] dark:text-white" style={{ fontFamily: 'Bodoni Moda, serif' }}>
            {data.title}
          </h2>
          
          <div className="h-px w-24 bg-[#CFB997] mb-8"></div>
          
          <p className="text-[#5A6A7A] dark:text-[#94A3B8] text-lg font-light leading-relaxed mb-10 italic font-playfair">
            {data.intro}
          </p>

          <div className="mb-12">
            <h3 className="text-2xl mb-6 font-serif">{t.operations.modal.services}</h3>
            <div className="space-y-6">
              {data.services.map((service: any, idx: number) => (
                <div key={idx}>
                  <h4 className="font-semibold text-[#1A202C] dark:text-white mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#006E77] dark:bg-[#80DED9] rounded-full"></span>
                    {service.title}
                  </h4>
                  <p className="text-[#5A6A7A] dark:text-[#94A3B8] text-sm leading-relaxed pl-3.5 border-l border-[#CFB997]/30">
                    {service.desc}
                    {service.subItems && (
                      <ul className="mt-2 space-y-1">
                        {service.subItems.map((sub: string, i: number) => (
                           <li key={i} className="flex items-center gap-2 text-xs">
                             <span className="w-1 h-1 bg-gray-300 dark:bg-white/30 rounded-full"></span>
                             {sub}
                           </li>
                        ))}
                      </ul>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12 bg-[#F8F9F9] dark:bg-[#0B1121] p-8 -mx-8 md:-mx-12 md:px-12">
            <h3 className="text-2xl mb-8 font-serif">{t.operations.modal.prices}</h3>
            <div className="space-y-4">
              {data.prices.map((price: any, idx: number) => (
                <div key={idx} className="flex items-end justify-between group">
                  <div className="relative z-10 bg-[#F8F9F9] dark:bg-[#0B1121] pr-4 max-w-[70%]">
                    <span className="text-base md:text-lg text-[#1A202C] dark:text-white font-light">
                      {price.name}
                    </span>
                  </div>
                  <div className="flex-grow border-b border-dotted border-[#CFB997] mb-1.5 opacity-50"></div>
                  <div className="relative z-10 bg-[#F8F9F9] dark:bg-[#0B1121] pl-4 text-right min-w-fit">
                    <span className="text-lg font-medium text-[#006E77] dark:text-[#80DED9] whitespace-nowrap" style={{ fontFamily: 'Bodoni Moda, serif' }}>
                      {price.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl mb-6 font-serif">{t.operations.modal.why}</h3>
            <ul className="space-y-4">
              {data.benefits.map((benefit: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-[#CFB997] flex-shrink-0 mt-0.5" />
                   <span className="text-[#5A6A7A] dark:text-[#94A3B8] font-light">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center bg-[#F2F0EB] dark:bg-[#0F172A] p-8 rounded-sm">
            <p className="text-lg italic font-playfair mb-6 text-[#1A202C] dark:text-white">
              {t.operations.modal.cta}
            </p>
            <GoldButton onClick={openBooking}>
              {t.operations.modal.btn}
            </GoldButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Price List & Full Price Modal ---

const FullPriceModal = ({ onClose }: { onClose: () => void }) => {
  const { language } = useLanguage();
  const prices = useMemo(() => getPrices(language), [language]);
  const { t } = useLanguage();
  
  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
       <div className="absolute inset-0 bg-[#1A202C]/60 backdrop-blur-sm" onClick={onClose}></div>
       <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={PREMIUM_TRANSITION}
          className="bg-white dark:bg-[#151E32] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl rounded-sm p-8 md:p-12"
       >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-[#1A202C] dark:text-white" />
          </button>
          <h2 className="text-3xl md:text-4xl font-serif text-[#1A202C] dark:text-white mb-8">{t.price.buttons.full}</h2>
          <div className="space-y-12">
            {prices.map((cat, idx) => (
              <div key={idx}>
                <h3 className="text-xl text-[#006E77] dark:text-[#80DED9] mb-6 font-serif italic border-b border-[#006E77]/10 dark:border-white/10 pb-2 inline-block">
                  {cat.category}
                </h3>
                <div className="space-y-4">
                  {cat.items.map((item, i) => (
                    <div key={i} className="flex items-end justify-between">
                       <div className="relative z-10 bg-white dark:bg-[#151E32] pr-4">
                          <span className="text-base text-[#1A202C] dark:text-white font-light">{item.name} {item.note && <span className="text-xs text-gray-400"> {item.note}</span>}</span>
                       </div>
                       <div className="flex-grow border-b border-dotted border-[#CFB997] mb-1.5 opacity-50"></div>
                       <div className="relative z-10 bg-white dark:bg-[#151E32] pl-4 text-right">
                          <span className="text-base font-medium text-[#1A202C] dark:text-white font-serif">{item.price}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
       </motion.div>
    </motion.div>
  );
};

const PriceList = () => {
  const { t, language } = useLanguage();
  const { openBooking } = useBooking();
  const prices = useMemo(() => getPrices(language), [language]);
  const [showFullPrice, setShowFullPrice] = useState(false);

  return (
    <section id="price" className="py-32 bg-[#F8F9F9] dark:bg-[#0B1121]">
      <div className="max-w-[1000px] mx-auto px-6">
        <SectionTitle subtitle={t.price.subtitle}>{t.price.title}</SectionTitle>

        <div className="space-y-16">
          {prices.slice(0, 3).map((cat, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="relative"
            >
              <h3 className="text-2xl text-[#006E77] dark:text-[#80DED9] mb-8 font-serif italic border-b border-[#006E77]/10 dark:border-white/10 pb-4 inline-block pr-12">
                {cat.category}
              </h3>
              <div className="space-y-6">
                {cat.items.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-end justify-between group cursor-default">
                    <div className="relative z-10 bg-[#F8F9F9] dark:bg-[#0B1121] pr-4">
                      <span className="text-lg md:text-xl text-[#1A202C] dark:text-white group-hover:text-[#006E77] dark:group-hover:text-[#80DED9] transition-colors font-light">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex-grow border-b border-dotted border-[#CFB997] mb-1.5 opacity-50 relative -ml-2"></div>
                    <div className="relative z-10 bg-[#F8F9F9] dark:bg-[#0B1121] pl-4 text-right">
                      <span className="text-lg md:text-xl font-medium text-[#1A202C] dark:text-white" style={{ fontFamily: 'Bodoni Moda, serif' }}>
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-[#718096] dark:text-[#94A3B8] text-sm mb-6 max-w-xl mx-auto italic">
            {t.price.disclaimer}
          </p>
          <div className="flex justify-center gap-6">
            <button 
              onClick={() => setShowFullPrice(true)}
              className="border-b border-[#006E77] dark:border-[#80DED9] text-[#006E77] dark:text-[#80DED9] hover:text-[#CFB997] hover:border-[#CFB997] transition-all pb-1 text-xs uppercase tracking-[0.2em]"
            >
              {t.price.buttons.full}
            </button>
            <button 
              onClick={openBooking}
              className="border-b border-[#006E77] dark:border-[#80DED9] text-[#006E77] dark:text-[#80DED9] hover:text-[#CFB997] hover:border-[#CFB997] transition-all pb-1 text-xs uppercase tracking-[0.2em]"
            >
              {t.price.buttons.calc}
            </button>
          </div>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {showFullPrice && <FullPriceModal onClose={() => setShowFullPrice(false)} />}
      </AnimatePresence>
    </section>
  );
};

// --- Operations Component ---

const Operations = () => {
    const { t } = useLanguage();
    const [modalData, setModalData] = useState<any | null>(null);

    const operationsData = useMemo(() => getServicesData(t), [t]);

    return (
        <section id="operations" className="py-32 bg-white dark:bg-[#151E32]">
            <div className="container mx-auto px-6">
                <SectionTitle subtitle={t.operations.subtitle}>{t.operations.title}</SectionTitle>
                <div className="grid md:grid-cols-3 gap-8">
                    {operationsData.map((op, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="group cursor-pointer"
                            onClick={() => setModalData(op)}
                        >
                            <div className="relative overflow-hidden aspect-[3/4] mb-6">
                                <img src={op.image} alt={op.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h3 className="text-2xl font-serif text-white mb-2">{op.title}</h3>
                                    <div className="flex items-center gap-2 text-white/80 text-sm uppercase tracking-widest">
                                        <span>{t.operations.details}</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <AnimatePresence>
                {modalData && <ServiceModal data={modalData} onClose={() => setModalData(null)} />}
            </AnimatePresence>
        </section>
    );
};

// --- Portfolio Component ---

const Portfolio = () => {
    const { t } = useLanguage();
    const [filter, setFilter] = useState<'all' | 'face' | 'breast' | 'body'>('all');
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const portfolioItems = useMemo(() => getPortfolioItems(), []);

    const filteredItems = useMemo(() => {
        if (filter === 'all') return portfolioItems;
        return portfolioItems.filter(item => item.category === filter);
    }, [filter, portfolioItems]);
    
    // Map of active images for lightbox
    const lightboxImages = useMemo(() => filteredItems.map(i => i.src), [filteredItems]);

    return (
        <section id="portfolio" className="py-32 bg-[#F8F9F9] dark:bg-[#0B1121]">
            <div className="container mx-auto px-6">
                <SectionTitle subtitle={t.portfolio.subtitle}>{t.portfolio.title}</SectionTitle>
                
                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                   {[
                     { id: 'all', label: t.portfolio.filters.all },
                     { id: 'face', label: t.portfolio.filters.face },
                     { id: 'breast', label: t.portfolio.filters.breast },
                     { id: 'body', label: t.portfolio.filters.body },
                   ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id as any)}
                        className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 border
                          ${filter === tab.id 
                            ? 'bg-[#006E77] text-white border-[#006E77] shadow-md' 
                            : 'bg-transparent text-[#5A6A7A] dark:text-[#94A3B8] border-gray-200 dark:border-white/10 hover:border-[#006E77] hover:text-[#006E77]'
                          }`}
                      >
                        {tab.label}
                      </button>
                   ))}
                </div>

                <motion.div 
                    layout
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map((item, i) => (
                            <motion.div 
                                layout
                                key={item.src}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="aspect-square relative overflow-hidden group cursor-pointer rounded-sm shadow-sm"
                                onClick={() =>