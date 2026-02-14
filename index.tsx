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

// --- Design System Constants ---
const PREMIUM_TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

// --- Translations ---

const TRANSLATIONS = {
  ru: {
    nav: {
      operations: "Операции",
      portfolio: "Портфолио",
      prices: "Цены",
      about: "О докторе",
      contacts: "Контакты",
      book: "Записаться"
    },
    hero: {
      tag: "Пластическая хирургия в Москве",
      title1: "Искусство",
      title2: "Скульптуры",
      title3: "Тела",
      desc: "Создаем совершенные линии и формы, вдохновленные вашей природной красотой. Авторская пластическая хирургия от Елены Мироновой.",
      cost: "Узнать стоимость",
      portfolio: "Смотреть работы",
      scroll: "Листайте вниз"
    },
    booking: {
      title: "Заполните форму",
      subtitle: "и мы ответим вам в ближайшее время",
      successTitle: "Заявка отправлена",
      successDesc: "Мы свяжемся с вами в ближайшее время.",
      labels: {
        operation: "Операция",
        name: "Имя",
        email: "Email",
        phone: "Телефон для связи",
        select: "Выберите...",
        send: "Получить расчет",
        sending: "Отправка..."
      },
      ops: {
        face: "Пластика лица",
        breast: "Пластика груди",
        body: "Пластика тела"
      },
      error: "Ошибка отправки. Попробуйте позже."
    },
    doctor: {
      tag: "Пластический хирург",
      name: "Миронова Елена",
      title: "Пластический хирург, кандидат медицинских наук",
      cta: "Рассчитать стоимость операции",
      quote: "15 лет практики в крупнейших клиниках пластической и реконструктивной хирургии Москвы",
      sections: {
        practice: "Практика",
        education: "Образование",
        publications: "Научные публикации/выступления"
      },
      content: {
        practiceInit: "Практика в крупнейших клиниках пластической и реконструктивной хирургии Москвы:",
        practiceList: [
          "ФГБУ НМИЦ ЦНИИС и ЧЛХ Минздрава РФ, «ГКБ им. М.Е. Жадкевича», К31, «Медисанс»",
          "Опыт работы – 15 лет, более 300 операций ежегодно"
        ]
      }
    },
    about: {
      exp: "12 лет опыта",
      degree: "Кандидат наук",
      quote1: "«Пластическая хирургия — это не просто изменение внешности, это тонкая работа с самоощущением. Моя задача как хирурга — не перекроить лицо или тело, а раскрыть тот потенциал, который уже заложен природой, убрав лишнее и подчеркнув главное.»",
      quote2: "Каждая операция для меня — это симбиоз математической точности и художественного видения. Мы создаем новую версию вас — уверенную, сияющую, гармоничную.",
      stats: {
        ops: "Успешных операций",
        safety: "Безопасность"
      },
      buttons: {
        diplomas: "Дипломы",
        more: "Подробнее о докторе Мироновой"
      }
    },
    operations: {
      title: "Пластические операции",
      subtitle: "Услуги клиники",
      details: "Подробнее",
      modal: {
        services: "Мои услуги",
        prices: "Стоимость услуг",
        why: "Почему выбирают меня?",
        cta: "Подарите себе уверенность в собственной красоте. Запишитесь на консультацию уже сегодня!",
        btn: "Рассчитать стоимость операции"
      }
    },
    portfolio: {
      title: "Работы До и После",
      subtitle: "Реальные истории преображения. Результат, который говорит громче слов.",
      all: "Смотреть все работы",
      filters: {
        all: "Все работы",
        face: "Лицо",
        breast: "Грудь",
        body: "Тело"
      },
      sort: {
        label: "Сортировка",
        newest: "Сначала новые",
        popular: "Популярные"
      },
      labels: {
        before: "До",
        after: "После"
      }
    },
    price: {
      title: "Стоимость операций",
      subtitle: "Цены на пластику",
      disclaimer: "* Окончательная стоимость определяется после консультации. В стоимость включено: операция, анестезия, стационар, компрессионное белье.",
      buttons: {
        full: "Подробный прайс",
        calc: "Рассчитать стоимость"
      },
      categories: {
        face: "Лицо",
        body_breast: "Тело и Грудь",
        body: "Тело",
        breast: "Грудь",
        extra: "Дополнительные услуги"
      }
    },
    footer: {
      brand_sub: "Sculpted Elegance",
      address: "Клиника эстетической медицины премиум-класса. Москва, Пресненская наб., 12",
      menu: "Меню",
      patients: "Пациентам",
      contacts: "Контакты",
      work_hours: "Пн-Вс: 10:00 - 21:00",
      callback: "Соглашения и оплата",
      rights: "All rights reserved.",
      policy: "Политика конфиденциальности",
      offer: "Договор оферты",
      links: {
        faq: "FAQ",
        prep: "Подготовка",
        rehab: "Реабилитация"
      }
    },
    assistant: {
        start: "AI Ассистент",
        connecting: "Подключение...",
        listening: "Слушаю...",
        speaking: "Говорю...",
        active_desc: "Голосовой помощник доктора Мироновой",
        stop: "Завершить диалог"
    }
  },
  en: {
    nav: {
      operations: "Procedures",
      portfolio: "Portfolio",
      prices: "Prices",
      about: "About Doctor",
      contacts: "Contacts",
      book: "Book Now"
    },
    hero: {
      tag: "Plastic Surgery in Moscow",
      title1: "The Art",
      title2: "of Body",
      title3: "Sculpture",
      desc: "Creating perfect lines and forms inspired by your natural beauty. Author's plastic surgery by Elena Mironova.",
      cost: "Get a Quote",
      portfolio: "View Portfolio",
      scroll: "Scroll"
    },
    booking: {
      title: "Fill the form",
      subtitle: "and we will answer you shortly",
      successTitle: "Request Sent",
      successDesc: "We will contact you shortly.",
      labels: {
        operation: "Procedure",
        name: "Name",
        email: "Email",
        phone: "Phone Number",
        select: "Select...",
        send: "Get Calculation",
        sending: "Sending..."
      },
      ops: {
        face: "Face Surgery",
        breast: "Breast Surgery",
        body: "Body Surgery"
      },
      error: "Error sending. Please try again later."
    },
    doctor: {
      tag: "About Doctor",
      name: "Elena Mironova",
      title: "Plastic Surgeon, PhD in Medicine",
      cta: "Calculate Procedure Cost",
      quote: "15 years of practice in the largest plastic and reconstructive surgery clinics in Moscow",
      sections: {
        practice: "Practice",
        education: "Education",
        publications: "Scientific Publications/Speeches"
      },
      content: {
        practiceInit: "Practice in the largest plastic and reconstructive surgery clinics in Moscow:",
        practiceList: [
          "FSBI NMIC CNIIS and Maxillofacial Surgery of the Ministry of Health of the Russian Federation, 'GKB named after M.E. Zhadkevich', K31, 'Medisans'",
          "Work experience – 15 years, over 300 operations annually"
        ]
      }
    },
    about: {
      exp: "12 years experience",
      degree: "PhD in Medicine",
      quote1: "“Plastic surgery is not just changing appearance, it is delicate work with self-perception. My task as a surgeon is not to reshape the face or body, but to reveal the potential that is already laid down by nature, removing the excess and emphasizing the main thing.”",
      quote2: "Each operation for me is a symbiosis of mathematical precision and artistic vision. We create a new version of you — confident, radiant, harmonious.",
      stats: {
        ops: "Successful Operations",
        safety: "Safety"
      },
      buttons: {
        diplomas: "Diplomas",
        more: "More about Dr. Mironova"
      }
    },
    operations: {
      title: "Plastic Surgery Services",
      subtitle: "Areas of Expertise",
      details: "Details",
      modal: {
        services: "My Services",
        prices: "Service Cost",
        why: "Why Choose Me?",
        cta: "Give yourself confidence in your own beauty. Sign up for a consultation today!",
        btn: "Calculate Procedure Cost"
      }
    },
    portfolio: {
      title: "Before & After Results",
      subtitle: "Real transformation stories. Results that speak louder than words.",
      all: "View All Works",
      filters: {
        all: "All Works",
        face: "Face",
        breast: "Breast",
        body: "Body"
      },
      sort: {
        label: "Sort by",
        newest: "Newest First",
        popular: "Popular"
      },
      labels: {
        before: "Before",
        after: "After"
      }
    },
    price: {
      title: "Surgery Costs",
      subtitle: "Investment in Yourself",
      disclaimer: "* Final cost is determined after consultation. The price includes: operation, anesthesia, hospital stay, compression garments.",
      buttons: {
        full: "Detailed Price List",
        calc: "Calculate Cost"
      },
      categories: {
        face: "Face",
        body_breast: "Body and Breast",
        body: "Body",
        breast: "Breast",
        extra: "Additional Services"
      }
    },
    footer: {
      brand_sub: "Sculpted Elegance",
      address: "Premium Aesthetic Medicine Clinic. Moscow, Presnenskaya nab., 12",
      menu: "Menu",
      patients: "For Patients",
      contacts: "Contacts",
      work_hours: "Mon-Sun: 10:00 - 21:00",
      callback: "Agreements & Payment",
      rights: "All rights reserved.",
      policy: "Privacy Policy",
      offer: "Offer Agreement",
      links: {
        faq: "FAQ",
        prep: "Preparation",
        rehab: "Rehabilitation"
      }
    },
    assistant: {
        start: "AI Assistant",
        connecting: "Connecting...",
        listening: "Listening...",
        speaking: "Speaking...",
        active_desc: "Dr. Mironova's Voice Assistant",
        stop: "Завершить диалог"
    }
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

  const accordionItems = [
    {
      id: "practice",
      title: t.doctor.sections.practice,
      content: (
        <div className="space-y-4">
          <p className="font-light text-[#5A6A7A] dark:text-[#94A3B8]">{t.doctor.content.practiceInit}</p>
          <ul className="space-y-2 list-disc pl-5 text-[#1A202C] dark:text-white">
            {t.doctor.content.practiceList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "education",
      title: t.doctor.sections.education,
      content: (
        <ul className="space-y-3 text-[#1A202C] dark:text-white">
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             ФГАОУ ВО РНИМУ им. Н. И. Пирогова Минздрава России (Москва)
           </li>
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             ФГБОУ ДПО РМАНПО Минздрава России (Москва)
           </li>
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             Villa Bella Clinic (Salò, Италия)
           </li>
        </ul>
      )
    },
    {
      id: "publications",
      title: t.doctor.sections.publications,
      content: (
        <ul className="space-y-3 text-[#1A202C] dark:text-white">
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             14-ый международный конкурс учёных WIMC (Варшава 2018 г.)
           </li>
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             24-ый международный конгресс EACMF (Мюнхен, 2018 г.)
           </li>
           <li className="flex gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-[#CFB997] mt-2 flex-shrink-0" />
             25-ый международный конгресс EACMF (Париж, 2020 г.)
           </li>
        </ul>
      )
    }
  ];

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

const usePriceData = () => {
  const { language } = useLanguage();
  return useMemo(() => {
    if (language === 'en') {
        return [
          {
            category: "Face",
            items: [
              { name: "SMAS Facelift", price: "800k ₽", note: "(face, chin, neck)" },
              { name: "Platysmaplasty", price: "200k ₽" },
              { name: "Brow Lift", price: "350k ₽", note: "temporal lift" },
              { name: "Endoscopic Forehead Lift", price: "450k ₽" },
              { name: "Check-lift", price: "350k ₽", note: "(mid-face lift)" },
              { name: "Lower Blepharoplasty", price: "250k ₽" },
              { name: "Lower Blepharoplasty", price: "200k ₽", note: "transconjunctival" },
              { name: "Upper Blepharoplasty", price: "200k ₽" },
              { name: "Bichat Fat Pad Removal", price: "150k ₽" },
              { name: "Bullhorn Lip Lift", price: "150k ₽" },
              { name: "Chin Liposuction", price: "150k ₽" },
              { name: "Periorbitoplasty", price: "550k ₽", note: "category 1" },
              { name: "Periorbitoplasty", price: "650k ₽", note: "category 2" },
            ]
          },
          {
            category: "Body",
            items: [
              { name: "Mini Abdominoplasty", price: "500k ₽" },
              { name: "Full Abdominoplasty", price: "650k ₽", note: "with diastasis repair and navel plasty" },
              { name: "Abdominal Liposuction", price: "450k ₽" },
              { name: "Flank Liposuction", price: "300k ₽" },
              { name: "Back Liposuction", price: "300k ₽" },
              { name: "Chin Liposuction", price: "150k ₽" },
              { name: "Inner Thigh Liposuction", price: "150k ₽" },
              { name: "Saddlebag Liposuction", price: "150k ₽" },
              { name: "Wither Liposuction", price: "150k ₽" },
              { name: "Arm Liposuction", price: "150k ₽" },
              { name: "Buttock Lipofilling", price: "350k ₽" },
              { name: "Brachioplasty", price: "650k ₽" },
            ]
          },
          {
            category: "Breast",
            items: [
              { name: "Primary Breast Augmentation", price: "550k ₽" },
              { name: "Implant", price: "108k ₽" },
              { name: "Implant", price: "140k ₽", note: "Mentor round Anatomy" },
              { name: "Implant", price: "130k ₽" },
              { name: "Implant", price: "158k ₽", note: "Silimed round Anatomy" },
              { name: "Breast Lift and Correction", price: "550k ₽", note: "without implants size 3-5" },
              { name: "Breast Lift and Correction", price: "650k ₽", note: "without implants size 6-9" },
              { name: "Breast Lift and Correction", price: "750k ₽", note: "without implants size 10-15" },
              { name: "Breast Lift and Correction", price: "from 750k ₽", note: "with implant augmentation" },
              { name: "Breast Re-endoprosthetics", price: "from 950k ₽", note: "(implant replacement) + lift" },
              { name: "Implant Removal", price: "500k ₽" },
              { name: "Implant Removal", price: "600-800k ₽" },
            ]
          },
          {
            category: "Additional Services",
            items: [
              { name: "Preoperative Tests Complex", price: "from 25k ₽" },
              { name: "Compression Garments", price: "5-15k ₽" },
              { name: "Single Room", price: "40k ₽", note: "(must be booked 2 months in advance)" },
              { name: "Anesthesia", price: "150k ₽", note: "+ Ward (24h) + Duty Doctor + ICU + Prescriptions + Dressings + Meals" },
            ]
          }
        ];
    }
    // Russian default
    return [
      {
        category: "Лицо",
        items: [
          { name: "SMAS подтяжка", price: "800 т.р.", note: "(лицо, подбородок, шея)" },
          { name: "Платизмапластика", price: "200 т.р." },
          { name: "Подтяжка бровей", price: "350 т.р.", note: "через висок (височный лифтинг)" },
          { name: "Эндоскопия лба", price: "450 т.р." },
          { name: "Чек-лифтинг", price: "350 т.р.", note: "(подтяжка средней трети лица)" },
          { name: "Нижняя блефаропластика", price: "250 т.р." },
          { name: "Нижняя блефаропластика", price: "200 т.р.", note: "трансконъюктивальная" },
          { name: "Верхняя блефаропластика", price: "200 т.р." },
          { name: "Удаления комков Биша", price: "150 т.р." },
          { name: "Буллхорн", price: "150 т.р." },
          { name: "Липосакция подбородка", price: "150 т.р." },
          { name: "Переорбитапластика", price: "550 т.р.", note: "1 категория" },
          { name: "Переорбитапластика", price: "650 т.р.", note: "2 категория" },
        ]
      },
      {
        category: "Тело",
        items: [
          { name: "Миниабдоминопластика", price: "500 т.р." },
          { name: "Полная Абдоминопластика", price: "650 т.р.", note: "с ушиванием диастаза и пластикой пупка" },
          { name: "Липосакции живота", price: "450 т.р." },
          { name: "Липосакции фланков", price: "300 т.р." },
          { name: "Липосакция Спины", price: "300 т.р." },
          { name: "Липосакция Подбородка", price: "150 т.р." },
          { name: "Липосакция внутренней части бедер", price: "150 т.р." },
          { name: "Липосакция Галифе", price: "150 т.р." },
          { name: "Липосакция Холки", price: "150 т.р." },
          { name: "Липосакция рук", price: "150 т.р." },
          { name: "Липофилинг ягодиц", price: "350 т.р." },
          { name: "Брахиопластика", price: "650 т.р." },
        ]
      },
      {
        category: "Грудь",
        items: [
          { name: "Первичное увеличения груди", price: "550 т.р." },
          { name: "Имплантат", price: "108 т.р." },
          { name: "Имплантат", price: "140 т.р.", note: "Mentor круглые Анатомия" },
          { name: "Имплантат", price: "130 т.р." },
          { name: "Имплантат", price: "158 т.р.", note: "silimed круглые Анатомия" },
          { name: "Подтяжка и коррекция груди", price: "550 т.р.", note: "без имплантов 3-5 размер" },
          { name: "Подтяжка и коррекция груди", price: "650 т.р.", note: "без имплантов 6-9 размер" },
          { name: "Подтяжка и коррекция груди", price: "750 т.р.", note: "без имплантов 10-15" },
          { name: "Подтяжка и коррекция груди", price: "от 750 т.р.", note: "с увеличением имплантами" },
          { name: "Реэндопротезирование груди", price: "от 950 т.р.", note: "(замена имплантов) + подтяжка" },
          { name: "Удаление имплантов", price: "500 т.р." },
          { name: "Удаление имплантов", price: "от 600 до 800 т.р." },
        ]
      },
      {
        category: "Дополнительные услуги",
        items: [
          { name: "Предоперационный комплекс анализов", price: "от 25 т.р." },
          { name: "Компрессионное белье", price: "от 5 до 15 т.р." },
          { name: "Однаместная палата", price: "40 т.р.", note: "(бронировать надо за 2 месяца до операции)" },
          { name: "Наркоз", price: "150 т.р.", note: "+ Палата сутки + Дежурный врач (анестезиолог-реаниматолог) + ПИТ + Назначения + Перевязки + Питание" },
        ]
      }
    ];
  }, [language]);
};

const FullPriceModal = ({ onClose }: { onClose: () => void }) => {
  const prices = usePriceData();
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
  const { t } = useLanguage();
  const { openBooking } = useBooking();
  const prices = usePriceData();
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

// --- Legal Modal & Tabs ---

const LegalModal = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { title: "Оферта: Организация лечения", icon: FileText },
    { title: "Оферта: Консультация", icon: FileText },
    { title: "Оферта: Организация очной консультации", icon: FileText },
    { title: "Оплата услуг", icon: CreditCard },
    { title: "Оказание услуг", icon: Truck },
    { title: "Соглашение на обработку персональных данных", icon: ShieldAlert },
    { title: "Отмена и возврат", icon: Undo2 }
  ];

  const OfferTemplate = ({ serviceName, price, terms }: { serviceName: string, price: string, terms: React.ReactNode }) => (
    <div className="space-y-6 text-sm text-[#1A202C] dark:text-white leading-relaxed font-sans">
        <h1 className="text-2xl font-serif text-center mb-6">Счет-оферта</h1>

        {/* Bank Details Table */}
        <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-300 text-[10px] md:text-xs bg-white dark:bg-[#151E32]">
                <tbody>
                    <tr>
                        <td colSpan={2} rowSpan={2} className="border border-gray-300 p-2 align-top">Банк получателя: ___________________________</td>
                        <td className="border border-gray-300 p-2">БИК</td>
                        <td className="border border-gray-300 p-2">________________</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-2">К/с банка</td>
                        <td className="border border-gray-300 p-2">________________</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 p-2">ИНН 772794015348</td>
                        <td className="border border-gray-300 p-2">Счет получателя</td>
                        <td colSpan={2} className="border border-gray-300 p-2">________________</td>
                    </tr>
                    <tr>
                        <td colSpan={4} className="border border-gray-300 p-2">Получатель: ИП Миронова Елена Александровна</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div className="mb-4 text-xs">
            <p className="mb-2"><strong>Исполнитель:</strong> Индивидуальный предприниматель Миронова Елена Александровна (ОГРНИП 325774600642997)</p>
            <p><strong>Заказчик/Потребитель:</strong> Настоящий счет-оферта в соответствии с положениями ст. 435 ГК РФ является офертой и адресован любому лицу, являющемуся резидентом РФ, которое акцептует ее условия.</p>
        </div>

        <p className="text-xs">В соответствии с настоящим Счетом-офертой Исполнитель обязуется предоставить Заказчику услуги, а Заказчик/Потребитель принять и оплатить их:</p>

        {/* Service Table */}
        <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-gray-300 text-[10px] md:text-xs bg-white dark:bg-[#151E32]">
                <thead>
                    <tr className="bg-gray-50 dark:bg-white/5">
                        <th className="border border-gray-300 p-2 text-left font-bold">N п/п</th>
                        <th className="border border-gray-300 p-2 text-left font-bold">Наименование услуги</th>
                        <th className="border border-gray-300 p-2 text-left font-bold">Кол-во</th>
                        <th className="border border-gray-300 p-2 text-left font-bold">Ед.</th>
                        <th className="border border-gray-300 p-2 text-left font-bold">Цена, руб.</th>
                        <th className="border border-gray-300 p-2 text-left font-bold">Стоимость, руб.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2">{serviceName}</td>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2">шт.</td>
                        <td className="border border-gray-300 p-2">{price}</td>
                        <td className="border border-gray-300 p-2">{price}</td>
                    </tr>
                    <tr>
                        <td colSpan={5} className="border border-gray-300 p-2 text-right font-bold">Итого:</td>
                        <td className="border border-gray-300 p-2 font-bold">{price}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p className="font-bold text-sm mb-6">Итого к оплате: {price} рублей 00 копеек.</p>

        <div className="text-xs space-y-3 opacity-90 leading-relaxed">
            {terms}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-wrap justify-between gap-8 text-xs">
            <div className="w-full md:w-[45%]">
                <p><strong>Сведения об Исполнителе:</strong><br/>
                Индивидуальный предприниматель<br/>
                Миронова Елена Александровна<br/>
                ОГРНИП 325774600642997<br/>
                ИНН 772794015348<br/>
                e-mail: doc-mironova.ru@yandex.ru<br/>
                Тел.: +7 985-728-51-02</p>
            </div>
            <div className="w-full md:w-[45%]">
                <p><strong>Банковские реквизиты:</strong><br/>
                Получатель: ИП Миронова Е.А.<br/>
                р/с ___________________________<br/>
                к/с ___________________________<br/>
                ИНН __________________________<br/>
                БИК __________________________</p>
            </div>
        </div>
        
        <div className="mt-8 font-bold border-t border-dashed border-gray-300 pt-4 inline-block pr-20">
            ИП Миронова Е.А.
        </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 0: return (
        <OfferTemplate 
            serviceName="Сервисно-информационное обслуживание Заказчика по организации хирургического лечения Заказчика в медицинской организации"
            price="50 000,00"
            terms={
                <>
                    <p>В рамках оказания Услуг Исполнитель обязуется предоставить Заказчику/Потребителю информацию о возможности и порядке записи на операцию, объеме догоспитальных исследований и особенностях подготовки и послеоперационного периода, ответить на вопросы о существующих в научной и клинической литературе методах обследования и лечения, забронировать дату и время операционной для оказания медицинской помощи Заказчику/ Потребителю, при необходимости разрешить вопрос о привлечении дополнительного медицинского персонала.</p>
                    <p>Оплатой настоящего Счета-оферты Заказчик/Потребитель подтверждает, что Исполнитель уведомил его о том, что на внесенную им сумму денежных средств Исполнитель, в том числе, закупает расходный материал, необходимый для выполнения показанной и согласованной операции, и выполняет иные действия для последующего оказания Заказчику/ Потребителю медицинских услуг.</p>
                    <p>К фактически понесенным расходам Исполнителя относятся, включая, но не ограничиваясь: приобретение изделий медицинского назначения, расходного материала (медикаментов, компрессионного белья, компрессионных чулок и др.), бронирование операционной и палаты, привлечение специалистов, заказ питания и т.д. в целях оказания медицинских услуг Заказчику/Потребителю.</p>
                    <p>Оплатой настоящего Счета-оферты Заказчик/Потребитель подтверждает свою осведомленность и согласен с тем, что:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Уплаченная Заказчиком/Потребителем денежная сумма засчитывается в счет понесенных Исполнителем расходов, ввиду чего не подлежит возврату в случае отказа Заказчика/Потребителя от получения услуг в соответствии со ст. 782 ГК РФ.</li>
                        <li>Исполнитель уведомил Заказчика/Потребителя о том, что в случае, если фактически понесенные Исполнителем расходы превышают сумму внесенных им денежных средств, Исполнитель не взыскивает какую-либо доплату.</li>
                        <li>Заказчик/Потребитель разрешает Исполнителю получать доступ к сведениям, составляющим врачебную тайну, и персональным данным, без которых невозможно последующее оказание медицинских услуг.</li>
                    </ul>
                    <p>В соответствии с п. 3 ст. 438 ГК РФ настоящий Счет-оферта считается заключенным, если Заказчик/Потребитель в полном объеме произведет оплату в срок до 5 (пяти) дней сумму, указанную в таблице, по реквизитам расчетного счета Исполнителя.</p>
                    <p>Оплатой настоящего Счета-оферты Заказчик/Потребитель подтверждает, что согласен со всеми его условиями.</p>
                    <p>Заказчик/Потребитель соглашается, что возврат денежных средств возможен <strong>ИСКЛЮЧИТЕЛЬНО</strong> в следующих случаях:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>состояние здоровья Потребителя не позволяет выполнить операцию в срок более, чем 6 месяцев;</li>
                        <li>Исполнитель отказывается от обязанностей лечащего врача медицинской организации, с которой будет заключен договор, в связи с неустановившимся терапевтическим сотрудничеством.</li>
                    </ul>
                    <p>Исполнитель уведомил Заказчика/Потребителя о том, что срок возврата денежных средств в указанных случаях составляет 10 (десять) календарных дней.</p>
                    <p>Заказчик/Потребитель осведомлен, что оказание медицинских услуг регулируется отдельным договором с медицинской организацией, который заключается в день госпитализации.</p>
                </>
            }
        />
      );
      case 1: return (
        <OfferTemplate 
            serviceName="Сервисно-информационная консультация перед началом получения медицинской помощи в медицинской организации («Услуга»)"
            price="5 000,00"
            terms={
                <>
                    <p>Исполнитель в порядке и на условиях, предусмотренных настоящим Счетом-офертой, оказывает Заказчику Услуги, а Заказчик обязуется оплатить эти Услуги в порядке, сроки и на условиях, предусмотренных настоящим Счетом-офертой.</p>
                    <p>В рамках консультации Исполнитель обязуется предоставить Заказчику информацию о возможности записи на консультацию врача в клинику с согласованием даты и времени, предоставить ему информацию об объемах догоспитальных исследований и особенностях послеоперационного периода, ответить на вопросы о существующих в научной и клинической литературе методах обследования и лечения.</p>
                    <p>Стороны подтверждают, что данная консультация не является медицинской услугой.</p>
                    <p>Заказчик уведомлен о том, что консультация в рамках настоящего Счета-оферты не является обязательным условием для начала лечения, заказчик имеет возможность заключить договор с медицинской организацией самостоятельно.</p>
                    <p>Оплатой настоящего Счета-оферты Заказчик подтверждает, что разрешает Исполнителю получать доступ к сведениям, составляющим его врачебную тайну.</p>
                    <p>Стороны договорились, что в связи с оказанием услуг посредством телекоммуникации, сканы всех документов приравниваются по силе к оригиналам, а электронная почта и мессенджеры (WhatsApp, Telegram и т.д.) являются надлежащими каналами связи. Акцептируя настоящий Счет-оферту, Заказчик берет на себя ответственность за сохранение врачебной тайны при переписке путем использования электронной почты и мессенджеров.</p>
                    <p>Вся предоставляемая сторонами друг другу информация является конфиденциальной.</p>
                    <p>Услуги оказываются Исполнителем дистанционно через сеть Интернет и/или очно.</p>
                    <p>Услуги, оказываемые по настоящему Счету-оферте, оплачиваются в размере 100% предоплаты.</p>
                    <p>Исполнитель оказывает Услуги после получения от Заказчика заявки и предоплаты. Заявка оформляется по телефону Исполнителя: +7 985-728-51-02 либо на Сайте Исполнителя https://doc-mironova.ru.</p>
                    <p>Исполнитель обязуется оказать Заказчику Услуги в срок, не превышающий 30 (тридцати) календарных дней со дня получения от Заказчика полной оплаты по настоящему Счетом-оферте. Исполнитель вправе выполнить свои обязательства досрочно.</p>
                    <p>Настоящий Счет-оферта имеет силу акта об оказании услуг. Приемка производится без подписания соответствующего акта.</p>
                    <p>Оплатой настоящего Счета-оферты Заказчик/Потребитель подтверждает свою осведомленность и согласен с тем, что:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Уплаченная денежная сумма засчитывается в счет понесенных Исполнителем расходов, ввиду чего не подлежит возврату в случае отказа Заказчика от получения услуг (ст. 782 ГК РФ).</li>
                        <li>Если фактически понесенные расходы превышают сумму внесенных средств, Исполнитель не взыскивает доплату.</li>
                    </ul>
                    <p>В соответствии с п. 3 ст. 438 ГК РФ настоящий Счет-оферта считается заключенным, если Заказчик произведет оплату суммы в полном объеме.</p>
                    <p>Заказчик/Потребитель осведомлен, что оказание медицинских услуг регулируется отдельным договором с медицинской организацией, который заключается в день госпитализации.</p>
                </>
            }
        />
      );
      case 2: return (
        <OfferTemplate 
            serviceName="Сервисно-информационная консультация перед началом получения медицинской помощи в медицинской организации («Услуга»)"
            price="5 000,00"
            terms={
                <>
                    <p>Исполнитель в порядке и на условиях, предусмотренных настоящим Счетом-офертой, оказывает Заказчику Услуги, а Заказчик обязуется оплатить эти Услуги в порядке, сроки и на условиях, предусмотренных настоящим Счетом-офертой.</p>
                    <p>В рамках консультации Исполнитель обязуется предоставить Заказчику информацию о возможности записи на консультацию врача в клинику с согласованием даты и времени, предоставить ему информацию об объемах догоспитальных исследований и особенностях послеоперационного периода, ответить на вопросы о существующих в научной и клинической литературе методах обследования и лечения.</p>
                    <p>Стороны подтверждают, что данная консультация не является медицинской услугой.</p>
                    <p>Заказчик уведомлен о том, что консультация в рамках настоящего Счета-оферты не является обязательным условием для начала лечения, заказчик имеет возможность заключить договор с медицинской организацией самостоятельно.</p>
                    <p>Оплатой настоящего Счета-оферты Заказчик подтверждает, что разрешает Исполнителю получать доступ к сведениям, составляющим его врачебную тайну.</p>
                    <p>Стороны договорились, что в связи с оказанием услуг посредством телекоммуникации, сканы всех документов приравниваются по силе к оригиналам, а электронная почта и мессенджеры (WhatsApp, Telegram и т.д.) являются надлежащими каналами связи. Акцептируя настоящий Счет-оферту, Заказчик берет на себя ответственность за сохранение врачебной тайны при переписке путем использования электронной почты и мессенджеров.</p>
                    <p>Вся предоставляемая сторонами друг другу информация является конфиденциальной.</p>
                    <p>Услуги оказываются Исполнителем дистанционно через сеть Интернет и/или очно.</p>
                    <p>Услуги, оказываемые по настоящему Счету-оферте, оплачиваются в размере 100% предоплаты.</p>
                    <p>Исполнитель оказывает Услуги после получения от Заказчика заявки и предоплаты. Заявка оформляется по телефону Исполнителя: +7 985-728-51-02 либо на Сайте Исполнителя https://doc-mironova.ru.</p>
                    <p>Исполнитель обязуется оказать Заказчику Услуги в срок, не превышающий 30 (тридцати) календарных дней со дня получения от Заказчика полной оплаты по настоящему Счетом-оферте. Исполнитель вправе выполнить свои обязательства досрочно.</p>
                    <p>Настоящий Счет-оферта имеет силу акта об оказании услуг. Приемка производится без подписания соответствующего акта.</p>
                    <p>Оплатой настоящего Счета-оферты Заказчик/Потребитель подтверждает свою осведомленность и согласен с тем, что:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Уплаченная денежная сумма засчитывается в счет понесенных Исполнителем расходов, ввиду чего не подлежит возврату в случае отказа Заказчика от получения услуг (ст. 782 ГК РФ).</li>
                        <li>Если фактически понесенные расходы превышают сумму внесенных средств, Исполнитель не взыскивает доплату.</li>
                    </ul>
                    <p>В соответствии с п. 3 ст. 438 ГК РФ настоящий Счет-оферта считается заключенным, если Заказчик произведет оплату суммы в полном объеме.</p>
                    <p>Заказчик/Потребитель осведомлен, что оказание медицинских услуг регулируется отдельным договором с медицинской организацией, который заключается в день госпитализации.</p>
                </>
            }
        />
      );
      case 3: return (
        <div className="space-y-6 text-sm text-[#1A202C] dark:text-white">
            <h2 className="text-2xl font-serif mb-4 text-[#006E77] dark:text-[#80DED9]">Оплата услуг</h2>
            <p>Для вашего удобства мы поддерживаем современные способы онлайн-оплаты. Принимаются карты систем:</p>
            <div className="flex gap-6 items-center my-6">
                <span className="text-2xl font-bold text-[#1a1f71]">VISA</span>
                <span className="text-2xl font-bold text-[#eb001b]">MasterCard</span>
                <span className="text-2xl font-bold text-[#00b140]">МИР</span>
            </div>
            <p>Процесс оплаты максимально прост: при оформлении заказа на сайте вы будете перенаправлены на защищенную платёжную страницу банка для ввода данных карты:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Номер карты (16 цифр);</li>
                <li>Срок действия (месяц/год);</li>
                <li>Код безопасности CVC2/CVV2.</li>
            </ul>
            <p>Безопасность транзакций обеспечивается технологией <strong>3D-Secure</strong> (подтверждение через СМС-код от вашего банка).</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mt-4">
                <strong>Безопасность:</strong> Все платежи обрабатываются через защищенный шлюз по международному стандарту PCI DSS. Данные передаются в зашифрованном виде (SSL) и не сохраняются на нашем сервере.
            </div>
        </div>
      );
      case 4: return (
        <div className="space-y-6 text-sm text-[#1A202C] dark:text-white">
            <h2 className="text-2xl font-serif mb-4 text-[#006E77] dark:text-[#80DED9]">Формат и сроки оказания услуг</h2>
            <p>ИП Миронова Е.А. предоставляет сервисно-информационное обслуживание. Физическая доставка товаров не предусмотрена.</p>
            <ul className="list-disc pl-5 space-y-3">
                <li><strong>Дистанционно:</strong> Консультации проводятся онлайн (Zoom, WhatsApp, Telegram, Телефон) для жителей всех регионов РФ.</li>
                <li><strong>Очно:</strong> По предварительной записи в партнерских клиниках г. Москвы.</li>
                <li><strong>Сроки:</strong> Информационная поддержка и организация записи осуществляются в течение времени, указанного в вашем Счете-оферте (обычно до 30 дней).</li>
            </ul>
        </div>
      );
      case 5: return (
        <div className="space-y-6 text-sm text-[#1A202C] dark:text-white">
            <h2 className="text-2xl font-serif mb-4 text-[#006E77] dark:text-[#80DED9]">Персональные данные</h2>
            <p>Мы соблюдаем <strong>ФЗ-152 «О персональных данных»</strong>. Ваши данные (ФИО, контакты, история обращений) используются только для качественного оказания услуг и не передаются третьим лицам без вашего согласия.</p>
            <p>На сайте используются файлы <strong>cookies</strong> для анализа посещаемости и улучшения интерфейса. Оставаясь на сайте, вы соглашаетесь с нашей политикой конфиденциальности.</p>
        </div>
      );
      case 6: return (
        <div className="space-y-6 text-sm text-[#1A202C] dark:text-white">
            <h2 className="text-2xl font-serif mb-4 text-[#006E77] dark:text-[#80DED9]">Отмена и возврат</h2>
            <p>Мы работаем строго в рамках законодательства РФ (Закон «О защите прав потребителей»):</p>
            <ul className="list-disc pl-5 space-y-3">
                <li>Вы вправе отказаться от услуг в любое время, возместив Исполнителю фактически понесенные расходы (бронирование времени, закупка материалов, если это предусмотрено офертой).</li>
                <li>В случае обоснованных претензий к качеству мы обязуемся устранить недостатки в кратчайшие сроки.</li>
            </ul>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mt-6">
                <strong>Порядок возврата:</strong> Денежные средства возвращаются на ту же банковскую карту, с которой производилась оплата. Срок зачисления средств составляет от 1 до 30 рабочих дней (зависит от вашего банка).
            </div>
        </div>
      );
      default: return null;
    }
  };

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-0 md:p-6"
    >
      <div className="absolute inset-0" onClick={onClose}></div>
      <motion.div 
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.95 }}
        transition={PREMIUM_TRANSITION}
        className="bg-white dark:bg-[#151E32] w-full max-w-6xl h-full md:h-[90vh] md:rounded-xl shadow-2xl relative flex flex-col md:flex-row overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 md:hidden z-50 p-2 bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-black" />
        </button>

        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-gray-50 dark:bg-[#0B1121] border-r border-gray-200 dark:border-white/10 flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 hidden md:block">
                <h3 className="font-serif text-lg text-[#006E77] dark:text-[#80DED9]">Документация</h3>
                <p className="text-xs text-gray-500 mt-1">Официальная информация</p>
            </div>
            
            {/* Scrollable tabs list */}
            <div className="flex-1 overflow-x-auto md:overflow-y-auto flex md:flex-col p-2 gap-1">
                {tabs.map((tab, idx) => {
                    const Icon = tab.icon;
                    return (
                        <button 
                            key={idx}
                            onClick={() => setActiveTab(idx)}
                            className={`flex items-center gap-3 p-3 text-left rounded-lg transition-all text-xs md:text-sm whitespace-nowrap md:whitespace-normal
                                ${activeTab === idx 
                                    ? 'bg-white dark:bg-white/10 shadow-sm text-[#006E77] dark:text-[#80DED9] font-medium border border-gray-200 dark:border-transparent' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                        >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${activeTab === idx ? 'text-[#CFB997]' : 'opacity-50'}`} />
                            <span>{tab.title}</span>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#151E32]">
            <button onClick={onClose} className="absolute top-6 right-6 hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-[#1A202C] dark:text-white" />
            </button>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-12">
                {renderContent()}
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Navbar Component ---

const Navbar = () => {
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const { openBooking } = useBooking();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 50);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const navLinks = [
      { href: '#operations', label: t.nav.operations },
      { href: '#portfolio', label: t.nav.portfolio },
      { href: '#price', label: t.nav.prices },
      { href: '#about', label: t.nav.about },
      { href: '#contacts', label: t.nav.contacts },
    ];
  
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-[#151E32]/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1800px] mx-auto px-6 flex items-center justify-between">
          <a href="#" className="text-2xl font-serif font-bold text-[#1A202C] dark:text-white">Dr. Mironova</a>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="text-sm uppercase tracking-widest text-[#1A202C] dark:text-white hover:text-[#006E77] dark:hover:text-[#80DED9] transition-colors">{link.label}</a>
            ))}
          </div>
  
          <div className="hidden md:flex items-center gap-6">
             <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-[#1A202C] dark:text-white transition-colors">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </button>
             <button onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')} className="text-sm font-medium uppercase text-[#1A202C] dark:text-white hover:text-[#006E77] dark:hover:text-[#80DED9] transition-colors">
                {language}
             </button>
             <GoldButton onClick={openBooking}>{t.nav.book}</GoldButton>
          </div>
  
          <button className="md:hidden text-[#1A202C] dark:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
  
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
              <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden bg-white dark:bg-[#151E32] border-t border-gray-100 dark:border-white/10 overflow-hidden"
              >
                  <div className="flex flex-col p-6 gap-4">
                      {navLinks.map(link => (
                          <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-[#1A202C] dark:text-white py-2">{link.label}</a>
                      ))}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-[#1A202C] dark:text-white">
                              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                          </button>
                          <button onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')} className="text-sm font-bold uppercase text-[#1A202C] dark:text-white p-2 border border-gray-200 dark:border-white/20 rounded-md">
                              {language}
                          </button>
                      </div>
                      <GoldButton onClick={() => { setMobileMenuOpen(false); openBooking(); }} className="w-full justify-center mt-2">{t.nav.book}</GoldButton>
                  </div>
              </motion.div>
          )}
        </AnimatePresence>
      </nav>
    );
  }
  
// --- Hero Component ---

const Hero = () => {
    const { t } = useLanguage();
    const { openBooking } = useBooking();
    const lenis = useSmoothScroll();

    return (
        <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <picture>
                    <source media="(max-width: 768px)" srcSet="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/emir-mob-7.jpg" />
                    <img 
                        src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/emir-hd-7-1.jpg" 
                        alt="Dr. Elena Mironova" 
                        className="w-full h-full object-cover object-top md:object-center" 
                    />
                </picture>
                <div className="absolute inset-0 bg-white/10 dark:bg-black/20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent dark:from-[#0B1121] dark:via-[#0B1121]/80 dark:to-transparent/20"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                >
                    <span className="inline-block py-1 px-3 border border-[#006E77] text-[#006E77] dark:border-[#80DED9] dark:text-[#80DED9] text-xs uppercase tracking-[0.2em] mb-6 rounded-full bg-white/50 dark:bg-[#0B1121]/50 backdrop-blur-sm">
                        {t.hero.tag}
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-tight text-[#1A202C] dark:text-white mb-8 drop-shadow-sm">
                        <span className="block">{t.hero.title1}</span>
                        <span className="block italic text-[#CFB997]">{t.hero.title2}</span>
                        <span className="block">{t.hero.title3}</span>
                    </h1>
                    <p className="text-lg text-[#5A6A7A] dark:text-[#CBD5E1] max-w-md mb-10 leading-relaxed font-medium">
                        {t.hero.desc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <GoldButton onClick={openBooking}>{t.hero.cost}</GoldButton>
                        <GoldButton variant="outline" onClick={() => lenis ? lenis.scrollTo('#portfolio') : document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}>
                            {t.hero.portfolio}
                        </GoldButton>
                    </div>
                </motion.div>
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#1A202C] dark:text-white"
            >
                <span className="text-[10px] uppercase tracking-widest opacity-60">{t.hero.scroll}</span>
                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <ChevronDown className="w-5 h-5 opacity-60" />
                </motion.div>
            </motion.div>
        </section>
    );
}

// --- Operations Component ---

const Operations = () => {
    const { t } = useLanguage();
    const [modalData, setModalData] = useState<any | null>(null);

    const operationsData = [
        {
            id: 'face',
            title: t.booking.ops.face,
            image: 'https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/serv_icon_3-e1737163706465.jpg',
            intro: t.about.quote2, 
            services: [
                { title: "SMAS Facelift", desc: "Comprehensive face and neck lift." },
                { title: "Blepharoplasty", desc: "Eyelid correction." }
            ],
            prices: [{ name: "SMAS Facelift", price: "from 800k ₽" }],
            benefits: [t.about.stats.safety, t.about.stats.ops]
        },
        {
            id: 'breast',
            title: t.booking.ops.breast,
            image: 'https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/serv_icon_4.jpg',
            intro: t.about.quote2,
            services: [
                    { title: "Augmentation", desc: "Implants or fat transfer." },
                    { title: "Lift", desc: "Mastopexy." }
            ],
            prices: [{ name: "Augmentation", price: "from 550k ₽" }],
            benefits: [t.about.stats.safety]
        },
        {
            id: 'body',
            title: t.booking.ops.body,
            image: 'https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/serv_icon_1-e1737165789945.jpg',
            intro: t.about.quote2,
            services: [
                { title: "Liposuction", desc: "Body contouring." },
                { title: "Abdominoplasty", desc: "Tummy tuck." }
            ],
            prices: [{ name: "Liposuction", price: "from 150k ₽" }],
            benefits: [t.about.stats.safety]
        }
    ];

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

    const portfolioItems = useMemo(() => {
        const generate = (cat: 'face' | 'breast' | 'body', path: string, prefix: string, count: number) => 
            Array.from({length: count}, (_, i) => ({
                category: cat,
                src: `https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/portfolio/${path}/${prefix}-${String(i+1).padStart(2, '0')}.webp`
            }));
        
        return [
            ...generate('face', 'lico', 'lico', 16),
            ...generate('breast', 'grud', 'grud', 16),
            ...generate('body', 'telo', 'telo', 17)
        ];
    }, []);

    const filteredItems = useMemo(() => {
        if (filter === 'all') return portfolioItems;
        return portfolioItems.filter(item => item.category === filter);
    }, [filter, portfolioItems]);
    
    // Calculate global index for lightbox when filtered
    const getGlobalIndex = (localIndex: number) => {
        if (filter === 'all') return localIndex;
        // Find the index in the full list that matches the item in the filtered list
        const item = filteredItems[localIndex];
        return portfolioItems.indexOf(item);
    };

    // When filter changes, reset lightbox index visual expectation if needed, 
    // but here we just open lightbox with correct global index map.
    
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
                                onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                            >
                                <img 
                                    src={item.src} 
                                    alt={`Result ${item.category}`} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    loading="lazy" 
                                />
                                <div className="absolute inset-0 bg-[#006E77]/0 group-hover:bg-[#006E77]/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                        <Plus className="w-6 h-6 text-[#006E77]" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                
                <div className="text-center">
                   <p className="text-xs text-gray-400 dark:text-gray-600 mb-4 uppercase tracking-widest">
                       {filteredItems.length} {filter === 'all' ? 'Всего' : 'в категории'}
                   </p>
                </div>
            </div>
            <AnimatePresence>
                {lightboxOpen && (
                    <Lightbox 
                        images={lightboxImages} 
                        initialIndex={lightboxIndex} 
                        onClose={() => setLightboxOpen(false)} 
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

// --- About Component ---

const About = () => {
    const { t } = useLanguage();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <section id="about" className="py-32 bg-white dark:bg-[#151E32] overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-16">
                        <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                        >
                            <div className="relative">
                                <img src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/emir-mob-9.jpg" alt="Dr. Mironova" className="w-full max-w-md mx-auto shadow-2xl" loading="lazy" />
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#F8F9F9] dark:bg-[#0B1121] -z-10 rounded-full blur-3xl opacity-50"></div>
                            </div>
                        </motion.div>
                        <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                        >
                        <SectionTitle align="left" subtitle={t.doctor.tag}>{t.doctor.name}</SectionTitle>
                        <h3 className="text-xl text-[#006E77] dark:text-[#80DED9] mb-6">{t.doctor.title}</h3>
                        <p className="text-lg italic text-[#5A6A7A] dark:text-[#94A3B8] mb-8 border-l-4 border-[#CFB997] pl-6 py-2">
                            {t.about.quote1}
                        </p>
                        <div className="flex gap-8 mb-10">
                            <div>
                                <p className="text-4xl font-serif text-[#1A202C] dark:text-white mb-1">15+</p>
                                <p className="text-xs uppercase tracking-widest text-[#718096] dark:text-[#94A3B8]">{t.about.exp}</p>
                            </div>
                            <div>
                                <p className="text-4xl font-serif text-[#1A202C] dark:text-white mb-1">3000+</p>
                                <p className="text-xs uppercase tracking-widest text-[#718096] dark:text-[#94A3B8]">{t.about.stats.ops}</p>
                            </div>
                        </div>
                        <GoldButton onClick={() => setModalOpen(true)}>{t.about.buttons.more}</GoldButton>
                        </motion.div>
                </div>
            </div>
            <AnimatePresence>
                {modalOpen && <DoctorInfoModal onClose={() => setModalOpen(false)} />}
            </AnimatePresence>
        </section>
    );
}

// --- Footer Section ---

const Footer = () => {
  const { t } = useLanguage();
  const [legalModalOpen, setLegalModalOpen] = useState(false);

  return (
    <>
    <footer id="contacts" className="bg-[#1A202C] text-white py-20 border-t border-white/5">
       <div className="max-w-[1800px] mx-auto px-6 grid md:grid-cols-4 gap-12">
         <div>
           <h3 className="text-2xl font-serif mb-6 tracking-wide">Dr. Mironova</h3>
           <p className="text-gray-400 text-sm mb-6 font-light">{t.footer.address}</p>
           <div className="flex gap-4">
             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
               <Instagram className="w-5 h-5 text-white/80" />
             </a>
             <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
               <Youtube className="w-5 h-5 text-white/80" />
             </a>
           </div>
         </div>
         
         <div>
           <h4 className="uppercase tracking-widest text-xs font-bold mb-8 text-[#CFB997]">{t.footer.menu}</h4>
           <ul className="space-y-4 text-gray-400 text-sm font-light">
              <li><a href="#operations" className="hover:text-white transition-colors">{t.nav.operations}</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">{t.nav.portfolio}</a></li>
              <li><a href="#price" className="hover:text-white transition-colors">{t.nav.prices}</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">{t.nav.about}</a></li>
           </ul>
         </div>
         
         <div>
           <h4 className="uppercase tracking-widest text-xs font-bold mb-8 text-[#CFB997]">{t.footer.contacts}</h4>
           <ul className="space-y-4 text-gray-400 text-sm font-light">
              <li className="flex items-center gap-3"><Phone className="w-4 h-4" /> +7 (999) 000-00-00</li>
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4" /> Москва, Пресненская наб., 12</li>
              <li className="flex items-center gap-3"><Clock className="w-4 h-4" /> {t.footer.work_hours}</li>
           </ul>
         </div>
         
         <div>
            <button 
                onClick={() => setLegalModalOpen(true)}
                className="w-full py-4 border border-white/20 hover:bg-white hover:text-[#1A202C] transition-all text-xs uppercase tracking-widest font-medium"
            >
              {t.footer.callback}
            </button>
         </div>
       </div>
       
       <div className="max-w-[1800px] mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between text-xs text-gray-500 font-light">
         <span>© 2024 Dr. Elena Mironova. {t.footer.rights}</span>
         <div className="flex gap-8 mt-4 md:mt-0">
           <button 
             onClick={() => setLegalModalOpen(true)}
             className="hover:text-white transition-colors border-b border-transparent hover:border-white/50 pb-0.5"
           >
             Соглашения и оплата
           </button>
         </div>
       </div>
    </footer>
    <AnimatePresence>
      {legalModalOpen && <LegalModal onClose={() => setLegalModalOpen(false)} />}
    </AnimatePresence>
    </>
  )
};

// --- Preloader Component ---

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#Fdfbf7]"
    >
      <div 
        className="absolute inset-0 z-0 opacity-100"
        style={{
            backgroundImage: 'url(https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/texture-papper.jpg)',
            backgroundSize: 'auto 100%',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'center'
        }}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10"
      >
        <img 
            src="https://storage.googleapis.com/uspeshnyy-projects/doc-mironova.ru/logo-gold.png" 
            alt="Dr. Mironova" 
            className="w-[240px] md:w-[320px] h-auto object-contain drop-shadow-sm" 
        />
      </motion.div>
    </motion.div>
  );
};

// --- App Root ---

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [language, setLanguageState] = useState<Language>('ru');
  const [theme, setTheme] = useState<Theme>('light');
  const [lenis, setLenis] = useState<any>(null);

  useEffect(() => {
      const lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });
  
      setLenis(lenisInstance);
  
      function raf(time: number) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
  
      requestAnimationFrame(raf);
  
      // Intercept anchor clicks
      const handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a');
        const href = anchor?.getAttribute('href');
        
        if (anchor && href?.startsWith('#') && href.length > 1) {
          e.preventDefault();
          try {
              const element = document.querySelector(href);
              if (element) {
                  lenisInstance.scrollTo(element as HTMLElement);
              }
          } catch(e) {}
        }
      };
  
      document.addEventListener('click', handleAnchorClick);
  
      return () => {
        lenisInstance.destroy();
        document.removeEventListener('click', handleAnchorClick);
      };
  }, []);

  // Load language from system
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const systemLang = navigator.language || (navigator as any).userLanguage;
      if (systemLang && systemLang.startsWith('en')) {
        setLanguageState('en');
      }
    }
  }, []);

  // Theme Logic
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const openBooking = useCallback(() => setIsBookingOpen(true), []);
  const closeBooking = useCallback(() => setIsBookingOpen(false), []);

  const contextValue = useMemo(() => ({
    language,
    setLanguage: setLanguageState,
    t: TRANSLATIONS[language]
  }), [language]);

  // SEO Hook Integration
  const SeoComponent = () => {
      useScrollTitle();
      return null;
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LanguageContext.Provider value={contextValue}>
        <SmoothScrollContext.Provider value={lenis}>
            <SeoComponent />
            <BookingContext.Provider value={{ isBookingOpen, openBooking, closeBooking }}>
              <AnimatePresence>
                 {loading && <Preloader onComplete={() => setLoading(false)} />}
              </AnimatePresence>
              
              <div className={loading ? 'h-screen overflow-hidden' : ''}>
                <CustomCursor />
                <Navbar />
                <main>
                  <Hero />
                  <Operations />
                  <Portfolio />
                  <PriceList />
                  <About />
                </main>
                <Footer />
                <BookingPanel />
                <VoiceAssistant />
              </div>
            </BookingContext.Provider>
        </SmoothScrollContext.Provider>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);