import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, 
  Tv, Award, BookOpen, GraduationCap, FastForward, CheckCircle, Zap,
  Youtube, Info, AlertTriangle, MonitorPlay
} from 'lucide-react';

export type TabId = 
  | 'faraday-laws' | 'magnetic-flux' | 'faraday-experiments' | 'lenzs-law' 
  | 'self-induction' | 'mutual-induction' | 'motional-emf' 
  | 'eddy-currents' | 'ac-generator'
  | 'displacement-current' | 'em-wave-propagation' | 'spectrum-radar';

interface VideoScriptSegment {
  startPercent: number;
  endPercent: number;
  text: string;
}

interface VideoConfig {
  id: TabId;
  title: string;
  durationString: string;
  totalDurationMs: number;
  youtubeId: string;
  segments: VideoScriptSegment[];
}

const videosConfig: Record<TabId, VideoConfig> = {
  'faraday-laws': {
    id: 'faraday-laws',
    title: "Michael Faraday's Laws of Induction",
    durationString: "01:20",
    totalDurationMs: 80000,
    youtubeId: "vxU8g_SMCjg",
    segments: [
      { startPercent: 0, endPercent: 18, text: "Welcome! Today we study Faraday's central breakthroughs in generating electricity from mechanics." },
      { startPercent: 18, endPercent: 42, text: "A pre-wound copper solenoid is connected directly to a center-zero galvanometer with no external battery." },
      { startPercent: 42, endPercent: 68, text: "Faraday's First Law teaches us: an electromotive force (EMF) is induced ONLY when the magnetic flux lines intersecting the coil are actively changing!" },
      { startPercent: 68, endPercent: 88, text: "Faraday's Second Law defines magnitude: e = -N · (ΔΦ / Δt). More wire turns 'N' and rapid motion directly double the voltage!" },
      { startPercent: 88, endPercent: 100, text: "Board Exam Tip: Remember the negative sign represents Lenz's opposition. Box this formula to secure maximum marks!" }
    ]
  },
  'magnetic-flux': {
    id: 'magnetic-flux',
    title: "Visualizing Mathematical Magnetic Flux",
    durationString: "01:15",
    totalDurationMs: 75000,
    youtubeId: "K8mR7vK-408",
    segments: [
      { startPercent: 0, endPercent: 15, text: "Before calculating induction, let us mathematically formulate Magnetic Flux, denoted by the Greek letter Phi (Φ)." },
      { startPercent: 15, endPercent: 40, text: "Magnetic Flux represents the count of magnetic field lines crossing through a specified loop surface. The SI unit is the Weber (Wb)." },
      { startPercent: 40, endPercent: 68, text: "The definition is given by: Φ = B · A · cos(θ). Where theta is the angle between flux lines and the area vector perpendicular to the loop." },
      { startPercent: 68, endPercent: 88, text: "At θ = 0°, cos(θ) is maximum, giving maximum flux. At θ = 90°, the loop is parallel to the lines, reducing the flux to exactly zero!" },
      { startPercent: 88, endPercent: 100, text: "To induce a current, we must vary any of these: increase/decrease magnetic intensity B, scale coil area A, or rotate angle θ." }
    ]
  },
  'faraday-experiments': {
    id: 'faraday-experiments',
    title: "Faraday's Core Laboratory Experiments",
    durationString: "01:30",
    totalDurationMs: 90000,
    youtubeId: "pQptD7p7_AM",
    segments: [
      { startPercent: 0, endPercent: 18, text: "Let's review Michael Faraday's three classic historic experimental setups demonstrating inductive current." },
      { startPercent: 18, endPercent: 42, text: "Experiment 1: Thrusting a strong NdFeB bar magnet into a wire solenoid creates a sharp instant current impulse. Pulling it away reverses the polarity!" },
      { startPercent: 42, endPercent: 68, text: "Experiment 2: The magnet is replaced by a primary coil connected to a battery. Moving this primary coil closer or further induces EMF in the stationary secondary." },
      { startPercent: 68, endPercent: 88, text: "Experiment 3: Both coils are stationary, but we insert a tap key. Closing or opening the switch sparks instant transient needle deflections!" },
      { startPercent: 88, endPercent: 100, text: "These trials proved that absolute motion is irrelevant; the key to induction is the changing magnetic linkage over time." }
    ]
  },
  'lenzs-law': {
    id: 'lenzs-law',
    title: "Lenz's Law & Conservation of Energy",
    durationString: "01:25",
    totalDurationMs: 85000,
    youtubeId: "xxzEf8Y7N_A",
    segments: [
      { startPercent: 0, endPercent: 18, text: "Lenz's Law defines the direction of induced current, reflecting a fundamental conservation rule." },
      { startPercent: 18, endPercent: 45, text: "The law states: 'The induced current always flows in such a direction that its own magnetic field opposes the original flux change that created it.'" },
      { startPercent: 45, endPercent: 70, text: "If you push a North pole inward, the coil generates an induced North pole on its facing side to repel your movement, creating anti-clockwise current." },
      { startPercent: 70, endPercent: 90, text: "According to the Law of Conservation of Energy, mechanical work done in fighting this repulsion is transformed into heating and electrical energy." },
      { startPercent: 90, endPercent: 100, text: "Exam Tip: State boards love this question! Show how mechanical energy expended equals the electrical energy generated in the circuit." }
    ]
  },
  'self-induction': {
    id: 'self-induction',
    title: "Self-Induction & Electromagnetic Inertia",
    durationString: "01:15",
    totalDurationMs: 75000,
    youtubeId: "S7vD4FmK_Xo",
    segments: [
      { startPercent: 0, endPercent: 20, text: "Self-induction is the phenomenon where a changing current in an isolated coil induces an opposite EMF within itself." },
      { startPercent: 20, endPercent: 45, text: "This opposing induced EMF is often called 'Back EMF'. It acts like electrical inertia, opposing any changes in current intensity." },
      { startPercent: 45, endPercent: 72, text: "The self-induced EMF is e = -L · (dI/dt). L is the self-inductance in Henries (H). For a solenoid, L = μ₀ · N² · A / l." },
      { startPercent: 72, endPercent: 90, text: "On turning switches on, back-EMF fights current growth. On opening switches, it produces high voltage spikes trying to sustain current flow." },
      { startPercent: 90, endPercent: 100, text: "The magnetic field energy accumulated inside a self-inductor is modeled by U = 1/2 * L * I²." }
    ]
  },
  'mutual-induction': {
    id: 'mutual-induction',
    title: "Mutual Induction & Transformer Linkage",
    durationString: "01:20",
    totalDurationMs: 80000,
    youtubeId: "K_o_W7I_9cE",
    segments: [
      { startPercent: 0, endPercent: 20, text: "Mutual induction is the wireless generation of EMF in a secondary coil due to current fluctuations inside a neighboring primary coil." },
      { startPercent: 20, endPercent: 45, text: "The magnetic flux linked with secondary loops is proportioned to primary current: Φ₂ = M · I₁. M represents the Mutual Inductance coeffecient." },
      { startPercent: 45, endPercent: 72, text: "The induced voltage output in coil 2 is e₂ = -M · (dI₁ / dt). This is the key principle governing voltage transformers." },
      { startPercent: 72, endPercent: 90, text: "Coeffecient M depends on geometric distance, overlap alignment, turns ratio, and insertion of iron cores." },
      { startPercent: 90, endPercent: 100, text: "Winding primary and secondary coils concentric on a closed soft-iron core ensures maximum magnetic linkage and zero flux leakage." }
    ]
  },
  'motional-emf': {
    id: 'motional-emf',
    title: "Deriving Motional Electromagnetic Force",
    durationString: "01:30",
    totalDurationMs: 90000,
    youtubeId: "0K9eXG_lYks",
    segments: [
      { startPercent: 0, endPercent: 20, text: "Today we derive Motional EMF. Let's observe a conducting rod of length 'l' sliding on a U-shaped rail inside a magnetic field 'B'." },
      { startPercent: 20, endPercent: 45, text: "As the rod moves with velocity 'v', its swept area increases, which expands the magnetic flux inside the closed loop. The rate of flux change is B * dA/dt." },
      { startPercent: 45, endPercent: 70, text: "Since dA/dt = l * dx/dt = l * v, the induced voltage is e = -B * l * v. This potential can also be derived using the Lorentz force, F = q * (v x B)." },
      { startPercent: 70, endPercent: 90, text: "Free charge carriers in the moving rod experience Lorentz forces, causing them to pool at one end, which generates an electric field and voltage." },
      { startPercent: 90, endPercent: 100, text: "Ensure you can reproduce this exact rail derivation. It is a highly valued 5-mark question in Class 11 and 12 board evaluations." }
    ]
  },
  'eddy-currents': {
    id: 'eddy-currents',
    title: "Understanding Eddy Currents & Magnetic Braking",
    durationString: "01:15",
    totalDurationMs: 75000,
    youtubeId: "LnPcoK7w_tE",
    segments: [
      { startPercent: 0, endPercent: 20, text: "Eddy currents are circulating loops of current induced within the volume of solid bulk metal pieces, rather than thin wire coils." },
      { startPercent: 20, endPercent: 45, text: "When a metal plate swings like a pendulum into a magnetic field, the changing flux induces concentric Eddy loops. Their magnetic fields oppose the motion." },
      { startPercent: 45, endPercent: 70, text: "The plate halts instantly due to this electromagnetic damping. This is used in high-speed trains as smooth magnetic brakes." },
      { startPercent: 70, endPercent: 90, text: "To minimize these heat losses in motor cores, we laminate the metal sheets or cut slots to physically interrupt and shrink the Eddy current paths." },
      { startPercent: 90, endPercent: 100, text: "Remember options for applications: electromagnetic damping, speedometers, electric brakes, and high-efficiency induction furnaces." }
    ]
  },
  'ac-generator': {
    id: 'ac-generator',
    title: "How an Alternator Generates AC Power",
    durationString: "01:30",
    totalDurationMs: 90000,
    youtubeId: "gQyamjPrw50",
    segments: [
      { startPercent: 0, endPercent: 18, text: "Let's explore the AC Generator! It converts mechanical rotation into alternating voltage using electromagnetic induction." },
      { startPercent: 18, endPercent: 40, text: "An armature coil with N turns is rotated at constant speed omega inside magnetic field B. The instantaneous flux is Φ = N * B * A * cos(omega * t)." },
      { startPercent: 40, endPercent: 68, text: "Taking the negative derivative, the induced voltage is e = N * B * A * omega * sin(omega * t). This is the standard alternating sine wave!" },
      { startPercent: 68, endPercent: 88, text: "Slip rings rotate continuously with the armature, while stationary carbon brushes press against them to transmit the output current out of the casing." },
      { startPercent: 88, endPercent: 100, text: "Thus, the current reverses direction twice per rotation. The peak voltage is e₀ = N * B * A * omega. This completes our induction lab syllabus!" }
    ]
  },
  // NEW CHAPTER 8 DEFUNCTIONS
  'displacement-current': {
    id: 'displacement-current',
    title: "Capacitor Inconsistency & Displacement Current",
    durationString: "01:20",
    totalDurationMs: 80000,
    youtubeId: "4H9C2_hPq8s",
    segments: [
      { startPercent: 0, endPercent: 20, text: "Welcome to Chapter 8! Let's resolve the historic contradiction inside a charging parallel plate capacitor." },
      { startPercent: 20, endPercent: 45, text: "In conduction wires, conduction current I_c flows. Inside the gap, no charges pass, yet a changing electric flux exists." },
      { startPercent: 45, endPercent: 75, text: "Maxwell defined displacement current: I_d = ε₀ · (dΦ_E / dt). Inside the plates, this changing field acts as the virtual current!" },
      { startPercent: 75, endPercent: 90, text: "This unified setup gives the Ampere-Maxwell Law: ∮ B · dl = μ₀ (I_c + I_d)." },
      { startPercent: 90, endPercent: 100, text: "Exam Point: Displacement current has identical magnetic effects as conduction current, ensuring electrical path continuity!" }
    ]
  },
  'em-wave-propagation': {
    id: 'em-wave-propagation',
    title: "Coupled 3D Sine Field Wave Propagation",
    durationString: "01:30",
    totalDurationMs: 90000,
    youtubeId: "K402X3b4Ryo",
    segments: [
      { startPercent: 0, endPercent: 20, text: "Let's explore the coupled spatial mathematics of propagating 3D electromagnetic waves." },
      { startPercent: 20, endPercent: 50, text: "Electric fields oscillate along the x-axis: E = E₀ sin(kz - ωt). Magnetic fields oscillate on the y-axis: B = B₀ sin(kz - ωt)." },
      { startPercent: 50, endPercent: 75, text: "Both fields are perfectly perpendicular to each other, and perpendicular to the z-axis propagation path, confirming the transverse nature!" },
      { startPercent: 75, endPercent: 90, text: "The index speed relation is constant in vacuum: c = E₀ / B₀ = 1 / √(μ₀ε₀) ≈ 3 × 10⁸ m/s." },
      { startPercent: 90, endPercent: 100, text: "Observe how these oscillating fields continuously regenerate each other wirelessly across space." }
    ]
  },
  'spectrum-radar': {
    id: 'spectrum-radar',
    title: "The Electromagnetic Spectrum & Radar Waves",
    durationString: "01:15",
    totalDurationMs: 75000,
    youtubeId: "cfXzwh3KadE",
    segments: [
      { startPercent: 0, endPercent: 25, text: "Let's review the Electromagnetic Spectrum, ranging from lowest frequency Radio waves to highest energy Gamma rays." },
      { startPercent: 25, endPercent: 55, text: "Mnemonic Tip: Remember 'Ganguly's team Xcept Uvaraj Visited IRfan's Marriage with Radha' to write this order flawlessly." },
      { startPercent: 55, endPercent: 80, text: "Radar technology uses short microwaves because their short wavelengths bounce off metallic hulls with minimal diffraction!" },
      { startPercent: 80, endPercent: 100, text: "All spectrum bands travel exactly at the speed of light 'c' in vacuum, regardless of their individual frequencies." }
    ]
  }
};

