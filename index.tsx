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
  Undo2,
  ImageOff,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, Variants } from 'framer-motion';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import Lenis from 'lenis';

import { TRANSLATIONS } from './translations';
import { getPrices } from './prices';
import { getServicesData } from './servicesData';
import { getDoctorAccordionItems } from './doctorData';
import { getPortfolioItems, PortfolioItem } from './portfolioData';
import { LegalContent } from './LegalContent';
import { CONFIG } from './config';

// --- Design System Constants ---

// Premium easing curves
const EASE_PREMIUM = [0.6, 0.01, -0.05, 0.95] as [number, number, number, number];

const ANIMATIONS = {
  OVERLAY: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" as const } }
  },
  MODAL: {
    initial: { opacity: 0, scale: 0.95, y: 15, filter: "blur(8px)" },
    animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE_PREMIUM } },
    exit: { opacity: 0, scale: 0.95, y: 15, filter: "blur(8px)", transition: { duration: 0.3, ease: "easeIn" as const } }
  },
  SIDEBAR: {
    initial: { x: "100%" },
    animate: { x: 0, transition: { duration: 0.5, ease: EASE_PREMIUM } },
    exit: { x: "100%", transition: { duration: 0.4, ease: EASE_PREMIUM } }
  },
  POPUP: {
     initial: { opacity: 0, scale: 0.9, y: 20, filter: "blur(4px)" },
     animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
     exit: { opacity: 0, scale: 0.9, y: 20, filter: "blur(4px)" },
     transition: { duration: 0.5, ease: EASE_PREMIUM }
  }
};

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
SectionTitle);

// --- Before/After Component ---

const BeforeAfter = ({ before, after }: { before: string, after: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    let clientX;
    
    if ('touches' in event) {
        clientX = event.touches[0].clientX;
    } else {
        clientX = (event as React.MouseEvent).clientX;
    }
    
    let position = ((clientX - containerRect.left) / containerRect.width) * 100;
    position = Math.min(100, Math.max(0, position));
    
    setSliderPosition(position);
  };

  return (
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden select-none cursor-ew-resize group rounded-sm shadow-xl bg-gray-200 dark:bg-gray-800"
        style={{ touchAction: 'none' }}
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        onClick={handleMove}
      >
         <img src={after} className="absolute inset-0 w-full h-full object-cover" alt="After" loading="lazy" decoding="async" />
         <div 
            className="absolute inset-0 w-full h-full overflow-hidden" 
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
         >
            <img src={before} className="absolute inset-0 w-full h-full object-cover" alt="Before" loading="lazy" decoding="async" />
         </div>
         <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize shadow-lg z-10"
            style={{ left: `${sliderPosition}%` }}
         >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <ArrowUpDown className="w-4 h-4 text-[#1A202C] rotate-90" />
            </div>
         </div>
         <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 text-xs rounded-full uppercase tracking-widest pointer-events-none">{t.portfolio.labels.before}</div>
         <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 text-xs rounded-full uppercase tracking-widest pointer-events-none">{t.portfolio.labels.after}</div>
      </div>
  );
};

// --- Updated Lightbox for Before/After ---

