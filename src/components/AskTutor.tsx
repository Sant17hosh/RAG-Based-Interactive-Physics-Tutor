import React, { useState } from 'react';
import { CHANNELS_PUC_DATA } from '../ncertData';
import { ChatMessage, GroundingChunk } from '../types';
import { Search, BrainCircuit, Book, HelpCircle, ChevronRight, ChevronDown, CheckCircle, Lightbulb, Mic, MicOff, X, Globe, Square } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English (India)', native: 'English', greeting: "Welcome to your PUC Physics AI Assistant. How can I help you today?", promptSuffix: "Explain in standard English. Maintain CBSE/state-board academic nomenclature." },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', native: 'ಕನ್ನಡ', greeting: "ನಿಮ್ಮ ಪಿಯುಸಿ ಭೌತಶಾಸ್ತ್ರ ಎಐ ಸಹಾಯಕಕ್ಕೆ ಸುಸ್ವಾಗತ. ನಾನು ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?", promptSuffix: "Explain fully in Kannada language. Translate physics terms to understandable Kannada context, but keep important English terms in brackets. Write in native Kannada script." },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', native: 'हिन्दी', greeting: "आपके पीयूसी भौतिकी एआई सहायक में स्वागत है। आज मैं आपकी क्या मदद कर सकता हूँ?", promptSuffix: "Explain fully in Hindi language. Use high-quality educational Hindi script and write physics equations clearly." },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)', native: 'தமிழ்', greeting: "உங்கள் பியூசி இயற்பியல் ஏஐ உதவிக்கு வரவேற்கிறோம். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?", promptSuffix: "Explain fully in Tamil language. Translate academic physics definitions to high-quality Tamil description containing native script." },
  { code: 'te-IN', name: 'Telugu (తెలుగు)', native: 'తెలుగు', greeting: "మీ పీయూసీ ఫిజిక్స్ ఏఐ అసిస్టెంట్‌కు స్వాగతం. ఈరోజు నేను మీకు ఎలా ಸಹಾಯపడగలను?", promptSuffix: "Explain fully in Telugu language. Formulate state-board level explanations with native Telugu script." },
  { code: 'ml-IN', name: 'Malayalam (മലയാളം)', native: 'മലയാളം', greeting: "നിങ്ങളുടെ പിയുസി ഫിസിക്സ് എഐ അസിസ്റ്റന്റിലേക്ക് സ്വാഗതം. ഇന്ന് ഞാൻ നിങ്ങൾക്ക് എങ്ങനെ പിയുസി സഹായം നൽകണം?", promptSuffix: "Explain fully in Malayalam language. Use clear academic scientific structure using native Malayalam script." }
];

interface AskTutorProps {
  onAddScore: (score: number) => void;
}

