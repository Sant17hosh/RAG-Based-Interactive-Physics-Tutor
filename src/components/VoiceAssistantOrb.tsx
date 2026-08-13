import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Search, Volume2, VolumeX, Sparkles, Navigation, 
  HelpCircle, Send, Languages, RefreshCw, Layers, BrainCircuit, Play, History, X, Square
} from 'lucide-react';
import { CHANNELS_PUC_DATA } from '../ncertData';

interface VoiceAssistantOrbProps {
  onNavigate: (tab: string) => void;
  activeTab: string;
  onAddScore: (points: number) => void;
  layoutMode?: 'full' | 'floating';
}

interface TranscriptItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  translatedText?: string;
  timestamp: string;
  language: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English (India)', native: 'English', greeting: "Welcome to your PUC Physics AI Assistant. How can I help you today?", promptSuffix: "Explain in standard English. Maintain CBSE/state-board academic nomenclature." },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', native: 'ಕನ್ನಡ', greeting: "ನಿಮ್ಮ ಪಿಯುಸಿ ಭೌತಶಾಸ್ತ್ರ ಎಐ ಸಹಾಯಕಕ್ಕೆ ಸುಸ್ವಾಗತ. ನಾನು ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?", promptSuffix: "Explain fully in Kannada language. Translate physics terms to understandable Kannada context, but keep important English terms in brackets. Write in native Kannada script." },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', native: 'हिन्दी', greeting: "आपके पीयूसी भौतिकी एआई सहायक में आपका स्वागत है। आज मैं आपकी क्या मदद कर सकता हूँ?", promptSuffix: "Explain fully in Hindi language. Use high-quality educational Hindi script and write physics equations clearly." },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)', native: 'தமிழ்', greeting: "உங்கள் பியூசி இயற்பியல் ஏஐ உதவிக்கு வரவேற்கிறோம். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?", promptSuffix: "Explain fully in Tamil language. Translate academic physics definitions to high-quality Tamil description containing native script." },
  { code: 'te-IN', name: 'Telugu (తెలుగు)', native: 'తెలుగు', greeting: "మీ పీయూసీ ఫిజిక్స్ ఏఐ అసిస్టెంట్‌కు స్వాగతం. ఈరోజు నేను మీకు ఎలా ಸಹಾಯపడగలను?", promptSuffix: "Explain fully in Telugu language. Formulate state-board level explanations with native Telugu script." },
  { code: 'ml-IN', name: 'Malayalam (മലയാളം)', native: 'മലയാളം', greeting: "നിങ്ങളുടെ പിയുസി ഫിസിക്സ് എഐ അസിസ്റ്റന്റിലേക്ക് സ്വാഗതം. ഇന്ന് ഞാൻ നിങ്ങൾക്ക് എങ്ങനെ പിയുസി സഹായം നൽകണം?", promptSuffix: "Explain fully in Malayalam language. Use clear academic scientific structure using native Malayalam script." }
];