interface ConceptVideoPlayerProps {
  tabId: TabId;
}

export default function ConceptVideoPlayer({ tabId }: ConceptVideoPlayerProps) {
  const videoConfig = videosConfig[tabId] || videosConfig['faraday-laws'];
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(80);
  const [showFullTranscript, setShowFullTranscript] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number | null>(null);

  // Restart video when active tab changes
  useEffect(() => {
    setIsPlaying(false);
    setProgressPercent(0);
    lastTickTimeRef.current = null;
  }, [tabId]);

  // Find the active subtitle text based on current percentage progress
  const getCurrentTranscriptText = () => {
    const currentSeg = videoConfig.segments.find(
      (s) => progressPercent >= s.startPercent && progressPercent < s.endPercent
    );
    return currentSeg ? currentSeg.text : "Loading lecture tutorial track...";
  };

  const currentSegmentText = getCurrentTranscriptText();

  // Voice synthesis narration hook using SpeechSynthesis (representing Whisper Large V3 optimized style)
  useEffect(() => {
    if (!voiceEnabled || !isPlaying || !currentSegmentText) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel previous phrase instantly to maintain strict real-time sync with simulation
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(currentSegmentText);
      
      // Match speaker rate dynamically to simulation playback speed
      utterance.rate = playbackSpeed;
      
      // Select preferred premium voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) 
                            || voices.find(v => v.lang.startsWith('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentSegmentText, isPlaying, voiceEnabled, playbackSpeed]);

  // Video progress ticking hook
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTickTimeRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (!lastTickTimeRef.current) {
        lastTickTimeRef.current = now;
      }
      const elapsed = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      const durationMs = videoConfig.totalDurationMs;
      const progressDelta = (elapsed / durationMs) * 100 * playbackSpeed;
      
      setProgressPercent((prev) => {
        const next = prev + progressDelta;
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, videoConfig.totalDurationMs, tabId]);

  // BRIGHT THEME rendering of custom animations depending on progressPercent
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI display
    const width = 480;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    const angle = (progressPercent * Math.PI) / 18; // generic rotation factor
    const phase = progressPercent / 100;

    // Clear background - BRIGHT Whiteboard LOOK
    ctx.fillStyle = '#faf9f5'; // milky sand classroom whiteboard
    ctx.fillRect(0, 0, width, height);

    // Draw whiteboard grid lines (subtle custom grid)
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Active marker board edge
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, width - 8, height - 8);

    // Bright chalkboard labels
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#ea580c'; // sharp orange
    ctx.fillText("🎨 WHITEBOARD SIMULATED LECTURE", 15, 20);

    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText(`TIME: ${(phase * (videoConfig.totalDurationMs / 1000)).toFixed(1)}s / ${(videoConfig.totalDurationMs / 1000).toFixed(0)}s`, width - 130, 20);

    // Specific Physics renders
    switch(tabId) {
      case 'faraday-laws': {
        // Draw primary coil in copper amber
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const cy = 120;
          const cx = 250 + i * 15;
          ctx.ellipse(cx, cy, 10, 35, 0, 0, Math.PI * 2);
        }
        ctx.stroke();

        // Connected wires
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(240, 155);
        ctx.lineTo(240, 190);
        ctx.lineTo(345, 190);
        ctx.lineTo(345, 155);
        ctx.stroke();

        // Voltmeter/Galvanometer
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(270, 175, 50, 30);
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(270, 175, 50, 30);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText("G (galv)", 276, 186);

        // Needle deflection oscillation
        const maxDeflect = isPlaying ? Math.sin(phase * Math.PI * 8) * 15 : 0;
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(295, 200);
        ctx.lineTo(295 + maxDeflect, 180);
        ctx.stroke();

        // Magnet pushing with vibrant colours
        const magnetX = Math.max(20, Math.min(210, 40 + (phase * 150)));// Sliding magnet
        ctx.fillStyle = '#dc2626'; // North
        ctx.fillRect(magnetX, 105, 40, 30);
        ctx.fillStyle = '#2563eb'; // South
        ctx.fillRect(magnetX + 40, 105, 40, 30);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText("N", magnetX + 15, 124);
        ctx.fillText("S", magnetX + 55, 124);

        // Magnetic Field lines (pulses)
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(magnetX + 20, 120, 60, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
        ctx.arc(magnetX + 20, 120, 35, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
        ctx.setLineDash([]);

        // Formula
        ctx.fillStyle = '#047857'; // emerald
        ctx.font = 'italic bold 12px serif';
        ctx.fillText(`e = -N · (dΦ/dt)`, 40, 65);
        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText("Dynamic magnetic coupling spike", 40, 80);
        break;
      }
      case 'magnetic-flux': {
        const loopAngle = Math.cos(phase * Math.PI * 2) * Math.PI / 2.5; // rotating loop
        
        // Draw flux field parallel lines
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
        ctx.lineWidth = 2.5;
        for (let y = 60; y <= 180; y += 25) {
          ctx.beginPath();
          ctx.moveTo(50, y);
          ctx.lineTo(430, y);
          ctx.stroke();
          // arrows
          ctx.beginPath();
          ctx.moveTo(420, y - 4);
          ctx.lineTo(430, y);
          ctx.lineTo(420, y + 4);
          ctx.fillStyle = 'rgba(14, 165, 233, 0.7)';
          ctx.fill();
        }

        // Draw loop in 3D perspective
        ctx.save();
        ctx.translate(240, 120);
        ctx.rotate(loopAngle);
        ctx.strokeStyle = '#be123c'; // deep rose-700
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 60, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Area Normal arrow
        ctx.strokeStyle = '#059669'; // green-600
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(60, 0);
        ctx.stroke();
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText("Normal A Vector", 45, -5);
        ctx.restore();

        // math highlights
        ctx.fillStyle = '#0f172a';
        ctx.font = 'italic bold 14px serif';
        const currentAngleDeg = Math.round(Math.abs(Math.cos(phase * Math.PI * 2) * 90));
        ctx.fillText(`Φ = B · A · cos(${currentAngleDeg}°)`, 60, 215);

        ctx.font = '10px monospace';
        ctx.fillStyle = '#ea580c';
        ctx.fillText(`Effective linking flux: ${(Math.abs(Math.cos(loopAngle)) * 100).toFixed(0)}%`, 60, 230);
        break;
      }
      case 'faraday-experiments': {
        // Draw C1 (Primary) and C2 (Secondary) coaxial
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.ellipse(130 + i * 15, 120, 12, 35, 0, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.fillStyle = '#7c3aed';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText("Primary coil C1", 110, 75);

        // Battery setup
        ctx.strokeStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(120, 155);
        ctx.lineTo(120, 185);
        ctx.lineTo(190, 185);
        ctx.lineTo(190, 155);
        ctx.stroke();

        // Switch key
        const isSwitchClosed = Math.round(phase * 10) % 2 === 0;
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(145, 180, 20, 10);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(145, 180, 20, 10);
        ctx.fillStyle = isSwitchClosed ? '#059669' : '#dc2626';
        ctx.fillText(isSwitchClosed ? "[ Switch CLOSED ]" : "[ Switch OPEN ]", 115, 215);

        // Coil 2
        ctx.strokeStyle = '#059669';
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.ellipse(300 + i * 15, 120, 14, 40, 0, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.fillStyle = '#059669';
        ctx.fillText("Secondary coil C2", 270, 72);

        // Galvanometer
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#94a3b8';
        ctx.strokeRect(300, 170, 42, 25);
        const deflection = isSwitchClosed ? (Math.sin(phase * Math.PI * 20) * 12) : 0;
        ctx.strokeStyle = '#e11d48';
        ctx.beginPath();
        ctx.moveTo(321, 192);
        ctx.lineTo(321 + deflection, 175);
        ctx.stroke();
        break;
      }
      case 'lenzs-law': {
        const direction = Math.sin(phase * Math.PI * 6) > 0 ? "approaching" : "receding";
        const mX = 100 + Math.sin(phase * Math.PI * 6) * 50;

        // Coil
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(280, 120, 15, 55, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Magnet
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(mX, 105, 30, 30);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(mX + 30, 105, 30, 30);
        ctx.fillStyle = '#ffffff';
        ctx.fillText("N", mX + 10, 124);
        ctx.fillText("S", mX + 42, 124);

        // Direction indicators
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        if (direction === "approaching") {
          ctx.arc(280, 120, 30, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();
          ctx.fillStyle = '#dc2626';
          ctx.fillText("Induced CCW (Repels Magnet)", 240, 50);
          ctx.fillText("REPELLING FORCE (F) ◀", 80, 160);
        } else {
          ctx.arc(280, 120, 30, Math.PI / 2, -Math.PI / 2);
          ctx.stroke();
          ctx.fillStyle = '#0284c7';
          ctx.fillText("Induced CW (Attracts Magnet)", 240, 50);
          ctx.fillText("ATTRACTING DRAG (F) ▶", 80, 160);
        }
        break;
      }
      case 'self-induction': {
        // Draw green inductor coil
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          ctx.ellipse(120 + i * 18, 120, 12, 35, 0, 0, Math.PI * 2);
        }
        ctx.stroke();

        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText("Inductor block (L)", 165, 75);

        const curr = Math.sin(phase * Math.PI * 4) + 1; // current
        const dI_dt = Math.cos(phase * Math.PI * 4);

        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 150);
        ctx.lineTo(80 + curr * 40, 150);
        ctx.stroke();
        ctx.fillStyle = '#2563eb';
        ctx.fillText(`Primary Current I: ${curr.toFixed(2)}A`, 80, 165);

        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (dI_dt > 0) {
          ctx.moveTo(350, 150);
          ctx.lineTo(270, 150);
          ctx.stroke();
          ctx.fillStyle = '#dc2626';
          ctx.fillText("BACK EMF (Counter e) ◀", 220, 175);
        } else {
          ctx.moveTo(270, 150);
          ctx.lineTo(350, 150);
          ctx.stroke();
          ctx.fillStyle = '#10b981';
          ctx.fillText("BOOSTING EMF (Discharge) ▶", 220, 175);
        }

        ctx.fillStyle = '#0f172a';
        ctx.fillText(`e_back = -L · (dI/dt)`, 80, 215);
        break;
      }
      case 'mutual-induction': {
        // Coaxial primary/secondary induction linking
        ctx.strokeStyle = '#db2777'; // pink-600
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.ellipse(120 + i * 16, 110, 11, 32, 0, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.fillStyle = '#db2777';
        ctx.fillText("Primary Coil C1", 95, 65);

        // Secondary
        ctx.strokeStyle = '#9333ea'; // purple-600
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.ellipse(280 + i * 16, 110, 11, 32, 0, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.fillStyle = '#9333ea';
        ctx.fillText("Secondary Coil C2", 255, 65);

        // Wireless waves linking
        const intensity = Math.abs(Math.sin(phase * Math.PI * 5));
        ctx.strokeStyle = `rgba(220, 38, 38, ${0.1 + intensity * 0.45})`;
        ctx.setLineDash([3, 3]);
        for (let j = 0; j < 3; j++) {
          ctx.beginPath();
          ctx.ellipse(200, 110, 50 + j * 20, 30 + j * 10, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        ctx.fillStyle = '#0f172a';
        ctx.fillText(`Primary current I1: ${(intensity * 6).toFixed(1)}A`, 80, 175);
        ctx.fillStyle = '#db2777';
        ctx.fillText(`Induced e2 = -M · (dI1/dt)`, 210, 175);
        break;
      }
      case 'motional-emf': {
        // Frame
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 35;
        ctx.lineWidth = 3;
        ctx.strokeRect(80, 80, 320, 80);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(81, 82, 318, 76);

        // Magnetic Field points as "X" lines
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.2)';
        ctx.lineWidth = 1.5;
        for (let x = 95; x < 400; x += 30) {
          for (let y = 95; y < 160; y += 30) {
            ctx.beginPath();
            ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4);
            ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4);
            ctx.stroke();
          }
        }

        // Conducting rod
        const rodX = 120 + phase * 220;
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(rodX, 70);
        ctx.lineTo(rodX, 170);
        ctx.stroke();

        // Velocity Arrow
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rodX, 120);
        ctx.lineTo(rodX + 30, 120);
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText("Conductor Rod (v)", rodX - 35, 60);

        ctx.fillStyle = '#059669';
        ctx.font = 'italic bold 13px serif';
        ctx.fillText(`e = B · l · v`, 160, 205);
        break;
      }
      case 'eddy-currents': {
        const angleSwg = Math.sin(phase * Math.PI * 8) * 0.4 * Math.exp(-phase * 3); // damping
        
        ctx.save();
        ctx.translate(240, 50);
        ctx.rotate(angleSwg);

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 80);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#475569';
        ctx.fillRect(-25, 80, 50, 40);
        ctx.strokeRect(-25, 80, 50, 40);

        if (Math.abs(angleSwg) > 0.05) {
          ctx.strokeStyle = '#ea580c';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(-12, 100, 8, 8, 0, 0, Math.PI * 2);
          ctx.ellipse(12, 100, 8, 8, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // Magnets below
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(195, 140, 30, 25);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(255, 140, 30, 25);
        ctx.fillStyle = '#ffffff';
        ctx.fillText("N", 207, 155);
        ctx.fillText("S", 267, 155);
        break;
      }
      case 'ac-generator': {
        const rot = phase * Math.PI * 6;
        
        ctx.save();
        ctx.translate(130, 120);
        ctx.rotate(rot);
        ctx.strokeStyle = '#db2777';
        ctx.lineWidth = 3;
        ctx.strokeRect(-30, -40, 60, 80);
        ctx.restore();

        ctx.fillStyle = '#dc2626';
        ctx.fillRect(50, 100, 30, 40);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(180, 100, 30, 40);

        ctx.strokeStyle = '#db2777';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let px = 250; px <= 430; px++) {
          const evalPhase = phase - (430 - px) / 180;
          const graphY = 120 + Math.sin(evalPhase * Math.PI * 6) * 35;
          if (px === 250) ctx.moveTo(px, graphY);
          else ctx.lineTo(px, graphY);
        }
        ctx.stroke();

        ctx.font = 'italic bold 12px serif';
        ctx.fillStyle = '#db2777';
        ctx.fillText(`e = N·B·A·ω · sin(ωt)`, 250, 75);
        break;
      }

      // NEW CHAPTER 8 SPECIFIC WHITBOARD ANIMATIONS
      case 'displacement-current': {
        // Draw AC voltage source connected to parallel plates
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Wires
        ctx.moveTo(80, 120);
        ctx.lineTo(160, 120);
        ctx.moveTo(320, 120);
        ctx.lineTo(400, 120);
        ctx.stroke();

        // Draw Cap Plates
        ctx.strokeStyle = '#0284c7'; // plate left
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(160, 80);
        ctx.lineTo(160, 160);
        ctx.stroke();

        ctx.strokeStyle = '#dc2626'; // plate right
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(320, 80);
        ctx.lineTo(320, 160);
        ctx.stroke();

        // Conduction Current Flow Circles (I_c)
        ctx.fillStyle = '#059669'; // Green balls flowing in wires
        const ballOffset = (phase * 110) % 80;
        ctx.beginPath();
        ctx.arc(80 + ballOffset, 120, 4, 0, Math.PI * 2);
        ctx.arc(320 + ballOffset, 120, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = 'bold 8px sans-serif';
        ctx.fillStyle = '#059669';
        ctx.fillText("Conduction Ic (flowing charges)", 50, 145);

        // Displacement Virtual Current inside Gap (Pulsing Electric fields)
        const pulse = Math.sin(phase * Math.PI * 4);
        ctx.strokeStyle = `rgba(234, 88, 12, ${0.4 + Math.abs(pulse) * 0.5})`; // changing electric flux lines
        ctx.lineWidth = 2;
        for (let xOff = 180; xOff <= 300; xOff += 30) {
          ctx.beginPath();
          ctx.moveTo(xOff, 90);
          ctx.lineTo(xOff, 150);
          ctx.stroke();

          // draw electric field arrows downwards
          ctx.beginPath();
          ctx.moveTo(xOff - 3, 135);
          ctx.lineTo(xOff, 142);
          ctx.lineTo(xOff + 3, 135);
          ctx.fillStyle = 'rgba(234, 88, 12, 0.8)';
          ctx.fill();
        }

        ctx.fillStyle = '#ea580c';
        ctx.fillText(`Changing E-Flux (Id = ε₀ dΦ/dt)`, 170, 70);

        // Circular Magnetic Fields loops representation (Concentric perspective)
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.save();
        ctx.translate(240, 120);
        ctx.beginPath();
        ctx.ellipse(0, 0, 45, 18, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#2563eb';
        ctx.fillText("Circular B-Field", -35, -23);
        ctx.restore();

        // Equation
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`∮ B · dl = μ₀(I_c + I_d)`, 290, 210);
        break;
      }

      case 'em-wave-propagation': {
        // Draw coordinate axis framework
        const originX = 60;
        const originY = 120;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        // Z axis (rightwards)
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(440, originY);
        ctx.stroke();
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#475569';
        ctx.fillText("Z propagation (Speed c)", 325, 110);

        // X Axis (vertical up)
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX, 35);
        ctx.stroke();
        ctx.fillText("X axis", originX - 35, 45);

        // Y Axis (skewed 45deg down-left for depth)
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX - 35, originY + 35);
        ctx.stroke();
        ctx.fillText("Y axis", originX - 45, originY + 45);

        // Coupled Wave Draw loops
        const waveLen = 120;
        const speed = phase * Math.PI * 6;

        // Draw Magnetic field transverse wave in Sky Blue along Y axis perspective (depth skew)
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let z = originX; z < 420; z++) {
          const theta = ((z - originX) / waveLen) * Math.PI * 2 - speed;
          const amp = Math.sin(theta) * 35;
          // projection coordinates for 3D depth axis
          const px = z - amp * 0.4;
          const py = originY + amp * 0.4;
          if (z === originX) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Draw Electric field transverse wave in Amber along X axis (pure vertical)
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let z = originX; z < 420; z++) {
          const theta = ((z - originX) / waveLen) * Math.PI * 2 - speed;
          const amp = Math.sin(theta) * 45;
          const px = z;
          const py = originY + amp;
          if (z === originX) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Explanations
        ctx.fillStyle = '#ea580c';
        ctx.fillText("Electric Field Ex ⊥ Z", 240, 50);
        ctx.fillStyle = '#0284c7';
        ctx.fillText("Magnetic Field By ⊥ Z", 240, 195);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold italic 11px serif';
        ctx.fillText("Ex = E₀ sin(kz - ωt)  |  By = B₀ sin(kz - ωt)", 120, 222);
        break;
      }

      case 'spectrum-radar': {
        // Draw spectral waves transitioning from long to short
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(20, 40, 440, 60);

        ctx.beginPath();
        for (let x = 20; x <= 460; x++) {
          const progressMultiplier = (x - 20) / 440; // 0 to 1
          const frequency = 1.0 + progressMultiplier * 25.0; // wave frequency ramps up
          const waveY = 70 + Math.sin(x * 0.05 * frequency - phase * Math.PI * 4) * 20;
          if (x === 20) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        // color matching
        ctx.strokeStyle = '#db2777';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 8px monospace';
        ctx.fillText("RADIO ... MICRO ... INFRA ... VISIBLE ... UV ... X-RAY ... GAMMA", 35, 52);

        // Draw radar transceiver sweeping
        const dishX = 100;
        const dishY = 170;

        // Base
        ctx.fillStyle = '#475569';
        ctx.fillRect(dishX - 15, dishY, 30, 25);
        ctx.strokeStyle = '#0f172a';
        ctx.strokeRect(dishX - 15, dishY, 30, 25);

        // Rotating dish hemisphere
        const dishAngle = Math.sin(phase * Math.PI * 2) * 0.3 - 0.2;
        ctx.save();
        ctx.translate(dishX, dishY);
        ctx.rotate(dishAngle);
        
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // dish arc
        ctx.arc(0, -10, 20, Math.PI, 0, true);
        ctx.stroke();
        // receiver feed horn
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, -25);
        ctx.stroke();
        ctx.restore();

        // Pulsing radar microwave packages
        const packagePulse = (phase * 350) % 250;
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(dishX + packagePulse, dishY - 20, 15, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
        
        // Target aircraft
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(360, 130, 45, 10);
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText("Microwave target", 350, 125);

        ctx.fillStyle = '#ea580c';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`Radar Speed is Constant: c = f · λ`, 140, 220);
        break;
      }
    }
  }, [progressPercent, isPlaying, tabId, videoConfig.totalDurationMs]);

  const handleTimeScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgressPercent(parseFloat(e.target.value));
  };

  const formatSeconds = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTimeMs = (progressPercent / 100) * videoConfig.totalDurationMs;

  return (
    <div className="bg-white text-slate-800 rounded-2xl border border-slate-200 overflow-hidden shadow-lg flex flex-col justify-between" id={`concept-walkthrough-player-${tabId}`}>
      
      {/* Visual Video Header Banner */}
      <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2 bg-[#FF6B00] text-white rounded text-[9px] font-black uppercase tracking-wider animate-pulse">
            LIVE SIMULATION
          </div>
          <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-wide truncate max-w-[200px] sm:max-w-sm">
            {videoConfig.title}
          </h4>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[9.5px] text-slate-500 font-extrabold">
          <GraduationCap className="w-4 h-4 text-[#FF6B00]" />
          <span>TIM Physics Lab</span>
        </div>
      </div>

      {/* Main Blackboard Canvas/Cinema */}
      <div className="relative bg-slate-100 flex items-center justify-center p-2 border-b border-slate-200 group">
        <canvas 
          ref={canvasRef} 
          className="w-full h-auto max-w-[485px] rounded-xl aspect-[2/1] bg-white border border-slate-200 shadow-md"
        />

        {/* Overlay Pause Indicator */}
        {!isPlaying && progressPercent < 100 && (
          <div 
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs flex items-center justify-center cursor-pointer transition-all"
          >
            <button className="w-14 h-14 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-white">
              <Play className="w-7 h-7 fill-white translate-x-0.5" />
            </button>
          </div>
        )}

        {/* Mute Indicator overlay */}
        {isMuted && (
          <div className="absolute top-4 right-4 bg-white/90 p-1.5 rounded-lg border border-slate-200 pointer-events-none">
            <VolumeX className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
        )}
      </div>

      {/* Live Playback CC closed captions */}
      <div className="bg-slate-50 px-4 py-3.5 min-h-[58px] border-b border-slate-200 flex items-start gap-2 relative">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping mt-1.5 shrink-0" />
        <p className="text-[11px] sm:text-xs font-semibold leading-relaxed text-slate-700 font-sans">
          <strong className="text-orange-600 font-extrabold mr-1 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200 uppercase text-[9px]">Lector:</strong> {getCurrentTranscriptText()}
        </p>
      </div>

      {/* SLM Audio Narrator Selector (Whisper Large V3 themed option) */}
      <div className="bg-slate-50/50 p-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mx-3 mt-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-[#FF6B00] shrink-0 border border-orange-200">
            <Volume2 className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div>
            <h5 className="text-[11px] font-extrabold text-slate-800 leading-none">
              Voice Narrator System
            </h5>
            <span className="text-[9.5px] font-mono text-slate-500 font-extrabold block mt-0.5">
              SLM Engine: <span className="text-emerald-600 font-bold">Whisper Large V3 (Optimized Speech)</span>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer select-none border ${
            voiceEnabled 
              ? 'bg-orange-500 text-white border-orange-650 hover:bg-orange-600 shadow-xs' 
              : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
          }`}
        >
          {voiceEnabled ? "Voice Enabled" : "Voice Muted"}
        </button>
      </div>

      {/* Control console */}
      <div className="p-3.5 bg-white space-y-3">
        
        {/* Timeline Slider / Progress scrubbing */}
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="0.05"
            value={progressPercent}
            onChange={handleTimeScrub}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B00] hover:accent-orange-600 focus:outline-none transition-all"
          />
        </div>

        {/* Lower row controls */}
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          {/* Playback triggers */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 px-3 bg-orange-50 hover:bg-orange-100 text-[#FF6B00] rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer border border-orange-200"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
            </button>
            <button
              onClick={() => { setProgressPercent(0); setIsPlaying(false); }}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all cursor-pointer border border-slate-300"
              title="Rewind video walkthrough"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Time tracker */}
          <div className="font-mono text-[10.5px] font-extrabold text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            {formatSeconds(currentTimeMs)} <span className="text-slate-400">/</span> {videoConfig.durationString}
          </div>

          {/* Speed settings */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {([0.5, 1.0, 1.5, 2.0] as number[]).map((sp) => (
              <button
                key={sp}
                onClick={() => setPlaybackSpeed(sp)}
                className={`px-1.5 py-0.5 text-[9px] font-bold font-mono rounded ${
                  playbackSpeed === sp 
                    ? 'bg-orange-500 text-white' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>

          {/* Mute and volume */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500 animate-pulse" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>
          </div>
        </div>

        {/* Board Syllabus Transcript Accordion */}
        <div className="border-t border-slate-200 pt-2.5 shrink-0">
          <button
            onClick={() => setShowFullTranscript(!showFullTranscript)}
            className="w-full text-left text-[10px] font-extrabold text-slate-500 hover:text-slate-800 flex items-center justify-between border border-slate-100 p-1.5 px-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all uppercase tracking-wider"
          >
            <span>📄 Full Syllabus Script & Board High Points</span>
            <span>{showFullTranscript ? "Hide ▲" : "Expand ▼"}</span>
          </button>
          
          {showFullTranscript && (
            <div className="mt-1.5 bg-slate-50 border border-slate-250 p-3 rounded-lg overflow-y-auto max-h-[105px] text-[11px] leading-relaxed text-slate-600 space-y-1.5">
              <span className="font-extrabold text-amber-600 block text-[9.5px] uppercase tracking-wider">Karnataka Board syllabus guidelines:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 font-semibold font-sans">
                {videoConfig.segments.map((seg, sIdx) => (
                  <li key={sIdx}>
                    <strong className="text-slate-500 font-mono text-[9px]">{seg.startPercent}%-{seg.endPercent}%:</strong> {seg.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
