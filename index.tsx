
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
  HelpCircle,
  Info,
  ExternalLink,
  GraduationCap,
  Search
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

const EASE_PREMIUM = [0.6, 0.01, 0.35, 1] as [number, number, number, number];

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
  },
  TEXT_REVEAL: {
    hidden: { opacity: 0, y: "100%", filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)", 
      transition: { duration: 1.4, ease: EASE_PREMIUM } 
    }
  },
  FADE_IN: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" as const } }
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

type BookingContextType = {
  isBookingOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
  isLegalOpen: boolean;
  openLegal: () => void;
  closeLegal: () => void;
};

const BookingContext = createContext<BookingContextType>({
  isBookingOpen: false,
  openBooking: () => {},
  closeBooking: () => {},
  isLegalOpen: false,
  openLegal: () => {},
  closeLegal: () => {},
});

const useBooking = () => useContext(BookingContext);

const GoldButton = ({ children, onClick, className = "", variant = "filled", disabled = false }: any) => {
  const baseClasses = "px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";
  
  if (variant === "filled") {
    return (
      <button onClick={onClick} disabled={disabled} className={`${baseClasses} text-white ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#B7C9CC] via-[#CFB997] to-[#EED6A6] opacity-100 transition-opacity duration-500 group-hover:opacity-90"></div>
        <div className="absolute inset-0 bg-[#006E77] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply"></div>
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} text-[#1A202C] dark:text-white group hover:text-[#006E77] dark:hover:text-[#80DED9] ${className}`}>
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

const BeforeAfter = ({ before, after }: { before: string, after: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    let clientX;
    if ('touches' in event) clientX = event.touches[0].clientX;
    else clientX = (event as React.MouseEvent).clientX;
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
         <img src={after} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="After" loading="lazy" />
         <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
            <img src={before} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Before" loading="lazy" />
         </div>
         <div className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize shadow-lg z-10" style={{ left: `${sliderPosition}%` }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <ArrowUpDown className="w-4 h-4 text-[#1A202C] rotate-90" />
            </div>
         </div>
         <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 text-xs rounded-full uppercase tracking-widest pointer-events-none">{t.portfolio.labels.before}</div>
         <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 text-xs rounded-full uppercase tracking-widest pointer-events-none">{t.portfolio.labels.after}</div>
      </div>
  );
};

const Lightbox = ({ items, initialIndex = 0, onClose }: { items: any[], initialIndex?: number, onClose: () => void }) => {
  const [index, setIndex] = useState(initialIndex);
  const { t } = useLanguage();
  
  const next = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

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
  const isComparison = !!(currentItem.beforeSrc && currentItem.afterSrc);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-50 p-2"><X className="w-8 h-8" /></button>
      <div className="relative w-full h-full flex items-center justify-center max-h-[85vh] max-w-6xl">
        <button onClick={prev} className="absolute left-2 md:-left-12 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-20"><ChevronLeft className="w-8 h-8" /></button>
        <div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode='wait'>
                <motion.div key={index} initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }} className="w-full h-full flex items-center justify-center">
                    {isComparison ? (
                         <div className="w-full h-full max-h-[70vh] aspect-[4/3] md:aspect-[16/9]"><BeforeAfter before={currentItem.beforeSrc!} after={currentItem.afterSrc!} /></div>
                    ) : (
                         <img src={currentItem.src} className="max-h-full max-w-full object-contain rounded shadow-2xl" alt={currentItem.title || "Image"} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
        <button onClick={next} className="absolute right-2 md:-right-12 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-20"><ChevronRight className="w-8 h-8" /></button>
      </div>
      <div className="absolute bottom-4 left-0 right-0 h-20 flex justify-center gap-2 overflow-x-auto px-4 py-2" onClick={(e) => e.stopPropagation()}>
         {items.map((item, i) => (
             <button key={i} onClick={() => setIndex(i)} className={`flex-shrink-0 h-full aspect-[4/3] overflow-hidden rounded border-2 transition-all ${index === i ? 'border-[#CFB997] scale-110' : 'border-transparent opacity-40 hover:opacity-70'}`}>
                 <img src={item.afterSrc || item.src} className="w-full h-full object-cover" alt="" />
             </button>
         ))}
      </div>
    </motion.div>
  );
};

// --- Helpers ---

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

// --- Custom Components ---

const Preloader = () => (
  <motion.div
    initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8, ease: EASE_PREMIUM } }}
    className="fixed inset-0 z-[1000] flex items-center justify-center bg-white dark:bg-[#0B1121]"
    style={{ backgroundImage: 'url("https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/texture-papper.jpg")', backgroundRepeat: 'repeat' }}
  >
    <div className="relative flex flex-col items-center gap-8">
      <motion.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/logo-gold.png" alt="Logo" className="w-64" />
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5 }} className="w-48 h-px bg-[#CFB997]" />
    </div>
  </motion.div>
);

// --- Voice Assistant ---

