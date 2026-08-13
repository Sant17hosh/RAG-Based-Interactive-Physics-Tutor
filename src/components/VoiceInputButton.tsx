import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  currentValue: string;
  id?: string;
  label?: string;
}

export default function VoiceInputButton({ 
  onTranscript, 
  currentValue, 
  id = 'voice-input-btn', 
  label = 'Voice Answer Mode' 
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [audioBars, setAudioBars] = useState<number[]>([15, 15, 15, 15]);
  const recognitionRef = useRef<any>(null);
  const initialTextRef = useRef<string>('');

  useEffect(() => {
    let timer: any;
    if (isListening) {
      timer = setInterval(() => {
        setAudioBars([
          Math.floor(Math.random() * 55) + 20,
          Math.floor(Math.random() * 85) + 15,
          Math.floor(Math.random() * 70) + 25,
          Math.floor(Math.random() * 50) + 15,
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
      setVoiceError("Speech dictation is not fully supported on this browser. Try Chrome or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      initialTextRef.current = currentValue;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        const base = initialTextRef.current.trim();
        const fullText = base ? `${base} ${transcript.trim()}` : transcript.trim();
        onTranscript(fullText);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'aborted') {
          return;
        }
        console.error('Textarea voice dictation error:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceError("Microphone access denied. Check site permissions.");
        } else if (event.error !== 'no-speech') {
          setVoiceError(`Voice input error: ${event.error}`);
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
      console.error('Dictation fail:', e);
      setVoiceError("Failed to start voice system.");
      setIsListening(false);
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
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-1.5" id={`${id}-wrapper`}>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={toggleListening}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all select-none cursor-pointer border ${
            isListening 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)] animate-pulse'
              : 'bg-white/5 text-white/70 border-white/10 hover:border-sky-505 hover:border-sky-550 hover:bg-white/8 hover:text-white'
          }`}
          id={id}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5 animate-bounce text-rose-400" />
              <span>Mic Active</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>{label}</span>
            </>
          )}
        </button>

        {isListening && (
          <div className="flex items-center gap-1.5 bg-rose-500/5 px-2.5 py-1 rounded-lg border border-rose-500/10 text-[10px] text-rose-350 select-none animate-pulse">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
            <span className="text-rose-300 font-bold">Speaking...</span>
            <div className="flex items-end gap-[2px] h-3 ml-2 shrink-0">
              <span className="w-0.5 bg-rose-455 bg-rose-400 rounded-full transition-all duration-100" style={{ height: `${audioBars[0] * 0.7}%` }}></span>
              <span className="w-0.5 bg-rose-455 bg-rose-400 rounded-full transition-all duration-100" style={{ height: `${audioBars[1] * 0.7}%` }}></span>
              <span className="w-0.5 bg-rose-455 bg-rose-400 rounded-full transition-all duration-100" style={{ height: `${audioBars[2] * 0.7}%` }}></span>
            </div>
          </div>
        )}
      </div>

      {voiceError && (
        <div className="flex items-center justify-between p-2 text-[10px] text-rose-300 bg-rose-500/5 border border-rose-500/10 rounded-lg animate-fade-in">
          <span>{voiceError}</span>
          <button
            type="button"
            onClick={() => setVoiceError(null)}
            className="text-white/40 hover:text-white cursor-pointer ml-1 p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