const Lightbox = ({ items, initialIndex = 0, onClose }: { items: PortfolioItem[], initialIndex?: number, onClose: () => void }) => {
  const [index, setIndex] = useState(initialIndex);
  const { t, language } = useLanguage();
  
  const next = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

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

  const currentItem = items[index];
  const hasComparison = currentItem.beforeSrc && currentItem.afterSrc;

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

      {/* Main Content Area */}
      <div className="relative w-full h-full flex items-center justify-center max-h-[85vh] max-w-6xl">
        <button onClick={prev} className="absolute left-2 md:-left-12 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-20">
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <div className="w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode='wait'>
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                    className="w-full h-full flex flex-col items-center justify-center"
                >
                    {hasComparison ? (
                         // If we have both images, show slider
                         <div className="w-full h-full max-h-[70vh] aspect-[4/3] md:aspect-[16/9] shadow-2xl">
                             <BeforeAfter before={currentItem.beforeSrc!} after={currentItem.afterSrc!} />
                             <div className="mt-4 text-center">
                                 <p className="text-white/60 text-sm uppercase tracking-widest">{t.portfolio.subtitle}</p>
                             </div>
                         </div>
                    ) : (
                         // Fallback for orphans
                         <div className="relative flex flex-col items-center justify-center text-center">
                             <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/10 mb-6 max-w-md">
                                 <ImageOff className="w-12 h-12 text-white/50 mx-auto mb-4" />
                                 <h3 className="text-white text-xl font-serif mb-2">
                                    {language === 'ru' ? 'Сравнение недоступно' : 'Comparison Not Available'}
                                 </h3>
                                 <p className="text-white/60 text-sm">
                                    {language === 'ru' 
                                      ? 'Для данного результата пока загружено только одно изображение. Второе фото находится в обработке.' 
                                      : 'Only one image is available for this result. The second photo is being processed.'}
                                 </p>
                             </div>
                             <img 
                                src={currentItem.beforeSrc || currentItem.afterSrc} 
                                className="max-h-[50vh] object-contain rounded-lg opacity-80"
                                alt="Single result"
                             />
                         </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>

        <button onClick={next} className="absolute right-2 md:-right-12 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-20">
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-0 right-0 h-20 flex justify-center gap-2 overflow-x-auto px-4 py-2 z-20" onClick={(e) => e.stopPropagation()}>
         {items.map((item, i) => (
             <button 
                key={i} 
                onClick={() => setIndex(i)}
                className={`flex-shrink-0 relative h-full aspect-[4/3] overflow-hidden rounded-sm transition-all ${index === i ? 'ring-2 ring-[#CFB997] opacity-100' : 'opacity-40 hover:opacity-70'}`}
             >
                 {/* Show 'After' image in thumbnails if available, else 'Before' */}
                 <img 
                    src={item.afterSrc || item.beforeSrc} 
                    className="w-full h-full object-cover" 
                    loading="lazy" 
                    alt={`Thumbnail ${i}`}
                 />
                 {!item.afterSrc && (
                     <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                         <ImageOff className="w-4 h-4 text-white" />
                     </div>
                 )}
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

type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

const VoiceAssistant = () => {
  const { t, language } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [volume, setVolume] = useState(0);
  const [showHints, setShowHints] = useState(true);
  
  // Chat History & Realtime Transcripts
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [realtimeInput, setRealtimeInput] = useState('');
  const [realtimeOutput, setRealtimeOutput] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Refs for audio handling & transcript accumulation
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const activeSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  
  // Refs for accumulating text fragments before commit
  const inputTranscriptRef = useRef('');
  const outputTranscriptRef = useRef('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isActive) {
        scrollToBottom();
    }
  }, [messages, realtimeInput, realtimeOutput, isActive]);

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
    setRealtimeInput('');
    setRealtimeOutput('');
    inputTranscriptRef.current = '';
    outputTranscriptRef.current = '';
  };

  const start = async () => {
    try {
        setMessages([]); // Clear previous chat on new session
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
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                outputAudioTranscription: {},
                systemInstruction: `You are 'Elegance', the sophisticated AI concierge for Dr. Elena Mironova's premium aesthetic surgery clinic in Moscow. Your persona is professional, deeply empathetic, and reflects the highest standards of luxury medical service.

Key traits:
- Professionalism: Use refined, respectful language. You represent a PhD surgeon with over 15 years of experience.
- Empathy: Acknowledge that aesthetic changes are significant personal decisions. Use a reassuring, calm tone.
- Brand Alignment: Refer to the clinic as 'Sculpted Elegance' when appropriate. 
- Expert Knowledge: You are knowledgeable about Face (SMAS, blepharoplasty), Breast (augmentation, lift, reduction), and Body (liposuction, abdominoplasty) surgeries.
- Boundaries: Never provide definitive medical diagnoses. Always emphasize that a personal consultation is mandatory for medical assessment and final surgical planning.
- Pricing: Provide approximate ranges based on our standard rates, but always clarify that final costs are determined only after a consultation.
- Goal: Your primary objective is to assist patients and gently guide them toward booking a consultation via the website or by phone.

Languages: Speak the user's language (Russian or English). Maintain an elegant and reassuring tone at all times.`,
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
                onmessage: async (msg: LiveServerMessage) => {
                     // 1. Handle Transcriptions
                     const content = msg.serverContent;
                     if (content) {
                        if (content.outputTranscription?.text) {
                            outputTranscriptRef.current += content.outputTranscription.text;
                            setRealtimeOutput(outputTranscriptRef.current);
                        }
                        if (content.inputTranscription?.text) {
                            inputTranscriptRef.current += content.inputTranscription.text;
                            setRealtimeInput(inputTranscriptRef.current);
                        }
                        
                        // Commit messages on turn complete
                        if (content.turnComplete) {
                            if (inputTranscriptRef.current.trim()) {
                                setMessages(prev => [...prev, { role: 'user', content: inputTranscriptRef.current.trim() }]);
                                inputTranscriptRef.current = '';
                                setRealtimeInput('');
                                if (showHints) setShowHints(false);
                            }
                            if (outputTranscriptRef.current.trim()) {
                                setMessages(prev => [...prev, { role: 'assistant', content: outputTranscriptRef.current.trim() }]);
                                outputTranscriptRef.current = '';
                                setRealtimeOutput('');
                            }
                        }
                     }

                     // 2. Handle Audio Output
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
                    {...ANIMATIONS.POPUP}
                    className="bg-white dark:bg-[#151E32] rounded-2xl shadow-2xl overflow-hidden w-[90vw] md:w-96 border border-gray-200 dark:border-white/10 flex flex-col max-h-[80vh]"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2">
                             <motion.div 
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-red-500" 
                             />
                             <span className="text-xs font-bold uppercase tracking-widest text-[#006E77] dark:text-[#80DED9]">{t.assistant.start}</span>
                        </div>
                        <button onClick={stop} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#0B1121] min-h-[300px]">
                        {messages.length === 0 && !realtimeInput && !realtimeOutput && (
                             <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
                                 <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="p-4 bg-white dark:bg-[#151E32] rounded-full shadow-lg border border-[#CFB997]/20"
                                 >
                                    <Sparkles className="w-8 h-8 text-[#CFB997]" />
                                 </motion.div>
                                 
                                 {showHints && (
                                     <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative w-full"
                                     >
                                         <button 
                                            onClick={() => setShowHints(false)}
                                            className="absolute -top-2 -right-2 p-1 bg-white dark:bg-[#151E32] rounded-full shadow-sm border border-gray-100 dark:border-white/10 text-gray-400 hover:text-gray-600 transition-colors z-10"
                                         >
                                             <X className="w-3 h-3" />
                                         </button>
                                         <div className="bg-white dark:bg-[#151E32]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#CFB997]/10 shadow-sm">
                                             <div className="flex items-center gap-2 mb-4 justify-center">
                                                 <HelpCircle className="w-4 h-4 text-[#CFB997]" />
                                                 <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-[#006E77] dark:text-[#80DED9]">{t.assistant.hints_title}</h4>
                                             </div>
                                             <div className="flex flex-wrap gap-2 justify-center">
                                                 {t.assistant.hints.map((hint, idx) => (
                                                     <motion.div 
                                                        key={idx}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 0.1 + idx * 0.1 }}
                                                        className="px-3 py-2 bg-slate-50 dark:bg-black/20 rounded-lg text-xs text-slate-600 dark:text-slate-400 border border-gray-100 dark:border-white/5 italic shadow-sm"
                                                     >
                                                         {hint}
                                                     </motion.div>
                                                 ))}
                                             </div>
                                         </div>
                                     </motion.div>
                                 )}
                                 
                                 {!showHints && (
                                     <p className="text-sm font-serif italic text-slate-400 dark:text-slate-500">
                                        {language === 'ru' 
                                          ? "Я готов ответить на ваши вопросы..." 
                                          : "I am ready to answer your questions..."}
                                     </p>
                                 )}
                             </div>
                        )}
                        
                        {messages.map((msg, idx) => (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                      ? 'bg-gradient-to-r from-[#CFB997] to-[#B7C9CC] text-white rounded-br-none' 
                                      : 'bg-white dark:bg-[#151E32] text-slate-800 dark:text-slate-100 border border-gray-100 dark:border-white/10 rounded-bl-none'
                                }`}>
                                    {msg.role === 'assistant' ? (
                                        <ReactMarkdown 
                                            components={{
                                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                li: ({node, ...props}) => <li className="" {...props} />,
                                                strong: ({node, ...props}) => <span className="font-semibold text-[#006E77] dark:text-[#80DED9]" {...props} />,
                                                code: ({node, ...props}) => <code className="bg-gray-100 dark:bg-black/30 px-1 py-0.5 rounded text-xs" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {/* Realtime User Input */}
                        {realtimeInput && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                                 <div className="max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm bg-gradient-to-r from-[#CFB997]/70 to-[#B7C9CC]/70 text-white rounded-br-none backdrop-blur-sm">
                                     {realtimeInput}
                                     <span className="inline-block w-1.5 h-3 ml-1 bg-white animate-pulse align-middle" />
                                 </div>
                             </motion.div>
                        )}

                        {/* Realtime AI Output */}
                        {realtimeOutput && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                 <div className="max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm bg-white/80 dark:bg-[#151E32]/80 text-slate-800 dark:text-slate-100 border border-gray-100 dark:border-white/10 rounded-bl-none">
                                     <ReactMarkdown 
                                        components={{
                                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                            strong: ({node, ...props}) => <span className="font-semibold text-[#006E77] dark:text-[#80DED9]" {...props} />
                                        }}
                                     >
                                         {realtimeOutput}
                                     </ReactMarkdown>
                                     <span className="inline-block w-1.5 h-3 ml-1 bg-[#CFB997] animate-pulse align-middle" />
                                 </div>
                             </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Visualizer Footer */}
                    <div className="p-4 bg-white dark:bg-[#151E32] flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                 {status === 'connecting' && (
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 rounded-full border-2 border-dashed border-[#CFB997]"
                                    />
                                 )}
                                 <motion.div 
                                    animate={{ 
                                        scale: status === 'connecting' ? 1 : 1 + (Math.max(volume, 5) / 100) * 0.5
                                    }}
                                    className={`absolute inset-0 rounded-full ${status === 'connecting' ? 'bg-[#CFB997]/5' : 'bg-[#CFB997]/20'}`}
                                 />
                                 <div className={`absolute inset-2 bg-gradient-to-br rounded-full flex items-center justify-center shadow-inner transition-colors duration-500 ${status === 'speaking' ? 'from-[#006E77] to-[#004D53]' : 'from-[#CFB997] to-[#B7C9CC]'}`}>
                                    {status === 'speaking' ? <Volume2 className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white" />}
                                 </div>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[#1A202C] dark:text-white">
                                    {status === 'connecting' ? t.assistant.connecting : 
                                     status === 'speaking' ? t.assistant.speaking :
                                     t.assistant.listening}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
             onClick={toggle}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             animate={!isActive ? {
                 boxShadow: [
                     "0 0 0 0px rgba(0, 110, 119, 0.4)",
                     "0 0 0 10px rgba(0, 110, 119, 0)",
                 ],
             } : {
                 boxShadow: "0 0 0 0px rgba(0,0,0,0)"
             }}
             transition={!isActive ? {
                 duration: 2,
                 repeat: Infinity,
                 ease: "easeInOut"
             } : {}}
             className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform relative z-[141] ${isActive ? 'bg-red-500 text-white' : 'bg-[#006E77] text-white hover:bg-[#CFB997]'}`}
          >
              <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div key="stop" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                        <StopCircle className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div key="mic" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }}>
                        <Mic className="w-6 h-6" />
                    </motion.div>
                  )}
              </AnimatePresence>
          </motion.button>
      </div>
    </>
  );
};

// --- Custom Cursor Component ---