const VoiceAssistant = () => {
  const { t, language } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [messages, setMessages] = useState<any[]>([]);
  const [realtimeOutput, setRealtimeOutput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const activeSourceNodesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  const stop = async () => {
    setIsActive(false); setStatus('idle'); sessionPromiseRef.current = null;
    if (audioContextRef.current) { activeSourceNodesRef.current.forEach(n => n.stop()); activeSourceNodesRef.current.clear(); await audioContextRef.current.close(); audioContextRef.current = null; }
  };

  const start = async () => {
    try {
        setIsActive(true); setStatus('connecting');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = ctx; nextStartTimeRef.current = ctx.currentTime;
        let outputAccumulator = '';
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            config: { responseModalities: [Modality.AUDIO], inputAudioTranscription: {}, outputAudioTranscription: {}, systemInstruction: `You are 'Elegance', the AI concierge for Dr. Mironova. Be premium.` },
            callbacks: {
                onopen: () => {
                    setStatus('listening');
                    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    const source = inputCtx.createMediaStreamSource(stream);
                    const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                    processor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const pcmData = new Int16Array(inputData.length);
                        for (let i = 0; i < inputData.length; i++) pcmData[i] = inputData[i] * 32768;
                        const base64 = uint8ArrayToBase64(new Uint8Array(pcmData.buffer));
                        sessionPromise.then(s => s.sendRealtimeInput({ media: { mimeType: 'audio/pcm;rate=16000', data: base64 } }));
                    };
                    source.connect(processor); processor.connect(inputCtx.destination);
                },
                onmessage: async (msg: LiveServerMessage) => {
                    const data = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (data && audioContextRef.current) {
                        setStatus('speaking');
                        const bytes = base64ToUint8Array(data);
                        const data16 = new Int16Array(bytes.buffer);
                        const float32 = new Float32Array(data16.length);
                        for(let i=0; i<data16.length; i++) float32[i] = data16[i] / 32768.0;
                        const buffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
                        buffer.copyToChannel(float32, 0);
                        const source = audioContextRef.current.createBufferSource();
                        source.buffer = buffer; source.connect(audioContextRef.current.destination);
                        const startTime = Math.max(audioContextRef.current.currentTime, nextStartTimeRef.current);
                        source.start(startTime); nextStartTimeRef.current = startTime + buffer.duration;
                        activeSourceNodesRef.current.add(source);
                        source.onended = () => { activeSourceNodesRef.current.delete(source); if (activeSourceNodesRef.current.size === 0) setStatus('listening'); };
                    }
                    if (msg.serverContent?.outputTranscription?.text) { outputAccumulator += msg.serverContent.outputTranscription.text; setRealtimeOutput(outputAccumulator); }
                    if (msg.serverContent?.turnComplete) { setMessages(prev => [...prev, { role: 'assistant', content: outputAccumulator }]); setRealtimeOutput(''); outputAccumulator = ''; }
                },
                onclose: () => stop(), onerror: () => stop()
            }
        });
        sessionPromiseRef.current = sessionPromise;
    } catch { stop(); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[140] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isActive && (
          <motion.div {...ANIMATIONS.POPUP} className="bg-white/95 dark:bg-[#151E32]/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden w-[90vw] md:w-96 border border-white/20 flex flex-col max-h-[70vh]">
            <div className="flex justify-between items-center p-5 border-b dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
              <div className="flex items-center gap-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#CFB997]">{t.assistant.start}</span>
              </div>
              <button onClick={stop} className="text-gray-400 hover:text-black dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m, i) => <div key={i} className={`p-3 rounded-2xl text-sm ${m.role === 'assistant' ? 'bg-gray-100 dark:bg-white/5' : 'bg-[#CFB997] text-white self-end'}`}>{m.content}</div>)}
              {realtimeOutput && <div className="p-3 rounded-2xl text-sm bg-gray-50 dark:bg-white/5 italic">{realtimeOutput}<span className="inline-block w-1.5 h-3 ml-1 bg-[#CFB997] animate-pulse" /></div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-5 flex items-center gap-4 border-t dark:border-white/5">
              <div className="relative w-10 h-10 bg-[#CFB997] rounded-full flex items-center justify-center text-white">{status === 'speaking' ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{status === 'connecting' ? t.assistant.connecting : status === 'speaking' ? t.assistant.speaking : t.assistant.listening}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button onClick={isActive ? stop : start} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${isActive ? 'bg-red-500 text-white' : 'bg-gradient-to-tr from-[#006E77] to-[#004D53] text-white hover:shadow-[#006E77]/40'}`}><MessageCircle className="w-7 h-7" /></motion.button>
    </div>
  );
};

// --- Header ---

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { openBooking } = useBooking();
  const { theme, toggleTheme } = useTheme();
  useEffect(() => { const h = () => setIsScrolled(window.scrollY > 50); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);

  const logoSrc = theme === 'dark' 
    ? "https://storage.googleapis.com/uspeshnyy-projects/burnout/EM-logo-100-dark.png" 
    : "https://storage.googleapis.com/uspeshnyy-projects/burnout/EM-logo-100.png";

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${isScrolled ? 'py-4 bg-white/90 dark:bg-[#0B1121]/90 backdrop-blur-xl shadow-sm' : 'py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <img 
          src={logoSrc} 
          alt="Dr. Mironova" 
          className="h-10 md:h-12 w-auto cursor-pointer object-contain" 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
        />
        <nav className="hidden lg:flex items-center gap-10">
          {['operations', 'portfolio', 'price', 'about', 'contacts'].map(id => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] uppercase tracking-[0.25em] hover:text-[#CFB997] transition-colors dark:text-white font-semibold">{t.nav[id as keyof typeof t.nav]}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
             <button onClick={toggleTheme} className="p-2 opacity-50 hover:opacity-100">{theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}</button>
             <button onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')} className="text-[10px] font-bold tracking-widest hover:text-[#CFB997]">{language.toUpperCase()}</button>
          </div>
          <GoldButton onClick={openBooking} className="hidden sm:flex px-6 py-3">{t.nav.book}</GoldButton>
          <button onClick={() => setIsMobileNavOpen(true)} className="lg:hidden p-2"><Menu className="w-8 h-8" /></button>
        </div>
      </div>
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </header>
  );
};

const MobileNav = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { t, setLanguage, language } = useLanguage();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div {...ANIMATIONS.OVERLAY} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150]" onClick={onClose} />
          <motion.div {...ANIMATIONS.SIDEBAR} className="fixed top-0 right-0 h-full w-[80vw] max-sm:w-[85vw] bg-white dark:bg-[#0B1121] z-[151] p-8 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-12"><span className="text-xl serif-font italic gold-text">Dr. Mironova</span><button onClick={onClose}><X className="w-8 h-8" /></button></div>
            <nav className="flex flex-col gap-6 flex-1 text-2xl serif-font">
                {['operations', 'portfolio', 'price', 'about', 'contacts'].map(id => (<button key={id} onClick={() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); onClose(); }} className="text-left dark:text-white">{t.nav[id as keyof typeof t.nav]}</button>))}
            </nav>
            <div className="pt-8 border-t dark:border-white/10 flex flex-col gap-4">
                <button onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')} className="text-sm font-bold uppercase tracking-widest">{language === 'ru' ? 'English Version' : 'На русском'}</button>
                <GoldButton onClick={() => { onClose(); document.getElementById('contacts')?.scrollIntoView(); }}>{t.nav.book}</GoldButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Modals ---

const FullPriceModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { t, language } = useLanguage();
    const prices = getPrices(language);
    const [search, setSearch] = useState('');
    const filteredPrices = useMemo(() => {
        if (!search) return prices;
        return prices.map(cat => ({ ...cat, items: cat.items.filter(item => item.name.toLowerCase().includes(search.toLowerCase())) })).filter(cat => cat.items.length > 0);
    }, [prices, search]);
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8">
                    <motion.div {...ANIMATIONS.OVERLAY} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
                    <motion.div {...ANIMATIONS.MODAL} className="bg-white dark:bg-[#0B1121] w-full max-w-5xl h-full md:h-[90vh] rounded-2xl relative overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-6 border-b dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex flex-col md:flex-row justify-between items-center gap-6">
                            <h2 className="text-3xl serif-font italic dark:text-white">{t.price.title}</h2>
                            <div className="relative w-full md:w-80"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" /><input type="text" placeholder={language === 'ru' ? 'Поиск услуги...' : 'Search...'} className="w-full bg-white dark:bg-white/5 rounded-full py-2.5 pl-11 pr-4 outline-none border dark:border-white/10 focus:border-[#CFB997]" value={search} onChange={e => setSearch(e.target.value)} /></div>
                            <button onClick={onClose} className="p-2 absolute top-4 right-4 md:static"><X className="w-8 h-8" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12">
                            {filteredPrices.map((cat, idx) => (
                                <div key={idx}><h3 className="text-xl serif-font italic text-[#CFB997] mb-6 border-b dark:border-white/5 pb-2">{cat.category}</h3><div className="space-y-3">{cat.items.map((item, i) => (<div key={i} className="flex justify-between items-end gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"><div className="flex flex-col"><span className="text-sm font-medium dark:text-white">{item.name}</span>{item.note && <span className="text-[10px] uppercase tracking-widest opacity-40">{item.note}</span>}</div><span className="text-sm font-bold text-[#CFB997] whitespace-nowrap">{item.price}</span></div>))}</div></div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const DoctorDetailsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { t } = useLanguage();
    const accordionItems = getDoctorAccordionItems(t);
    const [openIdx, setOpenIdx] = useState<number>(0);
    const { openBooking } = useBooking();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8">
                    <motion.div {...ANIMATIONS.OVERLAY} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
                    <motion.div {...ANIMATIONS.MODAL} className="bg-white dark:bg-[#0B1121] w-full max-w-6xl h-full md:h-[90vh] rounded-2xl relative overflow-hidden flex flex-col shadow-2xl">
                        <button onClick={onClose} className="absolute top-6 right-6 z-50 text-slate-400 hover:text-black dark:hover:text-white"><X className="w-8 h-8" /></button>
                        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
                            <div className="w-full lg:w-[45%] h-[50vh] lg:h-auto relative">
                                <img src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/emir-mob-9.jpg" className="w-full h-full object-cover object-top" alt="Doctor Mironova" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
                                    <span className="text-[10px] uppercase tracking-[0.4em] text-[#CFB997] mb-4 block font-bold">{t.doctor.tag}</span>
                                    <h2 className="text-5xl serif-font italic mb-4">{t.doctor.name}</h2>
                                    <p className="text-xs uppercase tracking-widest opacity-80 leading-relaxed max-w-xs">{t.doctor.title}</p>
                                </div>
                            </div>
                            <div className="w-full lg:w-[55%] p-8 md:p-16 lg:p-24 space-y-12">
                                <div className="space-y-4">
                                    {accordionItems.map((item, idx) => (
                                        <div key={idx} className="border-b dark:border-white/10 pb-4">
                                            <button onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)} className="w-full flex justify-between items-center text-left py-4 group">
                                                <span className={`text-sm uppercase tracking-widest font-bold transition-colors ${openIdx === idx ? 'text-[#CFB997]' : 'hover:text-[#CFB997]'}`}>{item.title}</span>
                                                {openIdx === idx ? <Minus className="w-4 h-4 text-[#CFB997]" /> : <Plus className="w-4 h-4 opacity-30" />}
                                            </button>
                                            <AnimatePresence>{openIdx === idx && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">{item.content}</div></motion.div>}</AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-8 bg-[#CFB997]/5 border-l-2 border-[#CFB997] space-y-6">
                                    <p className="text-lg italic font-serif opacity-80 leading-relaxed">"{t.doctor.quote}"</p>
                                    <GoldButton onClick={() => { onClose(); openBooking(); }} className="w-full">{t.doctor.cta}</GoldButton>
                                </div>
                                <div className="space-y-8 pt-8">
                                    <h4 className="text-xs uppercase tracking-[0.4em] font-bold text-[#CFB997]">{t.doctor.sections.publications}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { img: 'wmc.webp', text: t.doctor.content.publicationsList[0] },
                                            { img: 'euro.webp', text: t.doctor.content.publicationsList[1] },
                                            { img: 'est.webp', text: t.doctor.content.publicationsList[2] }
                                        ].map((p, i) => (
                                            <div key={i} className="group space-y-3">
                                                <img src={`https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/${p.img}`} className="w-full aspect-video object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                                                <p className="text-[10px] leading-relaxed opacity-60 italic">{p.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-8 md:gap-12 opacity-30 grayscale pt-12">
                                    {['moscow.svg', 'tatler.svg', 'news.svg', 'people.svg'].map(l => <img key={l} src={`https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/${l}`} className="h-4 md:h-6 w-auto" alt="" />)}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// --- App Sections ---

const Hero = () => {
  const { t } = useLanguage();
  const { openBooking } = useBooking();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.35, 
        delayChildren: 0.5,
        ease: EASE_PREMIUM
      } 
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full lg:w-[55%] z-0">
          <motion.div initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 3.5, ease: "easeOut" }} className="w-full h-full relative">
             <picture>
               <source media="(max-width: 768px)" srcSet="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/emir-mob-7.jpg" />
               <img src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/emir-hd-7-1.jpg" className="w-full h-full object-cover object-center" alt="Doctor" loading="eager" />
             </picture>
             <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 dark:from-[#0B1121] dark:via-[#0B1121]/40 to-transparent" />
          </motion.div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl space-y-12">
           <motion.div variants={ANIMATIONS.FADE_IN} className="flex items-center gap-4">
             <div className="h-px w-12 bg-[#CFB997]" />
             <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#CFB997]">{t.hero.tag}</span>
           </motion.div>
           
           <motion.h1 className="text-5xl md:text-[11rem] leading-[0.85] flex flex-col serif-font italic select-none">
             <div className="overflow-hidden">
               <motion.span variants={ANIMATIONS.TEXT_REVEAL} className="block opacity-40">{t.hero.title1}</motion.span>
             </div>
             <div className="overflow-hidden">
               <motion.span variants={ANIMATIONS.TEXT_REVEAL} className="block translate-x-6 md:translate-x-32">{t.hero.title2}</motion.span>
             </div>
             <div className="overflow-hidden">
               <motion.span variants={ANIMATIONS.TEXT_REVEAL} className="block gold-text self-end">{t.hero.title3}</motion.span>
             </div>
           </motion.h1>

           <motion.p variants={ANIMATIONS.FADE_IN} className="max-w-lg text-lg font-light text-slate-500 italic font-playfair">
             {t.hero.desc}
           </motion.p>

           <motion.div variants={ANIMATIONS.FADE_IN} className="flex flex-col sm:flex-row gap-8 pt-4">
             <GoldButton onClick={openBooking}>{t.hero.cost} <ArrowRight className="w-4 h-4 ml-2" /></GoldButton>
             <button onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] uppercase tracking-[0.4em] font-bold border-b border-[#CFB997] pb-1 hover:text-[#CFB997] dark:text-white transition-colors">
               {t.hero.portfolio}
             </button>
           </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const OperationsList = () => {
    const { t } = useLanguage(); const { openBooking } = useBooking();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const services = getServicesData(t);
    return (
        <section id="operations" className="py-32 bg-white dark:bg-[#0B1121]">
            <div className="container mx-auto px-6"><SectionTitle subtitle={t.operations.subtitle}>{t.operations.title}</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {services.map((s, idx) => (
                        <motion.div key={s.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="group">
                            <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-8 shadow-xl cursor-pointer" onClick={() => setSelectedId(s.id)}>
                                <img src={s.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"><div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"><Plus className="w-8 h-8" /></div></div>
                            </div>
                            <h3 className="text-3xl serif-font italic mb-4 dark:text-white">{s.title}</h3>
                            <button onClick={() => setSelectedId(s.id)} className="text-[10px] uppercase tracking-widest font-bold text-[#CFB997] flex items-center gap-2 hover:gap-4 transition-all">{t.operations.details} <ArrowRight className="w-4 h-4" /></button>
                        </motion.div>
                    ))}
                </div>
            </div>
            <AnimatePresence>
                {selectedId && (
                    <motion.div {...ANIMATIONS.OVERLAY} className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedId(null)}>
                        <motion.div {...ANIMATIONS.MODAL} className="bg-white dark:bg-[#151E32] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-12 relative rounded shadow-2xl" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setSelectedId(null)} className="absolute top-8 right-8"><X className="w-8 h-8" /></button>
                            {services.filter(s => s.id === selectedId).map(s => (
                                <div key={s.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="aspect-[3/4] rounded-sm overflow-hidden"><img src={s.image} className="w-full h-full object-cover" alt="" /></div>
                                    <div className="space-y-8">
                                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#CFB997]">{t.operations.labels.direction}</span>
                                        <h2 className="text-4xl md:text-5xl serif-font italic dark:text-white leading-tight">{s.title}</h2>
                                        <p className="text-sm text-slate-500 italic font-playfair leading-relaxed">{s.intro}</p>
                                        <div className="space-y-4 border-t dark:border-white/5 pt-6">
                                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#CFB997]">{t.operations.labels.from}</h4>
                                            {s.prices.map((p, i) => <div key={i} className="flex justify-between items-center"><span className="text-sm dark:text-white">{p.name}</span><span className="font-bold text-[#CFB997]">{p.price}</span></div>)}
                                        </div>
                                        <GoldButton onClick={() => { setSelectedId(null); openBooking(); }} className="w-full">{t.operations.modal.btn}</GoldButton>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

const Portfolio = () => {
  const { t, language } = useLanguage();
  const allItems = useMemo(() => getPortfolioItems(), []);
  const [cat, setCat] = useState<'all' | 'face' | 'breast' | 'body'>('all');
  const [showAll, setShowAll] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const filtered = useMemo(() => 
    cat === 'all' ? allItems : allItems.filter(i => i.category === cat), 
  [allItems, cat]);

  // Dynamically update displayed items based on "Show All" toggle
  const displayItems = useMemo(() => 
    showAll ? filtered : filtered.slice(0, 6),
  [filtered, showAll]);

  // Reset showAll when category changes
  useEffect(() => {
    setShowAll(false);
  }, [cat]);

  return (
    <section id="portfolio" className="py-32 bg-[#F8F9F9] dark:bg-[#0B1121]">
      <div className="container mx-auto px-6">
        <SectionTitle subtitle={t.portfolio.subtitle}>{t.portfolio.title}</SectionTitle>
        
        {/* Category Filter UI */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {(['all', 'face', 'breast', 'body'] as const).map(c => (
            <button 
              key={c} 
              onClick={() => setCat(c)} 
              className={`px-8 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold rounded-full transition-all duration-500 border ${
                cat === c 
                  ? 'bg-[#CFB997] text-white border-[#CFB997] shadow-lg shadow-[#CFB997]/20 scale-105' 
                  : 'border-[#CFB997]/20 text-[#1A202C]/60 dark:text-slate-400 hover:border-[#CFB997] hover:text-[#CFB997]'
              }`}
            >
              {t.portfolio.filters[c]}
            </button>
          ))}
        </div>

        {/* Dynamically Updated Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode='popLayout'>
            {displayItems.map((item, idx) => (
                <motion.div 
                    layout
                    key={item.id} 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    viewport={{ once: true }}
                    transition={{ 
                      opacity: { duration: 0.4 },
                      layout: { duration: 0.6, ease: EASE_PREMIUM }
                    }} 
                    whileHover={{ 
                        y: -12, 
                        scale: 1.02,
                        boxShadow: "0 30px 60px -12px rgba(207, 185, 151, 0.35)",
                        transition: { duration: 0.4, ease: EASE_PREMIUM }
                    }}
                    className="aspect-[4/3] rounded-sm overflow-hidden shadow-xl cursor-pointer bg-white dark:bg-[#151E32] group relative" 
                    onClick={() => setSelectedIdx(idx)}
                >
                    <BeforeAfter before={item.beforeSrc || ""} after={item.afterSrc || ""} />
                    {/* Visual hint for interaction */}
                    <div className="absolute inset-0 bg-[#CFB997]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More / Show Less Toggle */}
        {filtered.length > 6 && (
            <div className="mt-20 text-center">
                <GoldButton variant="outline" onClick={() => setShowAll(!showAll)}>
                    {showAll 
                      ? (language === 'ru' ? 'Свернуть' : 'Show Less') 
                      : t.portfolio.all
                    }
                </GoldButton>
            </div>
        )}
      </div>

      {/* Lightbox for full view */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <Lightbox 
            items={filtered} 
            initialIndex={selectedIdx} 
            onClose={() => setSelectedIdx(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const PriceList = () => {
    const { t, language } = useLanguage(); const { openBooking } = useBooking();
    const [isFullPriceOpen, setIsFullPriceOpen] = useState(false);
    const prices = getPrices(language);
    return (
        <section id="price" className="py-32 bg-white dark:bg-[#0B1121]">
            <div className="container mx-auto px-6"><SectionTitle subtitle={t.price.subtitle}>{t.price.title}</SectionTitle>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {prices.slice(0, 2).map((c, idx) => (
                        <div key={idx} className="p-10 md:p-16 border dark:border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#CFB997] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700" />
                            <h3 className="text-3xl serif-font italic mb-10 dark:text-white">{c.category}</h3>
                            <div className="space-y-6">
                                {c.items.slice(0, 6).map((item, i) => (<div key={i} className="flex justify-between items-end gap-4"><span className="text-sm dark:text-white font-medium">{item.name}</span><div className="flex-1 border-b border-dotted dark:border-white/20 mb-1" /><span className="text-sm font-bold text-[#CFB997]">{item.price}</span></div>))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-16 text-center space-y-8"><p className="text-[10px] uppercase tracking-widest opacity-40 italic max-w-2xl mx-auto">{t.price.disclaimer}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6"><GoldButton onClick={openBooking}>{t.price.buttons.calc}</GoldButton><GoldButton variant="outline" onClick={() => setIsFullPriceOpen(true)}>{t.price.buttons.full}</GoldButton></div>
                </div>
            </div>
            <FullPriceModal isOpen={isFullPriceOpen} onClose={() => setIsFullPriceOpen(false)} />
        </section>
    );
};

const DIPLOMAS = Array.from({ length: 13 }, (_, i) => ({
    src: `https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/diploms/${i + 1}.jpeg`,
    title: `Diploma ${i + 1}`
}));

const About = () => {
  // Fix: Extract 'language' from useLanguage() to resolve 'Cannot find name language' error
  const { t, language } = useLanguage();
  const accordionItems = getDoctorAccordionItems(t);
  const [openIdx, setOpenIdx] = useState<number>(0);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isDiplomasOpen, setIsDiplomasOpen] = useState(false);
  return (
    <section id="about" className="py-32 bg-[#F8F9F9] dark:bg-[#0B1121] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
           <div className="w-full lg:w-1/2 relative">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl relative z-10"><img src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/doc-main-about.jpg" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" alt="" /></motion.div>
             <div className="absolute -bottom-8 -left-8 p-8 bg-white dark:bg-[#151E32] shadow-xl z-20 hidden md:block border-l-4 border-[#CFB997]"><div className="flex items-center gap-4 mb-2"><Award className="w-8 h-8 text-[#CFB997]" /><span className="text-4xl serif-font italic">15+</span></div><p className="text-[10px] uppercase tracking-widest font-bold opacity-40">{language === 'ru' ? 'Лет практики' : 'Years of Practice'}</p></div>
           </div>
           <div className="w-full lg:w-1/2 space-y-12">
             <div className="space-y-6"><span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#CFB997]">{t.doctor.tag}</span><h2 className="text-6xl md:text-8xl serif-font italic dark:text-white leading-none">{t.doctor.name}</h2><p className="text-xl italic font-serif opacity-60 italic">{t.doctor.quote}</p></div>
             <div className="space-y-4">
                {accordionItems.map((item, idx) => (
                  <div key={idx} className="border-b dark:border-white/10 pb-4">
                    <button onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)} className="w-full flex justify-between items-center text-left py-2 group"><span className={`text-sm uppercase tracking-widest font-bold transition-colors ${openIdx === idx ? 'text-[#CFB997]' : 'dark:text-white hover:text-[#CFB997]'}`}>{item.title}</span>{openIdx === idx ? <Minus className="w-4 h-4 text-[#CFB997]" /> : <Plus className="w-4 h-4 opacity-30" />}</button>
                    <AnimatePresence>{openIdx === idx && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="pt-4 text-sm text-slate-500 dark:text-slate-400 font-light italic leading-relaxed">{item.content}</div></motion.div>}</AnimatePresence>
                  </div>
                ))}
             </div>
             <div className="flex flex-wrap gap-4 pt-4"><GoldButton onClick={() => setIsDiplomasOpen(true)} variant="outline"><GraduationCap className="w-4 h-4 mr-2" /> {t.about.buttons.diplomas}</GoldButton><GoldButton onClick={() => setIsDoctorModalOpen(true)}><Info className="w-4 h-4 mr-2" /> {t.about.buttons.more}</GoldButton></div>
           </div>
        </div>
      </div>
      <AnimatePresence>{isDiplomasOpen && <Lightbox items={DIPLOMAS} onClose={() => setIsDiplomasOpen(false)} />}</AnimatePresence>
      <DoctorDetailsModal isOpen={isDoctorModalOpen} onClose={() => setIsDoctorModalOpen(false)} />
    </section>
  );
};

const Footer = () => {
  const { t } = useLanguage(); const { openLegal } = useBooking();
  
  const logoSrcDark = "https://storage.googleapis.com/uspeshnyy-projects/burnout/EM-logo-100-dark.png";

  return (
    <footer id="contacts" className="bg-[#0B1121] text-white py-24 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <img src={logoSrcDark} alt="Logo" className="h-10" />
            <p className="text-sm opacity-40 italic leading-relaxed">{t.hero.desc}</p>
          </div>
          <div><h4 className="text-[10px] uppercase tracking-widest font-bold text-[#CFB997] mb-10">{t.footer.nav_title}</h4><nav className="flex flex-col gap-5 text-sm opacity-60">{['operations', 'portfolio', 'price', 'about'].map(id => (<button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({behavior: 'smooth'})} className="text-left hover:text-white transition-colors">{t.nav[id as keyof typeof t.nav]}</button>))}</nav></div>
          <div><h4 className="text-[10px] uppercase tracking-widest font-bold text-[#CFB997] mb-10">{t.footer.patients_title}</h4><nav className="flex flex-col gap-5 text-sm opacity-60"><a href="#" className="hover:text-white transition-colors">{t.footer.links.faq}</a><a href="#" className="hover:text-white transition-colors">{t.footer.links.prep}</a><a href="#" className="hover:text-white transition-colors">{t.footer.links.rehab}</a></nav></div>
          <div className="space-y-8"><h4 className="text-[10px] uppercase tracking-widest font-bold text-[#CFB997]">{t.footer.contacts_title}</h4><div className="flex flex-col gap-5 text-sm opacity-60"><div className="flex items-start gap-4"><MapPin className="w-4 h-4 text-[#CFB997] mt-1" /><span>{CONFIG.CONTACTS.ADDRESS}</span></div><div className="flex items-center gap-4"><Phone className="w-4 h-4 text-[#CFB997]" /><a href={`tel:${CONFIG.CONTACTS.PHONE}`} className="hover:text-white">{CONFIG.CONTACTS.PHONE_DISPLAY}</a></div><button onClick={openLegal} className="flex items-center gap-4 hover:text-[#CFB997] transition-colors"><ShieldAlert className="w-4 h-4 text-[#CFB997]" /><span>{t.footer.legal_link}</span></button></div></div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-8 text-[10px] uppercase tracking-widest opacity-30 italic"><p>© {new Date().getFullYear()} {t.footer.rights}</p><div className="flex gap-8"><a href="#">{t.footer.policy}</a><a href="#">Terms of Use</a></div></div>
      </div>
    </footer>
  );
};

const BookingModal = () => {
    const { isBookingOpen, closeBooking } = useBooking(); const { t } = useLanguage();
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [form, setForm] = useState({ op: '', name: '', tel: '' });
    const h = async (e: React.FormEvent) => { e.preventDefault(); setStatus('sending');
        try { await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT.TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: CONFIG.TELEGRAM_BOT.CHAT_ID, text: `Lead:\nName: ${form.name}\nTel: ${form.tel}\nOp: ${form.op}` }) }); setStatus('success'); setTimeout(() => { closeBooking(); setStatus('idle'); }, 3000); } 
        catch { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
    };
    return (
        <AnimatePresence>{isBookingOpen && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                <motion.div {...ANIMATIONS.OVERLAY} className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={closeBooking} />
                <motion.div {...ANIMATIONS.MODAL} className="bg-white dark:bg-[#151E32] w-full max-w-xl p-8 md:p-16 relative rounded shadow-2xl overflow-hidden">
                    <button onClick={closeBooking} className="absolute top-6 right-6"><X className="w-8 h-8" /></button>
                    {status === 'success' ? (<div className="text-center py-10 space-y-6"><div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="w-10 h-10 text-green-500" /></div><h3 className="text-3xl serif-font italic dark:text-white">{t.booking.successTitle}</h3></div>) : (
                        <form onSubmit={h} className="space-y-8"><SectionTitle subtitle={t.booking.subtitle} align="left">{t.booking.title}</SectionTitle>
                            <div className="space-y-6"><select required className="w-full bg-transparent border-b dark:border-white/10 py-4 text-sm focus:border-[#CFB997] outline-none dark:text-white" value={form.op} onChange={e => setForm({...form, op: e.target.value})}><option value="" disabled>{t.booking.labels.select}</option><option value="face">{t.booking.ops.face}</option><option value="breast">{t.booking.ops.breast}</option><option value="body">{t.booking.ops.body}</option></select><input required type="text" placeholder={t.booking.labels.name} className="w-full bg-transparent border-b dark:border-white/10 py-4 text-sm focus:border-[#CFB997] outline-none dark:text-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /><input required type="tel" placeholder={t.booking.labels.phone} className="w-full bg-transparent border-b dark:border-white/10 py-4 text-sm focus:border-[#CFB997] outline-none dark:text-white" value={form.tel} onChange={e => setForm({...form, tel: e.target.value})} /></div>
                            <GoldButton className="w-full" disabled={status === 'sending'}>{status === 'sending' ? t.booking.labels.sending : t.booking.labels.send}</GoldButton>
                        </form>
                    )}
                </motion.div>
            </div>
        )}</AnimatePresence>
    );
};

const LegalModal = () => {
    const { isLegalOpen, closeLegal } = useBooking(); const { language } = useLanguage();
    const [idx, setIdx] = useState(0);
    const tabs = language === 'ru' ? ["Оферта (Бронь)", "Оферта (Консультация)", "Информ. услуги", "Оплата", "Сроки", "ПД", "Возврат"] : ["Booking Offer", "Consultation Offer", "Services", "Payment", "Terms", "Privacy", "Refund"];
    return (
        <AnimatePresence>{isLegalOpen && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-10">
                <motion.div {...ANIMATIONS.OVERLAY} className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={closeLegal} />
                <motion.div {...ANIMATIONS.MODAL} className="bg-white dark:bg-[#0B1121] w-full max-w-5xl h-full md:h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                    <div className="p-6 border-b dark:border-white/5 flex justify-between items-center"><h2 className="text-3xl serif-font italic dark:text-white">{language === 'ru' ? 'Юридическая информация' : 'Legal Information'}</h2><button onClick={closeLegal}><X className="w-8 h-8" /></button></div>
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        <div className="w-full md:w-64 bg-gray-50 dark:bg-black/20 overflow-x-auto md:overflow-y-auto p-4 flex md:flex-col gap-2 border-r dark:border-white/5">{tabs.map((t, i) => (<button key={i} onClick={() => setIdx(i)} className={`px-4 py-3 text-left rounded-xl text-xs uppercase tracking-widest transition-all ${idx === i ? 'bg-[#CFB997] text-white shadow-lg' : 'hover:bg-gray-200 dark:hover:bg-white/5 dark:text-slate-400'}`}>{t}</button>))}</div>
                        <div className="flex-1 overflow-y-auto p-8"><LegalContent activeTab={idx} language={language} /></div>
                    </div>
                </motion.div>
            </div>
        )}</AnimatePresence>
    );
};

// --- App Root ---

const App = () => {
  const [language, setLanguage] = useState<Language>('ru'); const [theme, setTheme] = useState<Theme>('light');
  const [isBookingOpen, setIsBookingOpen] = useState(false); const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); const t = useMemo(() => TRANSLATIONS[language], [language]);
  
  useEffect(() => { 
    const l = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true }); 
    function raf(t: number) { l.raf(t); requestAnimationFrame(raf); } 
    requestAnimationFrame(raf); 
    setTimeout(() => setIsLoading(false), 2000); 
    return () => l.destroy(); 
  }, []);
  
  useEffect(() => { 
    document.documentElement.classList.toggle('dark', theme === 'dark'); 
  }, [theme]);

  useEffect(() => {
    document.title = language === 'ru' ? 'Пластический хирург Елена Миронова' : 'Plastic Surgeon Elena Mironova';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light') }}>
        <BookingContext.Provider value={{ isBookingOpen, openBooking: () => setIsBookingOpen(true), closeBooking: () => setIsBookingOpen(false), isLegalOpen, openLegal: () => { setIsLegalOpen(true); setIsBookingOpen(false); }, closeLegal: () => setIsLegalOpen(false) }}>
          <AnimatePresence mode="wait">{isLoading && <Preloader key="preloader" />}</AnimatePresence>
          <div className="bg-[#F8F9F9] dark:bg-[#0B1121] transition-colors duration-500">
            <Header /><main><Hero /><OperationsList /><Portfolio /><PriceList /><About /></main><Footer /><VoiceAssistant /><BookingModal /><LegalModal />
          </div>
        </BookingContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) createRoot(rootElement).render(<App />);