export default function VoiceAssistantOrb({ onNavigate, activeTab, onAddScore, layoutMode = 'full' }: VoiceAssistantOrbProps) {
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);
  const [assistantState, setAssistantState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCommandGuide, setShowCommandGuide] = useState<boolean>(false);
  const [isFloatingExpanded, setIsFloatingExpanded] = useState<boolean>(false);
  const [isMicEngaged, setIsMicEngaged] = useState<boolean>(false);

  const isMicEngagedRef = useRef<boolean>(false);
  const hasGreeterFiredRef = useRef<boolean>(false);

  // REFS
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const recognitionRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const transcriptBottomRef = useRef<HTMLDivElement | null>(null);

  // Pulse animation states inside Canvas loop
  const pulseScaleRef = useRef<number>(1);
  const rotationAngleRef = useRef<number>(0);

  // Scroll to bottom of transcripts
  useEffect(() => {
    if (transcriptBottomRef.current) {
      transcriptBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcripts]);

  // Handle Canvas Drawing (Animated Orb & Real-time Visualizer spectrum)
  useEffect(() => {
    let ctx: CanvasRenderingContext2D | null = null;
    const canvas = canvasRef.current;
    if (canvas) {
      ctx = canvas.getContext('2d');
    }

    const render = () => {
      if (!canvas || !ctx) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.28;

      // Clear with background transparency
      ctx.clearRect(0, 0, width, height);

      // Extract real-time frequency data if mic/analyser is active
      const dataArray = new Uint8Array(analyserRef.current ? analyserRef.current.frequencyBinCount : 0);
      let averageAmplitude = 0;
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        averageAmplitude = sum / dataArray.length;
      }

      // Smooth state-driven fallback pulses if mic is quiet or idle
      let scale = 1.0;
      let spectrumGlowColor = 'rgba(14, 165, 233, 0.4)'; // Sky Blue standard
      let centerGlow = 'rgba(56, 189, 248, 0.2)';
      let waveformSpeed = 0.02;
      let borderGlowIntensity = 15;

      switch (assistantState) {
        case 'listening':
          // Glowing hot coral / rose pulse reflecting mic activity
          scale = 1.05 + (averageAmplitude / 255) * 0.4;
          spectrumGlowColor = `rgba(244, 63, 94, ${0.4 + (averageAmplitude / 255) * 0.5})`;
          centerGlow = 'rgba(251, 113, 133, 0.25)';
          waveformSpeed = 0.07;
          borderGlowIntensity = 25 + (averageAmplitude / 255) * 40;
          break;
        case 'thinking':
          // Rapid spinning neon gold / amber amber cycle
          rotationAngleRef.current += 0.09;
          scale = 1.02 + Math.sin(Date.now() / 80) * 0.03;
          spectrumGlowColor = 'rgba(245, 158, 11, 0.5)';
          centerGlow = 'rgba(253, 224, 71, 0.2)';
          waveformSpeed = 0.04;
          borderGlowIntensity = 20;
          break;
        case 'speaking':
          // Vibrant emerald cyan equalizer dancing sync
          // Simulate virtual speaking ripples if we don't route TTS bytes directly
          const speakAmp = 10 + Math.sin(Date.now() / 60) * 20 + Math.cos(Date.now() / 150) * 15;
          scale = 1.0 + (speakAmp / 255) * 0.8;
          spectrumGlowColor = `rgba(16, 185, 129, ${0.4 + (speakAmp / 255) * 0.6})`;
          centerGlow = 'rgba(52, 211, 153, 0.2)';
          waveformSpeed = 0.05;
          borderGlowIntensity = 20 + speakAmp * 0.5;
          break;
        case 'idle':
        default:
          // Slow comforting cosmic blue deep inhale
          scale = 0.95 + Math.sin(Date.now() / 1200) * 0.05;
          spectrumGlowColor = 'rgba(99, 102, 241, 0.25)'; // Indigo
          centerGlow = 'rgba(129, 140, 248, 0.1)';
          waveformSpeed = 0.015;
          borderGlowIntensity = 10;
          break;
      }

      rotationAngleRef.current += waveformSpeed;

      // Draw background ambient gas radial gradients
      ctx.save();
      const radialGrad = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.2, centerX, centerY, baseRadius * 1.8);
      radialGrad.addColorStop(0, centerGlow);
      radialGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.05)');
      radialGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Outer Radial Spectrum bands (Equalizer bars bursting outward)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationAngleRef.current);

      const numBars = 80;
      for (let i = 0; i < numBars; i++) {
        const angle = (i / numBars) * Math.PI * 2;
        // Frequency amplitude index or custom dynamic simulation noise
        let val = 0;
        if (analyserRef.current && dataArray.length > 0) {
          const dataIdx = Math.floor((i / numBars) * (dataArray.length / 2));
          val = dataArray[dataIdx] || 0;
        } else {
          // Fallback simulation waves so that orb is always animated with rich futuristic equalizer bars
          const frequencyPart1 = Math.sin(i * 0.4 + Date.now() / 150) * 12;
          const frequencyPart2 = Math.cos(i * 0.82 - Date.now() / 320) * 6;
          val = Math.max(0, 15 + frequencyPart1 + frequencyPart2);
          if (assistantState === 'idle') val *= 0.15;
          if (assistantState === 'thinking') val *= 0.7;
          if (assistantState === 'speaking') val *= 1.4;
        }

        const barHeight = (val / 255) * baseRadius * 0.65;
        const startRad = baseRadius * scale;
        const endRad = startRad + Math.max(2, barHeight);

        const x1 = Math.cos(angle) * startRad;
        const y1 = Math.sin(angle) * startRad;
        const x2 = Math.cos(angle) * endRad;
        const y2 = Math.sin(angle) * endRad;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        // Styling spectral lines
        let strokeGrad = ctx.createLinearGradient(x1, y1, x2, y2);
        if (assistantState === 'listening') {
          strokeGrad.addColorStop(0, 'rgba(244, 63, 94, 0.95)'); // Coral
          strokeGrad.addColorStop(1, 'rgba(251, 146, 60, 0.1)'); // Orange
        } else if (assistantState === 'thinking') {
          strokeGrad.addColorStop(0, 'rgba(245, 158, 11, 0.95)'); // Gold
          strokeGrad.addColorStop(1, 'rgba(253, 224, 71, 0.1)'); // Yellow
        } else if (assistantState === 'speaking') {
          strokeGrad.addColorStop(0, 'rgba(16, 185, 129, 0.95)'); // Emerald Green
          strokeGrad.addColorStop(1, 'rgba(6, 182, 212, 0.1)'); // Cyan
        } else {
          strokeGrad.addColorStop(0, 'rgba(99, 102, 241, 0.7)'); // Indigo
          strokeGrad.addColorStop(1, 'rgba(56, 189, 248, 0.1)'); // Sky Blue
        }

        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      ctx.restore();

      // Draw the core glowing circle (Siri atmosphere bubble)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * scale, 0, Math.PI * 2);
      ctx.shadowBlur = borderGlowIntensity;
      ctx.shadowColor = spectrumGlowColor;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'; // Transparent slate glass inside
      ctx.strokeStyle = spectrumGlowColor;
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.fill();
      ctx.restore();

      // Futuristic inner neon satellite orbiting rings
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-rotationAngleRef.current * 0.6);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * scale * 0.85, 0, Math.PI * 2);
      ctx.strokeStyle = assistantState === 'speaking' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 16]);
      ctx.stroke();
      ctx.restore();

      // Sine wave passing horizontal through center
      ctx.save();
      ctx.beginPath();
      ctx.translate(centerX, centerY);
      ctx.strokeStyle = assistantState === 'listening' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 2;
      const numPoints = 120;
      const amp = assistantState === 'listening' ? 12 + averageAmplitude * 0.15 : 4 + Math.sin(Date.now() / 200) * 4;
      const freq = 0.06;

      for (let i = -numPoints / 2; i <= numPoints / 2; i++) {
        const x = (i / (numPoints / 2)) * baseRadius * scale * 0.95;
        const waveY = Math.sin(i * freq + Date.now() * 0.015) * amp * Math.cos((i / (numPoints / 2)) * Math.PI * 0.5);
        if (i === -numPoints / 2) {
          ctx.moveTo(x, waveY);
        } else {
          ctx.lineTo(x, waveY);
        }
      }
      ctx.stroke();
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [assistantState]);

  // Clean Audio & Voice Resources on Unmount
  useEffect(() => {
    return () => {
      stopVoiceActivity();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Automatic Greeting sequence upon load / first user page click representation
  useEffect(() => {
    const triggerWelcomeSpeech = () => {
      if (hasGreeterFiredRef.current) return;
      hasGreeterFiredRef.current = true;

      // Friendly recruiter professional style greeting
      const text = "Welcome to your PUC Physics AI Assistant. How can I help you today?";
      setAssistantState('speaking');
      speakVoice(text, 'en-IN');

      const welcomeId = `welcome-${Date.now()}`;
      const item: TranscriptItem = {
        id: welcomeId,
        role: 'assistant',
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: 'English (India)'
      };
      setTranscripts(prev => [item, ...prev]);
    };

    // Auto trigger timer on load as safe background execution
    const timer = setTimeout(() => {
      triggerWelcomeSpeech();
    }, 1400);

    // Dynamic bypass for strict WebSpeech autoplay sandbox constraints
    const events = ['click', 'touchstart', 'mousedown'];
    const handleGesture = () => {
      triggerWelcomeSpeech();
      events.forEach(e => window.removeEventListener(e, handleGesture));
    };

    events.forEach(e => window.addEventListener(e, handleGesture, { passive: true }));

    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, handleGesture));
    };
  }, []);

  // Set up microphone context
  const setupWebAudioAPI = async () => {
    if (audioContextRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      micStreamRef.current = stream;
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
    } catch (err: any) {
      console.warn("Could not bind real Web Audio API analyser (mic permission required):", err);
    }
  };

  // Speaks using HTML5 Web Speech Synthesis API
  const speakVoice = (text: string, voiceCode: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isMuted) return;

    // Discard thinking elements before reading
    const scrubbed = text
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
      .replace(/[\*\#\`\_\-\>]/g, "")
      .trim();

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(scrubbed);
    
    // Choose voice code lang
    utterance.lang = voiceCode;
    
    const voices = window.speechSynthesis.getVoices();
    // Try finding accurate regional voice
    const matched = voices.find(v => v.lang.startsWith(voiceCode) || v.lang.includes(voiceCode.substring(0, 2)));
    if (matched) {
      utterance.voice = matched;
    }

    utterance.onstart = () => {
      setAssistantState('speaking');
    };

    utterance.onend = () => {
      setAssistantState('idle');
      // If voice continuous mode is preferred and user explicitly engaged it, reactivate listening
      if (isMicEngagedRef.current) {
        startContinuousSpeechRecognition();
      }
    };

    utterance.onerror = () => {
      setAssistantState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  // Real-time Text-to-Speech trigger with UI history addition
  const greetInLanguage = (languageItem: typeof SUPPORTED_LANGUAGES[0]) => {
    setAssistantState('speaking');
    speakVoice(languageItem.greeting, languageItem.code);
    
    // Add system welcoming transcript
    const newId = `welcome-${Date.now()}`;
    const item: TranscriptItem = {
      id: newId,
      role: 'assistant',
      text: languageItem.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: languageItem.name
    };
    setTranscripts(prev => [...prev.filter(t => !t.id.startsWith('welcome-')), item]);
  };

  // Helper spoken feedback response
  const speakFeedback = (text: string, voiceCode: string) => {
    speakVoice(text, voiceCode);
    const item: TranscriptItem = {
      id: `feedback-${Date.now()}`,
      role: 'assistant',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLang.name
    };
    setTranscripts(prev => [...prev, item]);
  };

  // Starts Voice Recognition loop
  const startContinuousSpeechRecognition = async () => {
    await setupWebAudioAPI();
    setErrorMessage(null);

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setErrorMessage("Speech Recognition API is not supported in this browser. Please use Chrome, Edge or Safari.");
      setAssistantState('idle');
      return;
    }

    try {
      // Close existing
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRec();
      recognition.continuous = false; // Turn on/off processing blocks
      recognition.interimResults = false;
      recognition.lang = selectedLang.code;

      recognition.onstart = () => {
        setAssistantState('listening');
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript || '';
        if (transcript.trim()) {
          // Send transcript to pipeline processing
          handleProcessVoiceQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'aborted') {
          return;
        }
        if (event.error === 'no-speech') {
          console.warn("Speech recognition timed out with no-speech.");
        } else {
          console.error("Speech Recognition Error:", event.error);
        }
        if (event.error === 'not-allowed') {
          setErrorMessage("Microphone access is denied. Please permit website camera/mic permissions in your browser.");
          isMicEngagedRef.current = false;
          setIsMicEngaged(false);
        }
        if (recognitionRef.current === recognition) {
          setAssistantState('idle');
        }
      };

      recognition.onend = () => {
        // Keep idle unless speaking took over state
        if (recognitionRef.current === recognition) {
          setAssistantState(curr => curr === 'listening' ? 'idle' : curr);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (e: any) {
      setErrorMessage("Failed to boot recognition client: " + e.message);
      setAssistantState('idle');
    }
  };

  // Helper to dynamically detect language change request and yield the target language configuration
  const detectLanguageSwitch = (text: string) => {
    const t = text.toLowerCase().trim();
    
    // Check English aversion
    if (
      t.includes("don't know english") || 
      t.includes("don't speak english") || 
      t.includes("don't understand english") || 
      t.includes("do not know english") || 
      t.includes("i don't english") || 
      t.includes("no english") ||
      t.includes("dont speak english") ||
      t.includes("can't understand english") ||
      t.includes("cannot understand english") ||
      t.includes("hindi mein") || t.includes("हिंदी में") ||
      t.includes("kannada alli") || t.includes("ಕನ್ನಡದಲ್ಲಿ") || t.includes("kannada language") ||
      t.includes("tamilil") || t.includes("தமிழில்") ||
      t.includes("telugulo") || t.includes("తెలుగులో") ||
      t.includes("malayalathil") || t.includes("മലയാളത്തിൽ")
    ) {
      if (t.includes("hindi") || t.includes("हिंदी") || t.includes("hi-IN") || t.includes("hindi mein") || t.includes("हिंदी में")) {
        return SUPPORTED_LANGUAGES.find(l => l.code === 'hi-IN') || null;
      }
      if (t.includes("tamil") || t.includes("தமிழ்") || t.includes("ta-IN") || t.includes("tamilil") || t.includes("தமிழில்")) {
        return SUPPORTED_LANGUAGES.find(l => l.code === 'ta-IN') || null;
      }
      if (t.includes("telugu") || t.includes("తెలుగు") || t.includes("te-IN") || t.includes("telugulo") || t.includes("తెలుగులో")) {
        return SUPPORTED_LANGUAGES.find(l => l.code === 'te-IN') || null;
      }
      if (t.includes("malayalam") || t.includes("മലയാളം") || t.includes("ml-IN") || t.includes("malayalathil") || t.includes("മലയാളത്തിൽ")) {
        return SUPPORTED_LANGUAGES.find(l => l.code === 'ml-IN') || null;
      }
      // If they just say "don't know english" or similar, default to Kannada (official state board language)
      return SUPPORTED_LANGUAGES.find(l => l.code === 'kn-IN') || null;
    }

    if (t.includes('kannada') || t.includes('ಕನ್ನಡ') || t.includes('karnataka')) {
      return SUPPORTED_LANGUAGES.find(l => l.code === 'kn-IN') || null;
    }
    if (t.includes('hindi') || t.includes('हिन्दी') || t.includes('हिंदी')) {
      return SUPPORTED_LANGUAGES.find(l => l.code === 'hi-IN') || null;
    }
    if (t.includes('tamil') || t.includes('தமிழ்')) {
      return SUPPORTED_LANGUAGES.find(l => l.code === 'ta-IN') || null;
    }
    if (t.includes('telugu') || t.includes('తెలుగు')) {
      return SUPPORTED_LANGUAGES.find(l => l.code === 'te-IN') || null;
    }
    if (t.includes('malayalam') || t.includes('മലയാളം')) {
      return SUPPORTED_LANGUAGES.find(l => l.code === 'ml-IN') || null;
    }
    if (t.includes('english')) {
      return SUPPORTED_LANGUAGES.find(l => l.code === 'en-IN') || null;
    }

    return null;
  };

  const cleanQueryTextFromLanguageTrigger = (text: string): string => {
    let cleaned = text.toLowerCase();
    
    const filters = [
      /explain in kannada/gi, /kannada alli/gi, /ಕನ್ನಡದಲ್ಲಿ/gi, /prefer kannada/gi, /speak in kannada/gi, /in kannada/gi, /kannada language/gi, /can you speak in kannada/gi, /can you explain in kannada/gi,
      /explain in hindi/gi, /hindi mein/gi, /हिंदी में/gi, /prefer hindi/gi, /speak in hindi/gi, /in hindi/gi, /hindi language/gi, /can you speak in hindi/gi, /can you explain in hindi/gi,
      /explain in tamil/gi, /tamilil/gi, /தமிழில்/gi, /prefer tamil/gi, /speak in tamil/gi, /in tamil/gi, /tamil language/gi, /can you speak in tamil/gi, /can you explain in tamil/gi,
      /explain in telugu/gi, /telugulo/gi, /తెలుగులో/gi, /prefer telugu/gi, /speak in telugu/gi, /in telugu/gi, /telugu language/gi, /can you speak in telugu/gi, /can you explain in telugu/gi,
      /explain in malayalam/gi, /malayalathil/gi, /മലയാളത്തിൽ/gi, /prefer malayalam/gi, /speak in malayalam/gi, /in malayalam/gi, /malayalam language/gi, /can you speak in malayalam/gi, /can you explain in malayalam/gi,
      /explain in english/gi, /prefer english/gi, /speak in english/gi, /in english/gi, /english language/gi, /can you speak in english/gi, /can you explain in english/gi,
      /i cannot understand english/gi, /i can't understand english/gi, /don't understand english/gi, /dont understand english/gi, /do not understand english/gi, 
      /dont know english/gi, /cant understand english/gi, /no english/gi, /don't know english/gi,
      /can you speak in/gi, /speak in/gi, /explain in/gi
    ];

    filters.forEach(regex => {
      cleaned = cleaned.replace(regex, "");
    });

    cleaned = cleaned.replace(/\s+/g, " ").trim();
    return cleaned;
  };

  // Handles text formulation and voice processing
  const handleProcessVoiceQuery = async (queryText: string) => {
    // 1. Detect dynamic language switch request at the very beginning!
    const targetLang = detectLanguageSwitch(queryText);
    let activeLanguageToUse = selectedLang;
    let actualQueryToPost = queryText;

    if (targetLang) {
      activeLanguageToUse = targetLang;
      setSelectedLang(targetLang);
      
      // Clean up the language switch instructions to extract the true query
      const cleanedQuery = cleanQueryTextFromLanguageTrigger(queryText);
      
      // If the remaining query is empty/essentially just a language switch request
      if (!cleanedQuery || cleanedQuery === "explain" || cleanedQuery === "speak" || cleanedQuery.length < 3) {
        const userMsgId = `query-${Date.now()}`;
        const userQuery: TranscriptItem = {
          id: userMsgId,
          role: 'user',
          text: queryText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: targetLang.name
        };
        setTranscripts(prev => [...prev, userQuery]);
        setAssistantState('thinking');
        
        speakFeedback(targetLang.greeting, targetLang.code);
        onAddScore(5);
        return;
      } else {
        actualQueryToPost = cleanedQuery;
      }
    }

    // Add Query to list transcript panel
    const userMsgId = `query-${Date.now()}`;
    const userQuery: TranscriptItem = {
      id: userMsgId,
      role: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: activeLanguageToUse.name
    };
    
    setTranscripts(prev => [...prev, userQuery]);
    setAssistantState('thinking');

    // 2. Perform local keyword voice commands matching BEFORE contacting server
    const isCommand = processVoiceCommands(queryText);
    if (isCommand) {
      onAddScore(5); // Award points for utilizing hands-free commands
      return; 
    }

    // 3. Post to local Ollama server using grounding RAG guidelines and language translation requests
    try {
      const promptCombined = `Student Question: "${actualQueryToPost}"\n\n${activeLanguageToUse.promptSuffix}\n\nAct as a friendly, expert Karnataka Board Physics Tutor. Write your answers with equations if relevant.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: promptCombined,
          chapterId: 0, // Dynamic cross-chapter search
          bloomLevel: 'All',
          includeExample: true
        })
      });

      if (!response.ok) {
        throw new Error("Tutor backend offline.");
      }

      const data = await response.json();
      
      const assistantMsgId = `ai-response-${Date.now()}`;
      const assistantItem: TranscriptItem = {
        id: assistantMsgId,
        role: 'assistant',
        text: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: activeLanguageToUse.name
      };

      setTranscripts(prev => [...prev, assistantItem]);
      onAddScore(10); // Reward academic voice interactions

      // Automatically synthesize reply output audio
      speakVoice(data.content, activeLanguageToUse.code);

    } catch (err: any) {
      console.error(err);
      speakFeedback("I had a small connection issue. Could you repeat please?", activeLanguageToUse.code);
    }
  };

  // Core parser for hands-free voice commands mapping
  const processVoiceCommands = (transcript: string) => {
    const t = transcript.toLowerCase().trim();

    // Voice instructions for stopping/cancelling speech immediately
    if (
      t === "stop" || 
      t.includes("stop speaking") || 
      t.includes("stop explaining") || 
      t.includes("silent") || 
      t.includes("be quiet") || 
      t.includes("shut up") ||
      t.includes("dont speak")
    ) {
      stopSpeaking();
      return true;
    }
    
    // Switch language voice checks and English aversion filters
    if (
      t.includes("don't know english") || 
      t.includes("don't speak english") || 
      t.includes("don't understand english") || 
      t.includes("do not know english") || 
      t.includes("i don't english") || 
      t.includes("no english") ||
      t.includes("dont speak english")
    ) {
      // Guide user and default to Kannada (the board language of Karnataka!)
      const val = SUPPORTED_LANGUAGES.find(l => l.code === 'kn-IN')!;
      setSelectedLang(val);
      speakFeedback("ನಿಮ್ಮ ಆದ್ಯತೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ನಾನು ಇಂದು ನಿಮಗೆ ಭೌತಶಾಸ್ತ್ರವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಕಲಿಯಲು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?", "kn-IN");
      return true;
    }

    if (t.includes('explain in kannada') || t.includes('kannada alli') || t.includes('ಕನ್ನಡದಲ್ಲಿ') || t.includes('kannada language') || t.includes('prefer kannada')) {
      const val = SUPPORTED_LANGUAGES.find(l => l.code === 'kn-IN')!;
      setSelectedLang(val);
      speakFeedback("ಕನ್ನಡ ತರಗತಿಗೆ ಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಭೌತಶಾಸ್ತ್ರ ಕಲಿಯಲು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?", "kn-IN");
      return true;
    }
    if (t.includes('explain in hindi') || t.includes('hindi mein') || t.includes('हिंदी में') || t.includes('hindi language') || t.includes('prefer hindi')) {
      const val = SUPPORTED_LANGUAGES.find(l => l.code === 'hi-IN')!;
      setSelectedLang(val);
      speakFeedback("हिंदी पीयूसी ट्यूटर में आपका स्वागत है। मैं आपकी कैसे मदद कर सकता हूँ?", "hi-IN");
      return true;
    }
    if (t.includes('explain in tamil') || t.includes('tamilil') || t.includes('தமிழில்') || t.includes('tamil language') || t.includes('prefer tamil')) {
      const val = SUPPORTED_LANGUAGES.find(l => l.code === 'ta-IN')!;
      setSelectedLang(val);
      speakFeedback("தமிழ் வகுப்பிற்கு வரவேற்கிறோம். இயற்பியல் கற்க நான் உங்களுக்கு எவ்வாறு உதவ வேண்டும்?", "ta-IN");
      return true;
    }
    if (t.includes('explain in telugu') || t.includes('telugulo') || t.includes('తెలుగులో') || t.includes('telugu language') || t.includes('prefer telugu')) {
      const val = SUPPORTED_LANGUAGES.find(l => l.code === 'te-IN')!;
      setSelectedLang(val);
      speakFeedback("తెలుగు పాఠ్యాంశాలకు స్వాగతం. ఈరోజు ఫిజిక్స్ గురించి ఏమి నేర్చుకుందాం?", "te-IN");
      return true;
    }
    if (t.includes('explain in malayalam') || t.includes('malayalathil') || t.includes('മലയാളത്തിൽ') || t.includes('malayalam language') || t.includes('prefer malayalam')) {
      const val = SUPPORTED_LANGUAGES.find(l => l.code === 'ml-IN')!;
      setSelectedLang(val);
      speakFeedback("മലയാളം പಿಯുസി ക്ലാസിലേക്ക് സ്വാഗതം. ഭൗതികശാസ്ത്രം പഠിക്കാൻ ഞാൻ എങ്ങനെ സഹായിക്കണം?", "ml-IN");
      return true;
    }


    if (t.includes('explain in english')) {
      const val = SUPPORTED_LANGUAGES.find(l => l.code === 'en-IN')!;
      setSelectedLang(val);
      speakFeedback("Switched back to English standard module. How can I assist you now?", "en-IN");
      return true;
    }

    // Tab Navigation commands
    if (t.includes('go to home') || t.includes('open home') || t.includes('navigate home') || t.includes('home page') || t.includes('dashboard') || t === 'home') {
      onNavigate('Home');
      speakFeedback("Navigating home. Here is your evaluation cockpit review.", selectedLang.code);
      return true;
    }
    if (t.includes('tutor') || t.includes('ask tutor') || t.includes('chat page') || t.includes('open tutor')) {
      onNavigate('Ask Tutor');
      speakFeedback("Launching textbook chat page.", selectedLang.code);
      return true;
    }
    if (t.includes('chapter') || t.includes('chapters') || t.includes('syllabus') || t.includes('show chapters') || t.includes('open chapters')) {
      onNavigate('Chapters');
      speakFeedback("Opening syllabus chapters blueprints.", selectedLang.code);
      return true;
    }
    if (t.includes('written exam') || t.includes('start exam') || t.includes('open written exam') || t.includes('mock exam') || t.includes('board test') || t.includes('written test') || t.includes('exam sheet')) {
      onNavigate('Written Exam');
      speakFeedback("Starting your written mock evaluation board test.", selectedLang.code);
      return true;
    }
    if (t.includes('mcq') || t.includes('quiz page') || t.includes('solve questions') || t.includes('multiple choice') || t.includes('cet test') || t.includes('quiz')) {
      onNavigate('MCQ Test');
      speakFeedback("Opening multiple-choice questions trainer.", selectedLang.code);
      return true;
    }
    if (t.includes('answer test') || t.includes('evaluate answer') || t.includes('grader') || t.includes('scoring test') || t.includes('answer evaluator')) {
      onNavigate('Answer Test');
      speakFeedback("Evaluating response rubric evaluator page rules.", selectedLang.code);
      return true;
    }
    if (t.includes('report') || t.includes('reports') || t.includes('performance') || t.includes('progress') || t.includes('diagnostics')) {
      onNavigate('Reports');
      speakFeedback("Opening diagnostics performance chart analytics summary.", selectedLang.code);
      return true;
    }
    if (t.includes('voice lounge') || t.includes('lounge') || t.includes('assistant') || t.includes('voice chat')) {
      onNavigate('AI Voice Lounge');
      speakFeedback("Switched to the high fidelity AI Voice Lounge.", selectedLang.code);
      return true;
    }

    return false;
  };

  // Standard speech synthesis cancel and reset state
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAssistantState('idle');
  };

  // Standard cleanup
  const stopVoiceActivity = () => {
    isMicEngagedRef.current = false;
    setIsMicEngaged(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    setAssistantState('idle');
  };

  const handleOrbClick = () => {
    if (assistantState === 'speaking') {
      stopSpeaking();
    } else if (assistantState === 'listening') {
      stopVoiceActivity();
    } else {
      isMicEngagedRef.current = true;
      setIsMicEngaged(true);
      // First activation greetings trigger
      if (transcripts.length === 0) {
        greetInLanguage(selectedLang);
      } else {
        startContinuousSpeechRecognition();
      }
    }
  };

  const clearHistory = () => {
    setTranscripts([]);
    stopVoiceActivity();
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleManualSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    const textMsg = customText;
    setCustomText('');
    handleProcessVoiceQuery(textMsg);
  };

  const activateForLanguage = (langObj: typeof SUPPORTED_LANGUAGES[0]) => {
    setSelectedLang(langObj);
    greetInLanguage(langObj);
  };

  if (layoutMode === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="voice-assistant-floating-dock">
        {/* Expanded Panel Mode View */}
        {isFloatingExpanded ? (
          <div className="w-[400px] max-w-[92vw] h-[550px] bg-slate-950/92 rounded-3xl border border-white/12 shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-2xl animate-fade-in" id="floating-pane-expanded">
            {/* Header section with state indicators and close */}
            <div className="px-5 py-3.5 border-b border-white/5 flex justify-between items-center bg-white/2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  assistantState === 'listening' ? 'bg-rose-500 animate-ping' :
                  assistantState === 'thinking' ? 'bg-amber-500 animate-spin' :
                  assistantState === 'speaking' ? 'bg-emerald-500' : 'bg-indigo-400'
                }`}></span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">
                  AI Co-Pilot: <b className="text-sky-400">{assistantState}</b>
                </span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 px-2 text-[10px] font-bold rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white"
                  title="Toggle voice speech feedback"
                >
                  {isMuted ? "🔇 Muted" : "🔊 Audio"}
                </button>
                <button 
                  onClick={() => setIsFloatingExpanded(false)}
                  className="p-1 text-white/50 hover:text-white rounded-lg bg-white/5"
                  id="btn-close-floating-dialogue"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Language bar inside expandable floating widget */}
            <div className="px-4 py-2 border-b border-white/5 bg-slate-900/40 flex items-center justify-between gap-1 overflow-x-auto custom-scrollbar">
              <span className="text-[9px] font-black uppercase tracking-wider text-sky-450 shrink-0">Lang:</span>
              <div className="flex gap-1">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => activateForLanguage(lang)}
                    className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all border shrink-0 ${
                      selectedLang.code === lang.code
                        ? 'bg-sky-500/25 text-sky-300 border-sky-400/40'
                        : 'bg-white/3 text-white/60 border-transparent hover:border-white/10'
                    }`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>

            {/* Mini visualizer orb screen area */}
            <div className="p-4 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950/20 to-slate-900/10 border-b border-white/5 relative">
              <div className={`absolute inset-0 rounded-full blur-2xl opacity-15 max-w-[120px] mx-auto ${
                assistantState === 'listening' ? 'bg-rose-500' :
                assistantState === 'thinking' ? 'bg-amber-500' :
                assistantState === 'speaking' ? 'bg-emerald-500' : 'bg-sky-500'
              }`} />
              
              <canvas 
                ref={canvasRef} 
                width={160} 
                height={160} 
                className="w-36 h-36 select-none relative z-10 cursor-pointer hover:scale-105 transition-transform"
                onClick={handleOrbClick}
                id="floating-canvas-orb"
              />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none p-2 rounded-full bg-slate-950/85 border border-white/5">
                {assistantState === 'listening' ? (
                  <MicOff className="w-4 h-4 text-rose-400" />
                ) : (
                  <Mic className="w-4 h-4 text-sky-400" />
                )}
              </div>

              <div className="text-[10px] text-white/50 text-center mt-1.5 uppercase font-bold tracking-wider w-full flex flex-col items-center gap-1.5">
                {assistantState === 'listening' ? (
                  <span className="text-rose-400">🔴 Listening... Speak now</span>
                ) : assistantState === 'speaking' ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-emerald-400 animate-pulse">🔊 Assistant is speaking...</span>
                    <button
                      onClick={() => stopSpeaking()}
                      className="mt-1 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-extrabold uppercase rounded-lg border border-rose-500/30 text-[9px] cursor-pointer shadow-md active:scale-95 transition-all flex items-center gap-1 pointer-events-auto"
                      id="btn-stop-speech-floating"
                    >
                      <Square className="w-2.5 h-2.5 fill-current" /> Stop Explaining
                    </button>
                  </div>
                ) : (
                  <span>Tap orb to speak commands</span>
                )}
              </div>
            </div>

            {/* Transcripts dialogue block */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black/15 text-xs max-h-[180px] custom-scrollbar">
              {transcripts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-4 text-white/40">
                  <span className="p-2 rounded-full bg-white/2 border border-white/5 text-sky-405 text-sm mb-1">🎙️</span>
                  <div className="font-bold text-[10px] uppercase">Always Active Background Pilot</div>
                  <div className="text-[9px] max-w-[200px] leading-relaxed">
                    Say "Go to mock exam", "Go to Chapters", or "Explain in Kannada" anytime!
                  </div>
                </div>
              ) : (
                transcripts.map((item, index) => (
                  <div 
                    key={item.id || index}
                    className={`flex gap-2 text-[11px] max-w-[85%] ${
                      item.role === 'user' ? 'justify-end ml-auto' : 'mr-auto'
                    }`}
                  >
                    <div className={`p-3 rounded-xl relative ${
                      item.role === 'user'
                        ? 'bg-sky-500 text-slate-950 border-r-none rounded-tr-none font-semibold'
                        : 'bg-white/5 border border-white/5 text-white rounded-tl-none font-medium'
                    }`}>
                      <div className="whitespace-pre-wrap">{item.text}</div>
                    </div>
                  </div>
                ))
              )}
              <div ref={transcriptBottomRef} />
            </div>

            {/* Error indicators */}
            {errorMessage && (
              <div className="px-4 py-2 bg-rose-500/10 border-t border-rose-500/20 text-rose-300 text-[10px]">
                {errorMessage}
              </div>
            )}

            {/* Floating pane text submission footer */}
            <div className="p-3 border-t border-white/5 bg-slate-900/20">
              <form onSubmit={handleManualSendText} className="flex gap-1.5">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Type or direct voice request..."
                  className="flex-1 px-3 py-2 rounded-xl border border-white/10 bg-slate-950/60 text-xs text-white placeholder-white/20 focus:outline-none focus:border-sky-505"
                />
                <button
                  type="submit"
                  disabled={!customText.trim()}
                  className="p-2 bg-sky-500 text-slate-950 hover:bg-sky-400 transition-all rounded-xl"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Small Pulsing Micro Orb View state */
          <div className="relative group flex items-center gap-2" id="floating-bubble-orbit">
            {/* Quick alert bar tooltip */}
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-700 shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap">
              <span className="text-[#FF6B00]">🎙️ AI Multilingual Voice Pilot</span> — Say "Go to Chapters"
            </div>

            <button
              type="button"
              onClick={() => {
                setIsFloatingExpanded(true);
                // Trigger mic connection sequence right away if not already active to give premium click experience
                isMicEngagedRef.current = true;
                setIsMicEngaged(true);
                startContinuousSpeechRecognition();
              }}
              className="w-14 h-14 rounded-full bg-white border border-[#FF6B00]/40 shadow-md flex items-center justify-center cursor-pointer transition-all active:scale-95 duration-200 outline-none hover:border-[#FF6B00] relative overflow-hidden select-none"
              id="floating-micro-bubble-toggle"
            >
              {/* Spinning background spectrum halo */}
              <div className={`absolute inset-0 rounded-full blur-md opacity-25 ${
                assistantState === 'listening' ? 'bg-rose-500 animate-pulse scale-110' :
                assistantState === 'thinking' ? 'bg-amber-500 animate-spin' :
                assistantState === 'speaking' ? 'bg-orange-500 scale-105' : 'bg-orange-500'
              }`} />

              {/* Dynamic state micro indicator lights */}
              <span className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full border border-white ${
                assistantState === 'listening' ? 'bg-rose-500 animate-ping' :
                assistantState === 'thinking' ? 'bg-amber-500 animate-pulse' :
                assistantState === 'speaking' ? 'bg-emerald-500' : 'bg-[#FF6B00]'
              }`} />

              {/* Glowing Mic center details icon */}
              <div className="z-10 bg-white p-2.5 rounded-full border border-slate-200 shadow-inner">
                {assistantState === 'speaking' ? (
                  <Volume2 className="w-5 h-5 text-emerald-500 animate-pulse" />
                ) : (
                  <Mic className={`w-5 h-5 ${assistantState === 'listening' ? 'text-rose-500 animate-bounce' : 'text-[#FF6B00]'}`} />
                )}
              </div>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="voice-lounge-container">
      {/* Title & Language Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white rounded-3xl border border-slate-200 gap-4 shadow-sm" id="voice-lounge-header">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-50 text-[#FF6B00] border border-orange-100 rounded-lg">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">AI Multilingual Voice Cockpit</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl font-bold">
            Experience conversational, hands-free voice tutoring matching Karnataka Board evaluation criteria. Control the layout with voice commands and master NCERT Physics.
          </p>
        </div>

        {/* Floating Quick Swapping Language selectors */}
        <div className="flex flex-wrap gap-2" id="locale-swapper-row">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => activateForLanguage(lang)}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all border shrink-0 select-none cursor-pointer flex items-center gap-1.5 duration-150 ${
                selectedLang.code === lang.code
                  ? 'bg-orange-50 text-[#FF6B00] border-[#FF6B00] shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-200 hover:bg-orange-50/20'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>{lang.native}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="voice-cockpit-grid">
        {/* Core Interactive Visualizer Orb Card (Left side, larger visual impact) */}
        <div className="lg:col-span-2 flex flex-col justify-between items-center bg-white border border-slate-200 shadow-sm rounded-3xl p-6 relative gap-4 min-h-[460px]" id="visualizer-orb-card">
          <div className="w-full flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${
                assistantState === 'listening' ? 'bg-rose-500 animate-ping' :
                assistantState === 'thinking' ? 'bg-amber-500 animate-spin' :
                assistantState === 'speaking' ? 'bg-[#FF6B00]' : 'bg-slate-400'
              }`}></div>
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">
                STATE: <b className={`capitalize ${
                  assistantState === 'listening' ? 'text-rose-600' :
                  assistantState === 'thinking' ? 'text-amber-600' :
                  assistantState === 'speaking' ? 'text-[#FF6B00]' : 'text-slate-400'
                }`}>{assistantState}</b>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-xl transition-all border ${
                isMuted 
                  ? 'bg-rose-50 border-rose-100 text-rose-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-105'
              }`}
              title={isMuted ? "Unmute TTS Audio" : "Mute TTS Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Interactive Glowing Orb Circle */}
          <div className="relative cursor-pointer group flex items-center justify-center my-4" onClick={handleOrbClick}>
            {/* Soft Ambient glowing halos wrapper */}
            <div className={`absolute inset-0 rounded-full blur-3xl opacity-35 transition-all duration-700 ${
              assistantState === 'listening' ? 'bg-rose-500/25 scale-120 animate-pulse' :
              assistantState === 'thinking' ? 'bg-amber-500/25 scale-110 animate-spin' :
              assistantState === 'speaking' ? 'bg-orange-500/25 scale-115' : 'bg-[#FF6B00]/10'
            }`}></div>

            <canvas 
              ref={canvasRef} 
              width={260} 
              height={260} 
              className="w-64 h-64 md:w-72 md:h-72 select-none relative z-10 mx-auto transition-transform duration-300 group-hover:scale-[1.03]"
              id="speech-reactive-canvas-orb"
            />

            {/* Microphones overlay trigger icon inside center orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-slate-900 border border-[#FF6B00]/40 rounded-full shadow-inner z-20 hover:scale-110 transition-transform flex items-center justify-center">
              {assistantState === 'listening' ? (
                <MicOff className="w-6 h-6 text-rose-400 animate-pulse" />
              ) : (
                <Mic className="w-6 h-6 text-orange-400" />
              )}
            </div>
          </div>

          {/* User Call To Action status briefing */}
          <div className="text-center space-y-2 pb-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest block">
              {assistantState === 'listening' ? 'Listening...' :
               assistantState === 'thinking' ? 'Evaluating context...' :
               assistantState === 'speaking' ? 'Assistant is speaking' : 'Tap Orb to begin'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto font-semibold">
              {assistantState === 'listening' ? 'Speak your physics problem now' :
               assistantState === 'thinking' ? 'Retrieving grounded NCERT guidelines' :
               assistantState === 'speaking' ? 'Turn on speakers to hear full response' :
               `Click and speak in ${selectedLang.native} to activate the tutor.`}
            </p>

            {assistantState === 'speaking' && (
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => stopSpeaking()}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold uppercase tracking-wide rounded-xl border border-rose-200 text-[11px] cursor-pointer shadow-md active:scale-95 transition-all flex items-center gap-2"
                  id="btn-stop-speech-lounge"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Stop Assistant Speaking
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Transcription dialogues Panel & Actions (Right side, larger content view) */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-white border border-slate-200 shadow-sm rounded-3xl min-h-[460px] overflow-hidden" id="transcription-lounge-panel">
          
          {/* Transcript Panel Top Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">Real-Time Conversation Stream</span>
            </div>
            
            <div className="flex gap-2 font-sans font-extrabold">
              <button
                type="button"
                onClick={() => setShowCommandGuide(!showCommandGuide)}
                className="text-[10px] font-black text-[#FF6B00] hover:text-orange-500 transition-all select-none cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Show Voice Commands</span>
              </button>
              {transcripts.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-[10px] font-black text-rose-500 hover:text-rose-700 transition-all select-none cursor-pointer flex items-center gap-1 border-l border-slate-200 pl-2"
                >
                  Clear history
                </button>
              )}
            </div>
          </div>

          {/* Transcript Scrolling Dialogue items */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[340px] custom-scrollbar bg-slate-50/50" id="transcript-messages-scroller">
            {transcripts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="p-3 rounded-full bg-orange-50 border border-orange-100 text-[#FF6B00]">
                  <Mic className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm">No speech logs yet</h4>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-bold">
                  Start hands-free testing. Try requesting:<br />
                  <b className="text-[#FF6B00] font-black">"Explain in Kannada"</b> or <b className="text-[#FF6B00] font-black">"Explain displacement current."</b>
                </p>
              </div>
            ) : (
              transcripts.map((item, index) => (
                <div 
                  key={item.id || index}
                  className={`flex gap-3 text-xs leading-relaxed max-w-[85%] ${
                    item.role === 'user' ? 'justify-end ml-auto' : 'mr-auto'
                  }`}
                >
                  {/* Left avatar badge */}
                  {item.role === 'assistant' && (
                    <div className="w-7 h-7 bg-orange-100 text-[#FF6B00] font-black rounded-lg flex items-center justify-center text-[10px] shadow-sm border border-orange-200">
                      AI
                    </div>
                  )}

                  <div className={`p-4 rounded-xl relative ${
                    item.role === 'user' 
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white rounded-tr-none font-bold shadow shadow-orange-500/10' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none font-medium shadow-sm'
                  }`}>
                    <div className="whitespace-pre-wrap">{item.text}</div>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-100 text-[9px] opacity-60 font-mono font-bold">
                      <span>{item.language}</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>

                  {item.role === 'user' && (
                    <div className="w-7 h-7 bg-slate-100 text-[#FF6B00] font-black rounded-lg flex items-center justify-center text-[10px] border border-slate-200 shadow-sm">
                      ME
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={transcriptBottomRef} />
          </div>

          {/* Text/Speech overlay error alert info */}
          {errorMessage && (
            <div className="mx-5 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex justify-between items-center animate-fade-in font-bold">
              <span>{errorMessage}</span>
              <button type="button" onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700 ml-2 font-black">
                <MicOff className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Suggested Handsfree Commands popup board overlay */}
          {showCommandGuide && (
            <div className="m-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 animate-fade-in space-y-2 relative shadow-inner" id="voice-guide-expanded">
              <button 
                type="button"
                onClick={() => setShowCommandGuide(false)} 
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-800 p-1 font-black"
              >
                <X className="w-4 h-4" />
              </button>
              <h5 className="text-[10px] font-black uppercase tracking-wider text-[#FF6B00]">Available Handsfree Command Sentences:</h5>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 font-mono font-bold">
                <div>💬 "Go to Home" / "Go to Tutor"</div>
                <div>📚 "Go to Chapters" / "Go to Written Exam"</div>
                <div>🧩 "Go to MCQ Test"</div>
                <div>🏆 "Go to Reports"</div>
                <div>🗣️ "Explain in English" / "Explain in Kannada"</div>
                <div>🗣️ "Explain in Hindi" / "Explain in Tamil"</div>
              </div>
            </div>
          )}

          {/* Bottom Manual override typing row */}
          <div className="p-4 border-t border-slate-150 bg-slate-50" id="voice-input-submit font-sans font-bold">
            <form onSubmit={handleManualSendText} className="flex gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type question if inside noisy room (or use standard microphone)..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-205 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6B00]"
              />
              <button
                type="submit"
                disabled={!customText.trim() || assistantState === 'thinking'}
                className="p-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xl cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