export default function AskTutor({ onAddScore }: AskTutorProps) {
  const [chapterId, setChapterId] = useState<number>(CHANNELS_PUC_DATA[0].id); // Default to first available chapter (Electromagnetic Waves)
  const [bloomLevel, setBloomLevel] = useState<string>('All');
  const [includeExample, setIncludeExample] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [expandedChunk, setExpandedChunk] = useState<string | null>(null);
  const [showThinking, setShowThinking] = useState<Record<string, boolean>>({});
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);
  const [assistantState, setAssistantState] = useState<'idle' | 'speaking'>('idle');
  // ID of the assistant message currently being streamed (null when not streaming)
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);

  // Ollama Health and active model configuration manager
  const [ollamaInfo, setOllamaInfo] = useState<{
    ollamaRunning: boolean;
    activeModel: string;
    modelAvailable: boolean;
    availableModels: string[];
    supportedModels: string[];
    status: string;
    message: string;
  } | null>(null);

  const fetchTutorHistory = async () => {
    try {
      const activeToken = localStorage.getItem('tim_token');
      if (!activeToken) return;
      const res = await fetch('/api/tutor/history', {
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const messages: ChatMessage[] = [];
        data.forEach((row: any) => {
          const timeStr = new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          messages.push({
            id: `q-${row.id}`,
            role: 'user',
            content: row.question,
            timestamp: timeStr
          });
          messages.push({
            id: `a-${row.id}`,
            role: 'assistant',
            content: row.answer,
            timestamp: timeStr
          });
        });
        setChatHistory(messages);
      }
    } catch (err) {
      console.error("Failed to load tutor chat history:", err);
    }
  };

  const checkOllamaStatus = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setOllamaInfo(data);
      }
    } catch (e) {
      console.error("Failed to query Ollama daemon health status on local port:", e);
    }
  };

  React.useEffect(() => {
    checkOllamaStatus();
    fetchTutorHistory();
  }, []);

  // Text-To-Speech synthesizer functions
  const speakVoice = (text: string, voiceCode: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Clean up markdown markers before speaking
    const cleanText = text
      .replace(/[\*#_`~]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .trim();

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceCode;
    
    // Fallback for pronunciation
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(voiceCode.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setAssistantState('speaking');
    };

    utterance.onend = () => {
      setAssistantState('idle');
    };

    utterance.onerror = () => {
      setAssistantState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAssistantState('idle');
  };

  // Web Speech API Microphone Dictation integration
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [audioBars, setAudioBars] = useState<number[]>([15, 15, 15, 15]);
  const recognitionRef = React.useRef<any>(null);
  const initialTextRef = React.useRef<string>('');

  // Continuous speech-to-text automation loop
  React.useEffect(() => {
    if (isVoiceModeEnabled && !isListening && !isLoading) {
      const timer = setTimeout(() => {
        startListening();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isVoiceModeEnabled, isListening, isLoading]);

  React.useEffect(() => {
    let timer: any;
    if (isListening) {
      timer = setInterval(() => {
        setAudioBars([
          Math.floor(Math.random() * 55) + 20, // Bar 1 height %
          Math.floor(Math.random() * 85) + 15, // Bar 2 height %
          Math.floor(Math.random() * 70) + 25, // Bar 3 height %
          Math.floor(Math.random() * 50) + 15, // Bar 4 height %
        ]);
      }, 100);
    } else {
      setAudioBars([15, 15, 15, 15]);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isListening]);

  const startListening = () => {
    setVoiceError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Speech Recognition is not supported by your browser. Please use Chrome or Safari.");
      setIsVoiceModeEnabled(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLang.code; // Dynamic state-bound recognition language

      initialTextRef.current = message;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        const base = initialTextRef.current.trim();
        setMessage(base ? `${base} ${transcript.trim()}` : transcript.trim());
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'aborted') {
          return;
        }
        if (event.error === 'no-speech') {
          console.warn('Speech recognition timed out with no-speech.');
        } else {
          console.error('Speech recognition error:', event);
        }
        if (event.error === 'not-allowed') {
          setVoiceError("Microphone access is denied. Check your browser/system microphone permissions.");
          setIsVoiceModeEnabled(false);
        } else if (event.error !== 'no-speech') {
          setVoiceError(`Audio dictation error: ${event.error}`);
        }
        if (recognitionRef.current === recognition) {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (recognitionRef.current === recognition) {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error('Speech recognition start failed:', e);
      setVoiceError("Microphone initialization failed/unsupported.");
      setIsListening(false);
      setIsVoiceModeEnabled(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsVoiceModeEnabled(false);
      stopListening();
    } else {
      startListening();
    }
  };

  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const sampleQuestions = [
    { text: "Define displacement current and distinguish it from conduction current with formulas.", chapterId: 2, bloom: "Remember" },
    { text: "Explain the inconsistency of Ampere's circuital law and how Maxwell resolved it.", chapterId: 2, bloom: "Understand" },
    { text: "For an EM wave propagating along z-axis, write down the sinusoidal equations of E and B fields.", chapterId: 2, bloom: "Apply" },
    { text: "Why standard glass windows act as a complete barrier to skin tanning or sunburns?", chapterId: 2, bloom: "Analyze" },
    { text: "State Maxwell's four equations in vacuum and briefly write down what physical laws they represent.", chapterId: 2, bloom: "Evaluate" }
  ];

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
      // Default to Kannada
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

  const handleSend = async (customMessage?: string) => {
    stopListening();
    const textQuery = customMessage || message;
    if (!textQuery.trim()) return;

    setIsLoading(true);
    setMessage('');

    // A: Detect dynamic language shift command if any
    const targetLang = detectLanguageSwitch(textQuery);
    let activeLanguageToUse = selectedLang;
    let actualQueryToPost = textQuery;

    if (targetLang) {
      activeLanguageToUse = targetLang;
      setSelectedLang(targetLang);

      const cleanedQuery = cleanQueryTextFromLanguageTrigger(textQuery);
      if (!cleanedQuery || cleanedQuery === "explain" || cleanedQuery === "speak" || cleanedQuery.length < 3) {
        // Just language transition greeting
        const userMsgId = `query-${Date.now()}`;
        const userMsg: ChatMessage = {
          id: userMsgId,
          role: 'user',
          content: textQuery,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const assistantMsg: ChatMessage = {
          id: `msg-agent-${Date.now()}`,
          role: 'assistant',
          content: `🌟 **Language updated to ${targetLang.name}**\n\n${targetLang.greeting}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatHistory(prev => [...prev, userMsg, assistantMsg]);
        setIsLoading(false);
        onAddScore(5);
        speakVoice(targetLang.greeting, targetLang.code);
        return;
      } else {
        actualQueryToPost = cleanedQuery;
      }
    }

    const userMsgId = `msg-user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);

    // Create a placeholder assistant message that we'll fill token-by-token
    const assistantMsgId = `msg-agent-${Date.now()}`;
    const placeholderMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      thinking: '⏳ Connecting to local AI model…',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, placeholderMsg]);
    setStreamingMsgId(assistantMsgId);

    try {
      const promptCombined = `Student Question: "${actualQueryToPost}"\n\n${activeLanguageToUse.promptSuffix}\n\nAct as a friendly, expert Karnataka Board Physics Tutor. Write your answers with equations if relevant.`;

      const activeToken = localStorage.getItem('tim_token');
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          message: promptCombined,
          originalQuery: actualQueryToPost,
          chapterId: Number(chapterId),
          bloomLevel: bloomLevel === 'All' ? '' : bloomLevel,
          includeExample
        })
      });

      if (!response.ok) {
        throw new Error('Problem reaching server interface.');
      }

      // Read the SSE stream token by token
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let thinkingText = '🧠 Generating answer…';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by double newlines
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || ''; // keep incomplete last part

        for (const part of parts) {
          const eventMatch = part.match(/^event: (\w+)/);
          const dataMatch = part.match(/^data: (.+)$/m);
          if (!dataMatch) continue;
          let parsed: any;
          try { parsed = JSON.parse(dataMatch[1]); } catch { continue; }

          const eventType = eventMatch?.[1] ?? 'token';

          if (eventType === 'thinking') {
            thinkingText = parsed.thinking;
            setChatHistory(prev => prev.map(m =>
              m.id === assistantMsgId ? { ...m, thinking: thinkingText } : m
            ));
          } else if (eventType === 'token') {
            accumulatedContent += parsed.token;
            const snapshot = accumulatedContent;
            setChatHistory(prev => prev.map(m =>
              m.id === assistantMsgId ? { ...m, content: snapshot } : m
            ));
          } else if (eventType === 'done') {
            // Finalize
            setChatHistory(prev => prev.map(m =>
              m.id === assistantMsgId
                ? { ...m, content: accumulatedContent || m.content, thinking: thinkingText }
                : m
            ));
          } else if (eventType === 'error') {
            throw new Error(parsed.message || 'Streaming error');
          }
        }
      }

      // Auto-expand thinking
      setShowThinking(prev => ({ ...prev, [assistantMsgId]: true }));
      onAddScore(5);
      speakVoice(accumulatedContent, activeLanguageToUse.code);

    } catch (error: any) {
      console.error(error);
      const errorContent = `📚 **Physics Tutor Alert:** I encountered a temporary connection issue. Let's review the textbook concepts directly!\n\nPlease double-check that your question is clear, and try again. If the issue persists, feel free to refer to the official chapters in the **Chapters** tab for structured study notes and formulas.`;
      setChatHistory(prev => prev.map(m =>
        m.id === assistantMsgId ? { ...m, content: errorContent, thinking: '❌ Connection error.' } : m
      ));
    } finally {
      setStreamingMsgId(null);
      setIsLoading(false);
    }
  };

  const toggleThinking = (id: string) => {
    setShowThinking(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in" id="ask-tutor-container">
      {/* Search parameters column */}
      <div className="space-y-6 lg:col-span-1" id="ask-tutor-sidebar">
        <div className="glass-panel p-5 space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
            <Search className="w-5 h-5 text-[#FF6B00]" />
            <h2 className="text-sm font-bold text-slate-800">Tutor Settings</h2>
          </div>

          {/* Chapter Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Chapter</label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:border-[#FF6B00] transition-all font-semibold"
            >
              {CHANNELS_PUC_DATA.map(c => (
                <option key={c.id} value={c.id} className="bg-white text-slate-800 text-xs">Ch {c.id}: {c.name}</option>
              ))}
            </select>
          </div>

          {/* Include Sample Problem toggler */}
          <div className="flex items-center justify-between p-3.5 bg-orange-50/50 rounded-xl border border-orange-100">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-800 block">Include Examples</label>
              <span className="text-[10px] text-slate-500 block font-medium">Provide mathematical problems</span>
            </div>
            <input
              type="checkbox"
              checked={includeExample}
              onChange={(e) => setIncludeExample(e.target.checked)}
              className="w-4 h-4 accent-[#FF6B00] cursor-pointer"
            />
          </div>
        </div>

        {/* Dynamic Board recommendation sample questions */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Suggested Questions</h2>
          </div>
          <div className="space-y-2.5">
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                type="button"
                className="w-full p-3 font-semibold text-left text-xs bg-white border border-slate-100 hover:border-orange-300 hover:bg-orange-50/50 text-slate-700 hover:text-[#FF6B00] transition-all rounded-xl cursor-pointer block leading-relaxed shadow-sm"
                onClick={() => {
                  setChapterId(sq.chapterId);
                  setBloomLevel(sq.bloom);
                  handleSend(sq.text);
                }}
              >
                {sq.text}
                <div className="flex gap-2 items-center mt-2 text-[9px] font-black text-[#FF6B00] uppercase tracking-wider">
                  <span>Ch {sq.chapterId}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation History */}
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-slate-500" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Chat History</h2>
          </div>
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
            {chatHistory.filter(h => h.role === 'user').length === 0 ? (
              <span className="text-[10px] text-slate-400 block font-bold">No history logs in this session.</span>
            ) : (
              chatHistory.filter(h => h.role === 'user').map((h, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMessage(h.content)}
                  className="w-full text-left p-2 border border-slate-150 rounded-lg hover:border-orange-300 hover:bg-orange-50/50 text-[10.5px] font-semibold text-slate-650 truncate block"
                >
                  {h.content}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main chat history section */}
      <div className="lg:col-span-3 flex flex-col h-[650px] bg-white rounded-3xl border border-slate-205 overflow-hidden shadow-sm" id="chat-frame">
        {/* Chat top header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 text-[#FF6B00] rounded-xl border border-orange-100">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-950">TIM Physics Tutor Platform</h2>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-emerald-500"></span> TIM Physics Assistant Ready
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 bg-white text-[#FF6B00] border border-slate-200 rounded-full">NCERT Aligned</span>
        </div>

        {/* Chat feed content panel */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar text-slate-800 bg-slate-50" id="ask-tutor-feed">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF6B00] p-4 border border-slate-200 shadow-sm">
                <Book className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Start Answering Physics Query</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Choose parameters on the left or type your inquiry below. Our intelligent assistant extracts key formulas and definitions straight from the NCERT Class 11 physics textbook chapters.
              </p>
            </div>
          ) : (
            chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 max-w-4xl ${msg.role === 'user' ? 'justify-end ml-auto text-white' : 'mr-auto text-slate-800'}`}
              >
                {/* Assistant avatar icon */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm border border-[#FF6B00]">
                    AI
                  </div>
                )}

                <div className="space-y-2 max-w-full">
                  <div className={`p-5 rounded-2xl relative ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] rounded-tr-none shadow-md shadow-orange-500/15'
                      : 'bg-white rounded-tl-none border border-slate-200 shadow-sm'
                  }`}>
                    {/* Message content text blocks */}
                    <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-medium font-sans text-slate-800">
                      {msg.content}
                      {/* Blinking cursor while this message is actively streaming */}
                      {streamingMsgId === msg.id && (
                        <span
                          style={{
                            display: 'inline-block',
                            width: '2px',
                            height: '1em',
                            background: '#FF6B00',
                            marginLeft: '2px',
                            verticalAlign: 'text-bottom',
                            animation: 'blink 0.8s step-start infinite'
                          }}
                        />
                      )}
                    </div>

                    <span className="text-[9px] block text-right mt-2 font-mono font-bold text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {/* User avatar icon */}
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6B00] flex items-center justify-center text-xs font-black shrink-0 shadow-sm border border-orange-200">
                    ME
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loader Spinner */}
          {isLoading && (
            <div className="flex gap-4 mr-auto max-w-4xl" id="chat-progress">
              <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center text-xs font-bold shrink-0 animate-pulse">
                AI
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-orange-300 animate-bounce delay-300"></div>
                <span className="text-xs text-slate-500 font-extrabold ml-1 leading-none">AI Tutor thinking & preparing your answer...</span>
              </div>
            </div>
          )}
        </div>

        {/* Query Input text area */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3.5 shrink-0" id="query-submit-box">
          {voiceError && (
            <div className="flex items-center justify-between p-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl animate-fade-in" id="voice-error-banner">
              <span>{voiceError}</span>
              <button
                type="button"
                onClick={() => setVoiceError(null)}
                className="text-rose-500 hover:text-rose-700 cursor-pointer p-0.5 animate-pulse"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Voice Mode custom configuration control bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white rounded-xl p-3 border border-slate-200 shadow-sm" id="voice-mode-controls-panel">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold transition-all uppercase tracking-wider ${isVoiceModeEnabled ? 'text-[#FF6B00]' : 'text-slate-400'}`}>
                {isVoiceModeEnabled ? "⚡ Continuous Voice Mode Live" : "Continuous voice mode disabled"}
              </span>
              {isListening && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-[10px] text-rose-700 font-bold animate-pulse" id="voice-pulse-status">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span>Mic active</span>
                </div>
              )}
              {/* Dynamic Active Language Indicator Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[10px] text-[#FF6B00] font-bold" id="active-lang-indicator">
                <Globe className="w-3.5 h-3.5 animate-spin duration-3000 text-[#FF6B00]" />
                <span>{selectedLang.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Hands-free select list of languages as manual override list */}
              <select
                value={selectedLang.code}
                onChange={(e) => {
                  const matched = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value)!;
                  setSelectedLang(matched);
                }}
                className="bg-white border border-slate-200 text-slate-850 text-[11px] font-bold rounded-lg px-2 py-1 outline-none focus:border-[#FF6B00] transition-colors cursor-pointer text-slate-800"
                id="manual-lang-override-select"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.native}</option>
                ))}
              </select>

              <label className="relative inline-flex items-center cursor-pointer select-none" id="toggle-voice-mode-wrapper">
                <input
                  type="checkbox"
                  checked={isVoiceModeEnabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsVoiceModeEnabled(checked);
                    if (checked) {
                      startListening();
                    } else {
                      stopListening();
                    }
                  }}
                  className="sr-only peer"
                  id="toggle-voice-mode"
                />
                <div className="w-[38px] h-[20px] bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[14px] after:w-[14px] after:transition-all peer-checked:bg-[#FF6B00] relative transition-all duration-150 border border-slate-200"></div>
                <span className="ml-2.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 peer-checked:text-[#FF6B00] transition-colors">
                  Toggle Voice Mode
                </span>
              </label>
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap gap-1.5 pb-2" id="quick-action-tags">
            {[
              { label: "Explain Concepts", text: "Explain the core physics concepts of Chapter " },
              { label: "Solve Numericals", text: "Solve a numerical problem from Chapter step-by-step " },
              { label: "Generate Notes", text: "Generate detailed study notes for Chapter " },
              { label: "Generate Quiz", text: "Generate a multiple-choice quiz challenge for Chapter " },
              { label: "Translate to Kannada", text: "Translate the previous response into Kannada script " },
              { label: "Recommend Next Topic", text: "Recommend the next topic to study after Chapter " }
            ].map((action, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const chName = CHANNELS_PUC_DATA.find(c => c.id === chapterId)?.name || 'this chapter';
                  setMessage(action.text + chName);
                }}
                className="px-3 py-1.5 bg-orange-50 border border-orange-100 text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer select-none"
              >
                {action.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3"
          >
            <div className="relative flex-1 flex border-0">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything about 1st PUC / Class 11 Physics (formulas, proofs, laws)..."
                disabled={isLoading}
                className={`w-full pl-4 py-3 border border-slate-200 focus:border-[#FF6B00] bg-white text-slate-850 text-sm focus:outline-none rounded-xl transition-all ${
                  isListening ? 'pr-24' : (assistantState === 'speaking' ? 'pr-24' : 'pr-12')
                }`}
                id="message-input-field"
              />
              {isListening && (
                <div
                  className="absolute right-13 top-1/2 -translate-y-1/2 flex items-end gap-[3px] h-5 px-1.5 border-r border-slate-200"
                  id="audio-intensity-indicator"
                >
                  <span className="w-1 bg-rose-500 rounded-full transition-all duration-100" style={{ height: `${audioBars[0]}%` }}></span>
                  <span className="w-1 bg-red-400 rounded-full transition-all duration-100" style={{ height: `${audioBars[1]}%` }}></span>
                  <span className="w-1 bg-rose-450 rounded-full transition-all duration-100" style={{ height: `${audioBars[2]}%` }}></span>
                  <span className="w-1 bg-[#FF6B00] rounded-full transition-all duration-100" style={{ height: `${audioBars[3]}%` }}></span>
                </div>
              )}
              {assistantState === 'speaking' && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-2 bg-rose-50 rounded-lg cursor-pointer transition-all flex items-center justify-center border border-rose-250 hover:bg-rose-100"
                  title="Stop Assistant speaking explanation"
                  id="stop-explanation-btn"
                >
                  <Square className="w-3.5 h-3.5 fill-[#FF6B00] text-[#FF6B00]" />
                </button>
              )}
              <button
                type="button"
                onClick={toggleListening}
                disabled={isLoading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg cursor-pointer transition-all ${
                  isListening
                    ? 'bg-rose-50 text-rose-500 border border-rose-200 scale-105 shadow-[0_0_12px_rgba(244,63,94,0.15)] animate-pulse'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={isListening ? 'Stop listening' : 'Dictate with microphone'}
                id="voice-dictation-btn"
              >
                {isListening ? <MicOff className="w-5 h-5 text-rose-550" /> : <Mic className="w-5 h-5 text-slate-400" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="px-5 py-3 font-extrabold bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white hover:brightness-110 duration-200 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer text-xs md:text-sm shadow-md shrink-0 uppercase tracking-wider"
              id="submit-query-btn"
            >
              Get Answer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
