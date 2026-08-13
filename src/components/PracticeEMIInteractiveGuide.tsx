import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Zap, Compass, Layers, Play, RotateCcw, ArrowRight, ArrowLeft, 
  Info, HelpCircle, Activity, TrendingUp, Workflow, Grid, ShieldAlert, 
  Award, RefreshCw, ChevronRight, ChevronLeft,
  Youtube, Cpu, Tv, Clock, Volume2, HardDrive, Pause, CheckCircle
} from 'lucide-react';
import ConceptVideoPlayer from './ConceptVideoPlayer';

type TabId = 
  | 'faraday-laws' | 'magnetic-flux' | 'faraday-experiments' | 'lenzs-law' 
  | 'self-induction' | 'mutual-induction' | 'motional-emf' 
  | 'eddy-currents' | 'ac-generator';

type SectionId = 'section-1' | 'section-2' | 'section-3';

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  badgeBg: string;
  textColor: string;
}

interface TopicVideo {
  youtubeId: string;
  title: string;
  description: string;
  duration: string;
  author: string;
  offlineAnimationName: string;
  lecturePoints: string[];
}

const topicVideos: Record<TabId, TopicVideo> = {
  'faraday-laws': {
    youtubeId: 'yA88ZOni8jg',
    title: "Faraday's Law of Induction & Lenz's Law",
    description: "Learn how changes in magnetic fields induce electric currents in conductive loops in this outstanding Crash Course Physics lecture.",
    duration: "10:04",
    author: "Crash Course Physics",
    offlineAnimationName: "Faraday Interaction Dynamics",
    lecturePoints: [
      "Discovery by Michael Faraday in 1831: mechanical movement of magnetism produces electric currents.",
      "The Magnitude of induced electromotive force (EMF) is proportional to the speed and frequency of loop-sweeps.",
      "Adding more wire turns (N) multiplies the total induced signal as voltages build in series.",
      "Mathematical formula: e = -N · (dΦ / dt). Negative sign is explained by Lenz's Law of polarity opposition."
    ]
  },
  'magnetic-flux': {
    youtubeId: 'W9o_mWe2Voo',
    title: "Understanding Magnetic Flux (Φ = B · A · cosθ)",
    description: "A highly visual breakdown of magnetic flux density, surface area, and angle orientation vectors.",
    duration: "4:15",
    author: "Khan Academy Physics",
    offlineAnimationName: "Flux Vector Projection",
    lecturePoints: [
      "Magnetic Flux represents the total magnetic field lines passing perpendicularly through a specific loop area.",
      "Flux relies on three parameters: Magnetic strength (B), surface area of wire loop (A), and tilt angle relative to field normals (θ).",
      "Maximum flux is achieved when the field flows perpendicular to wire loop plane (θ = 0°, cosθ = 1).",
      "Zero flux is witnessed when loop plane is parallel to field lines, meaning cos90° = 0 and no lines penetrate."
    ]
  },
  'faraday-experiments': {
    youtubeId: 'hajIuZPP45Y',
    title: "What are Faraday's Two Classic Discovery Experiments?",
    description: "Watch the historical recreation of Faraday moving a permanent bar magnet into solenoid loops of varying turn rates.",
    duration: "5:22",
    author: "MIT Physics Demonstrations",
    offlineAnimationName: "Coil Transient Response",
    lecturePoints: [
      "Experiment 1: Bar magnet moved in and out of a secondary solenoid. Deflection occurs only during actual motion.",
      "Experiment 2: Primary coil connected to key battery, and secondary coil to galvanometer. Induction occurs on make/break clicks.",
      "Steady direct constant current in primary coil yields absolute zero induction in secondary coil.",
      "The strength of induced deflection escalates with faster speeds, stronger core permeability, and higher turn multipliers."
    ]
  },
  'lenzs-law': {
    youtubeId: 'xx8D0XhE0Zc',
    title: "Lenz's Law & Conservation of Energy",
    description: "An animated walkthrough of physical force opposition. Why does a falling magnet slow down in a copper pipe? Conservation of energy in action.",
    duration: "6:48",
    author: "Science Discovery Channel",
    offlineAnimationName: "Lenz Force Vector",
    lecturePoints: [
      "Lenz's Law states that the induced current establishes its own magnet field which directly opposes the parent flux variation.",
      "If you push a North Pole towards a coil, the coil triggers a counter-current generating a North Pole face to repel the push.",
      "If you retreat a North Pole, the induced current switches direction to build a South Pole face to attract and resist retreat.",
      "This provides a spectacular proof of the general Conservation of Energy. Work must be done to drive induction!"
    ]
  },
  'self-induction': {
    youtubeId: 'C8U7nEunZmo',
    title: "Self Inductance and Back EMF Principles",
    description: "An deep-dive into how single coils oppose their own current modifications via self-induced EMF and solenoid geometry changes.",
    duration: "8:10",
    author: "MIT Walter Lewin Lectures",
    offlineAnimationName: "Solenoid Back-EMF delay",
    lecturePoints: [
      "Self induction occurs when a single solenoid coil opposes any change in current running within itself.",
      "By altering current, the loop's own surrounding field changes, which triggers an internal back EMF: e = -L · (dI/dt).",
      "The value L is the self-inductance metric, determined by geometry parameters: L = μ_0 · N² · A / l.",
      "This acts as electrical inertia, resisting instantaneous current boosts during switch-on and current decay on switch-off."
    ]
  },
  'mutual-induction': {
    youtubeId: '7M_8uGg9Ff8',
    title: "Mutual Induction and Power Transformers",
    description: "Explores the magnetic flux coupling between primary and secondary solenoid coils, detailing the turn-ratio voltage ratios.",
    duration: "7:02",
    author: "Crash Course Engineering",
    offlineAnimationName: "Coaxial Magnetic Coupling",
    lecturePoints: [
      "Mutual induction involves two distinct coaxial coils nestled in mutual vicinity where flux leaks from one to the next.",
      "Varying current in Primary coil maps a changing field that cuts secondary coil turns, inducing a voltage output: e_2 = -M · (dI_1/dt).",
      "The coefficient of mutual inductance M depends on shared core material, spatial spacing, alignment, and winding density.",
      "This governs standard step-up and step-down AC power grid transformers operating with high voltage efficiency."
    ]
  },
  'motional-emf': {
    youtubeId: 'W9V4Z956f4s',
    title: "Motional Electromotive Force (e = BvL)",
    description: "Understands the physical Lorentz force pushing charge carriers inside a conducting rod moving perpendicular to external magnetic fields.",
    duration: "9:12",
    author: "Doc Physics Lectures",
    offlineAnimationName: "Sliding Rail EMF Dynamics",
    lecturePoints: [
      "Motional EMF represents voltage generated when a conductive bar travels inside a stationary magnetic workspace.",
      "As the rod moves with velocity 'v', the charge carriers within it encounter magnetic Lorentz force: F = q · (v x B).",
      "Electrons gather cleanly at one end, creating an electric charge gradient until an electrostatic counter-field holds equilibrium.",
      "The final open-circuit potential induced is: e = B · v · l (where l is active length of bar aligned perpendicularly)."
    ]
  },
  'eddy-currents': {
    youtubeId: 'gX7f67D6Q_Y',
    title: "Eddy Currents, Magnetic Damping and Slots",
    description: "Witness physical copper boards decelerate instantly when entering powerful magnetic pole sectors. Demonstrates solid vs slotted laminations.",
    duration: "4:32",
    author: "Harvard Physics Demo Labs",
    offlineAnimationName: "Eddy Swirl Field Retardation",
    lecturePoints: [
      "Eddy currents are closed circular loops of currents induced within solid conductor arrays crossing non-uniform fields.",
      "These local bulk currents trigger opposing magnetic poles, causing prompt magnetic damping drag that halts mechanical swing.",
      "In industrial electric motors, transformers, and cores, we minimize eddy heat losses by using laminated slotted sheets.",
      "Useful applications: magnetic brakes in roller coasters, electronic induction stoves, and scrap sorting machines."
    ]
  },
  'ac-generator': {
    youtubeId: 'gQyamjPrw-U',
    title: "AC Alternators & Generative Sine EMF Waves",
    description: "Detailed 3D video simulation of rectangular conductor loops rotating at steady RPM within balanced stationary magnetic magnets.",
    duration: "11:15",
    author: "3D Science Animations Hub",
    offlineAnimationName: "Revolving Rectangular Armature AC",
    lecturePoints: [
      "The AC Generator converts mechanical torque energy into alternating sinus electrical energy using Faraday's principles.",
      "A wire loop armature spins in uniform field. The continuous change in effective presentation area alters localized flux.",
      "Flux variation is Φ_B = B · A · cos(ωt), creating induced EMF output: e(t) = e_m · sin(ωt), where e_m = N · B · A · ω.",
      "Continuous rotation swaps the output polarities twice per rev cycle, feeding continuous sinus waves via slip ring rotors."
    ]
  }
};

function ConceptVideoHub({ activeTab }: { activeTab: TabId }) {
  const [offlineScrubber, setOfflineScrubber] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const subMode = 'offline';
  const [eddyType, setEddyType] = useState<'solid' | 'slotted'>('solid');
  
  const videoDetails = topicVideos[activeTab];
  
  // Animation Loop for Offline Player
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const step = () => {
        setOfflineScrubber((prev) => {
          if (prev >= 100) return 0;
          return prev + 1 * playbackSpeed;
        });
        timer = setTimeout(step, 100);
      };
      timer = setTimeout(step, 100);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, playbackSpeed, activeTab]);

  // Compute trigonometric phase based on scrubber percentage
  const phase = (offlineScrubber * Math.PI * 2) / 100;

  // Let's render the Offline Animation display based on activeTab
  const renderOfflineSimulationScreen = () => {
    const isMoving = isPlaying || offlineScrubber > 0;
    
    switch (activeTab) {
      case 'faraday-laws': {
        const magnetX = 20 + 35 * Math.sin(phase);
        const deflection = 35 * Math.cos(phase);
        return (
          <div className="relative w-full h-44 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-around p-4 border border-slate-750">
            {/* Coil loop */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full border-4 border-yellow-500/20 flex flex-col justify-center items-center shadow-lg animate-pulse">
                <span className="text-[10px] text-yellow-400 font-mono font-bold">N=500 Coils</span>
              </div>
              <div className="absolute w-1 h-12 bg-yellow-600 left-1/2 transform -translate-x-1/2" />
            </div>

            {/* Moving Magnet representer */}
            <div 
              className="absolute h-10 w-28 bg-gradient-to-r from-red-600 to-indigo-650 rounded shadow-md flex items-center justify-between px-3 text-white font-mono text-[11px] font-bold select-none border border-white/20 transition-all duration-75"
              style={{ left: `${magnetX}%` }}
            >
              <span>N</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>S</span>
            </div>

            {/* Current Indicator Glow */}
            <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300">
              <Compass className={`w-3.5 h-3.5 text-orange-400 ${isPlaying ? 'animate-pulse' : ''}`} />
              <span>G-Needle: <strong className={Math.abs(deflection) > 5 ? 'text-emerald-400' : 'text-slate-400'}>{deflection.toFixed(1)}°</strong></span>
            </div>
          </div>
        );
      }
      
      case 'magnetic-flux': {
        const rotDeg = offlineScrubber * 3.6;
        const rad = (rotDeg * Math.PI) / 180;
        const fluxDotValue = Math.cos(rad);
        return (
          <div className="relative w-full h-44 bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-750">
            {/* Magnetic force vector lines background */}
            <div className="absolute inset-0 flex flex-col justify-around opacity-25 pointer-events-none px-4">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="w-full h-0.5 bg-blue-400 flex justify-end items-center">
                  <span className="text-[8px] text-blue-300 mr-2 animate-bounce">&rarr; B-Field Lines</span>
                </div>
              ))}
            </div>

            {/* Angle Indicator */}
            <div className="relative z-10 flex items-center gap-6">
              <div 
                className="w-18 h-18 rounded-full border-2 border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center font-bold text-white text-xs transition-transform duration-75"
                style={{ transform: `rotate(${rotDeg}deg)` }}
              >
                <div className="w-12 h-1 bg-emerald-400 rounded-full" />
                <span className="absolute text-[9px] text-emerald-300 font-mono font-black">AREA</span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl font-mono text-left space-y-1">
                <p className="text-[10px] text-slate-400 uppercase">Interactive Variables</p>
                <p className="text-xs text-white">Angle (θ): <strong className="text-emerald-400">{Math.round(rotDeg % 360)}°</strong></p>
                <p className="text-xs text-white">cos(θ): <strong className="text-emerald-400">{fluxDotValue.toFixed(2)}</strong></p>
                <p className="text-xs text-white">Flux (Φ): <strong className="text-emerald-350 font-bold">{(1.5 * 2.0 * fluxDotValue).toFixed(2)} Wb</strong></p>
              </div>
            </div>
          </div>
        );
      }

      case 'faraday-experiments': {
        const isClosed = Math.floor(offlineScrubber / 25) % 2 === 0;
        const currentPulse = isClosed ? 1 : 0;
        return (
          <div className="relative w-full h-44 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-around p-4 border border-slate-750">
            {/* Circuit Primary */}
            <div className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all w-28 ${isClosed ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-400' : 'bg-slate-950/20 border-slate-800 text-slate-500'}`}>
              <span className="text-[9px] uppercase font-bold">Primary Coil</span>
              <div className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${isClosed ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
                <span className="text-[9px] font-mono">{isClosed ? 'Closed (ON)' : 'Open (OFF)'}</span>
              </div>
              <p className="text-[8.5px] text-center font-semibold text-slate-450">Current matches battery keys.</p>
            </div>

            {/* Center link - Magnetic Field Swells representing flux leaps */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Compass className={`w-8 h-8 text-amber-500 ${isClosed ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              {currentPulse > 0 && <span className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping" />}
            </div>

            {/* Circuit Secondary (Galvanometer display) */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-300 w-28 flex flex-col items-center gap-1">
              <span className="text-[9px] uppercase font-bold text-yellow-400">Secondary Coil</span>
              <div className="w-16 h-8 bg-black rounded relative flex justify-center items-end pb-1 border border-slate-850">
                <div className="absolute w-2 h-2 rounded-full bg-[#FF6B00] mb-0.5" />
                <div 
                  className="absolute bottom-1 w-0.5 h-6 bg-rose-500 origin-bottom transition-transform duration-300"
                  style={{ transform: `rotate(${isClosed ? '35' : '-35'}deg)` }}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-450">Transient Peaks!</span>
            </div>
          </div>
        );
      }

      case 'lenzs-law': {
        const isApproaching = Math.sin(phase) > 0;
        return (
          <div className="relative w-full h-44 bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-750">
            <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold mb-3">CONSERVATION THERMODYNAMICS REEL</h4>
            <div className="w-full max-w-sm flex items-center justify-center gap-8 relative">
              
              {/* Magnet vector */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-20 h-8 bg-gradient-to-r from-red-600 to-indigo-650 flex items-center justify-between text-white font-mono text-[10px] font-black px-3 rounded shadow shadow-red-900/30">
                  <span>N</span>
                  <span className="text-white text-[9px] font-bold">&rarr; v</span>
                  <span>S</span>
                </div>
                <span className="text-[8.5px] text-amber-400 font-mono mt-1 font-bold">
                  {isApproaching ? 'Entering (+dΦ/dt)' : 'Retreating (-dΦ/dt)'}
                </span>
              </div>

              {/* Loop with Opposing poles labels */}
              <div className="relative w-16 h-16 rounded-full border-4 border-slate-600 bg-slate-950 flex flex-col justify-center items-center shadow-inner shrink-0">
                <div className={`text-xl font-mono font-extrabold ${isApproaching ? 'text-red-500' : 'text-indigo-400'}`}>
                  {isApproaching ? 'N' : 'S'}
                </div>
                <span className="absolute bottom-1 text-[7.5px] uppercase font-mono font-bold text-slate-400">Coil Face</span>
                
                {/* Micro swirls */}
                <div className={`absolute inset-1 rounded-full border border-dashed ${isApproaching ? 'border-red-400/50' : 'border-indigo-400/50'} animate-spin`} />
              </div>
            </div>

            <p className="text-[9.5px] font-mono text-orange-300 mt-3 text-center px-4 leading-normal font-semibold">
              {isApproaching 
                ? 'Opposing Force: Induced loop current generates N-Pole face to SLOW DOWN the incoming search magnet.'
                : 'Attracting Drag: Secondary coil generates S-Pole face to HOLD BACK and resist extraction work.'
              }
            </p>
          </div>
        );
      }

      case 'self-induction': {
        const isWorking = Math.floor(offlineScrubber / 50) % 2 === 0;
        const currentI = isWorking ? (1 - Math.exp(-(offlineScrubber % 50) / 10)) : Math.exp(-(offlineScrubber % 50) / 8);
        return (
          <div className="relative w-full h-44 bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-750">
            <div className="w-full max-w-xs flex justify-between items-center bg-slate-950/80 p-3.5 rounded-xl border border-slate-850">
              <div className="space-y-1.5 text-left">
                <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Self Core Inductor L</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-6 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1.5 h-6 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-6 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1.5 h-6 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">L = 15.4 mH</span>
              </div>

              {/* Bulb representing electrical growth delay */}
              <div className="relative flex flex-col items-center gap-1 text-[9.5px] font-bold text-slate-300">
                <div 
                  className="w-10 h-10 rounded-full border-2 transition-all duration-100 flex items-center justify-center"
                  style={{
                    backgroundColor: `rgba(245, 158, 11, ${currentI * 0.95})`,
                    borderColor: isWorking ? 'rgb(245, 158, 11)' : 'rgb(51, 65, 85)',
                    boxShadow: isWorking ? `0 0 ${currentI * 20}px rgba(245, 158, 11, 0.6)` : 'none'
                  }}
                >
                  <span className={`text-[8.5px] font-mono text-black font-black ${currentI > 0.3 ? 'opacity-100' : 'opacity-30'}`}>BULB</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">Growth: {Math.round(currentI * 100)}%</span>
              </div>
            </div>

            <p className="text-[9.5px] font-mono text-emerald-300 mt-3 text-center px-4 leading-normal font-semibold">
              Inductor opposes current change. Inductive latency slows down circuit saturation curve!
            </p>
          </div>
        );
      }

      case 'mutual-induction': {
        const peakFlux = Math.sin(phase);
        const secVoltage = Math.cos(phase);
        return (
          <div className="relative w-full h-44 bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-750">
            <div className="flex gap-12 items-center justify-center">
              
              {/* Primary Solenoid */}
              <div className="text-center space-y-1">
                <span className="text-[9px] text-indigo-400 uppercase font-black">Primary Coil 1</span>
                <div className="w-14 h-16 border border-indigo-500/40 bg-indigo-500/10 rounded flex flex-col justify-around items-center p-1.5 shadow">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-2 bg-indigo-400 rounded-full animate-pulse" />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-indigo-300">I_1 = {peakFlux.toFixed(2)} A</span>
              </div>

              {/* Shared flux couplings */}
              <div className="flex flex-col items-center">
                <Workflow className="w-6 h-6 text-violet-400 animate-spin" style={{ animationDuration: '5s' }} />
                <span className="text-[8px] uppercase tracking-widest text-slate-400 font-mono font-bold mt-1">Iron Core Link</span>
              </div>

              {/* Secondary Solenoid */}
              <div className="text-center space-y-1">
                <span className="text-[9px] text-violet-400 uppercase font-black">Secondary Coil 2</span>
                <div className="w-14 h-16 border border-violet-500/40 bg-violet-500/10 rounded flex flex-col justify-around items-center p-1.5 shadow">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-2 bg-violet-400 rounded-full animate-pulse" />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-violet-300">e_2 = {secVoltage.toFixed(2)} V</span>
              </div>

            </div>
          </div>
        );
      }

      case 'motional-emf': {
        const barX = 20 + 55 * (offlineScrubber / 100);
        return (
          <div className="relative w-full h-44 bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-750">
            {/* Background magnetic cross vectors representing B entering screen */}
            <div className="absolute inset-0 grid grid-cols-6 gap-2 p-3 opacity-15 pointer-events-none">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="text-blue-400 font-mono text-[9px] font-black text-center">&#10006;</div>
              ))}
            </div>

            {/* Rails array */}
            <div className="relative w-full max-w-xs h-24 border-y-2 border-slate-400/60 mt-1">
              {/* Sliding metallic conductor rod */}
              <div 
                className="absolute top-0 bottom-0 w-3 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded flex flex-col justify-around items-center select-none shadow shadow-cyan-300/30 transition-all duration-75"
                style={{ left: `${barX}%` }}
              >
                <span className="text-[7.5px] font-black text-slate-900 block rotate-90 uppercase">ROD</span>
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full text-[6px] text-white flex items-center justify-center font-bold font-mono">-</div>
              </div>

              <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 text-[9.5px] font-mono text-cyan-300">
                Formula output: e = B·v·l
              </div>
            </div>

            <span className="text-[9px] font-mono text-cyan-400 mt-2">
              Conductor rod travels perpendicular to field at velocity v. Volts generated!
            </span>
          </div>
        );
      }

      case 'eddy-currents': {
        const isSolid = eddyType === 'solid';
        const swingAngle = isSolid ? 4 * Math.sin(offlineScrubber * 0.95) * Math.exp(-offlineScrubber / 20) : 32 * Math.sin(offlineScrubber * 0.22);
        return (
          <div className="relative w-full h-44 bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-750">
            <div className="absolute top-3 right-4 flex items-center gap-1.5 z-10">
              <span className="text-[9px] text-slate-400 font-bold mr-1">Copper Board:</span>
              <button 
                type="button"
                onClick={() => setEddyType('solid')}
                className={`py-0.5 px-2 text-[9px] rounded font-bold cursor-pointer transition-colors ${eddyType === 'solid' ? 'bg-rose-600 text-white' : 'bg-slate-805 bg-slate-800 text-slate-400'}`}
              >
                Solid Plate
              </button>
              <button 
                type="button"
                onClick={() => setEddyType('slotted')}
                className={`py-0.5 px-2 text-[9px] rounded font-bold cursor-pointer transition-colors ${eddyType === 'slotted' ? 'bg-rose-600 text-white' : 'bg-slate-805 bg-slate-800 text-slate-400'}`}
              >
                Slotted Plate
              </button>
            </div>

            {/* Pivot hanger */}
            <div className="w-16 h-1 bg-slate-600 rounded-full mb-1 relative" />

            {/* Swinging Pendulum */}
            <div 
              className="origin-top w-1 h-14 bg-slate-400 relative transition-transform duration-75 flex flex-col justify-end items-center"
              style={{ transform: `rotate(${swingAngle}deg)` }}
            >
              {/* Copper plate */}
              <div className={`w-12 h-10 border-2 rounded ${isSolid ? 'bg-orange-500/20 border-orange-500' : 'bg-orange-500/10 border-orange-500/45 border-dashed'} flex flex-col justify-center items-center`}>
                <span className="text-[7.5px] font-black text-orange-400 uppercase font-mono">{isSolid ? 'Bulk plate' : 'Slitted'}</span>
                {isSolid && isMoving && (
                  <RefreshCw className="w-2.5 h-2.5 text-orange-400 animate-spin absolute" />
                )}
              </div>
            </div>

            <p className="text-[9.5px] font-mono text-rose-305 mt-2 text-center px-4 leading-normal font-semibold text-rose-300">
              {isSolid 
                ? 'Strong EM Damping brake: Massive closed loops induced, causing immediate kinetic retardation!'
                : 'Minimised Damping: Slited slots cut open eddy paths, letting the copper swings continue freely.'
              }
            </p>
          </div>
        );
      }

      case 'ac-generator': {
        const loopAngle = offlineScrubber * 3.6;
        const sinVal = Math.sin((loopAngle * Math.PI) / 180);
        return (
          <div className="relative w-full h-44 bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border border-slate-750">
            <div className="flex gap-8 items-center justify-around w-full max-w-sm">
              <div className="relative flex items-center justify-center shrink-0">
                {/* N Magnet */}
                <div className="w-6 h-10 bg-red-655 bg-red-650 text-white font-black font-mono flex items-center justify-center text-xs rounded shadow">N</div>
                {/* Spinning Loop */}
                <div 
                  className="w-14 h-12 border border-pink-500 rounded bg-pink-500/10 flex items-center justify-center text-white text-[9px] font-bold mx-2 select-none"
                  style={{ transform: `rotateY(${loopAngle}deg)` }}
                >
                  &larr; AC
                </div>
                {/* S Magnet */}
                <div className="w-6 h-10 bg-indigo-600 text-white font-black font-mono flex items-center justify-center text-xs rounded shadow">S</div>
              </div>

              {/* Sine Wave Plot */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-850 font-mono text-left space-y-1.5 shrink-0 w-36">
                <span className="text-[7.5px] uppercase text-slate-400 font-bold block leading-none">Instant Alternator AC</span>
                <p className="text-[10px] text-pink-400 leading-none">e_out: <strong className="text-white">{(sinVal * 12.5).toFixed(2)} Volts</strong></p>
                
                {/* Live micro canvas bar bar */}
                <div className="w-full h-4 bg-slate-900 border border-slate-800 rounded relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-x-0 h-0.5 bg-slate-750" />
                  <div 
                    className="h-full bg-pink-500 absolute transition-all duration-75"
                    style={{
                      width: `${Math.abs(sinVal * 50)}%`,
                      left: sinVal >= 0 ? '50%' : 'auto',
                      right: sinVal < 0 ? '50%' : 'auto',
                    }}
                  />
                </div>
                <span className="text-[7.5px] text-slate-500 font-semibold block text-center uppercase">Angle: {Math.round(loopAngle % 360)}°</span>
              </div>
            </div>
          </div>
        );
      }

      default:
        return <div className="p-12 text-slate-400 text-xs">Dynamic virtual video graphic unavailable.</div>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md animate-fade-in text-xs sm:text-sm">
      <div className="bg-slate-900 text-white px-5 py-4 border-b border-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-0.5">
          <span className="text-[9.5px] uppercase font-black tracking-widest text-orange-400 flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5" /> Conceptual Video Explainer
          </span>
          <h3 className="text-slate-100 font-extrabold text-[13.5px] sm:text-sm leading-tight">
            {videoDetails.title}
          </h3>
        </div>

        {/* Video Mode controls (Forced offline render engine indicator) */}
        <div className="flex items-center gap-2 bg-slate-800 p-1 px-3 rounded-lg border border-slate-700 select-none">
          <Cpu className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span className="text-[10px] uppercase font-black tracking-wider text-orange-400">
            Offline Simulation
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Media screen panel */}
        <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-5 flex flex-col justify-between border-r border-slate-200">
          
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow shadow-black flex items-center justify-center">
            <div className="relative w-full h-full flex flex-col justify-between p-4">
              <span className="absolute top-3 left-4 text-[9px] z-10 font-mono font-black tracking-widest text-[#FF6B00] bg-black/60 px-2 py-1 rounded border border-orange-500/30">
                OFFLINE 3D VECTOR PHYSICS SOURCE
              </span>
              
              <div className="flex-1 flex items-center justify-center w-full">
                {renderOfflineSimulationScreen()}
              </div>
                
                {/* Media Playback Scrubber and Controls block */}
                <div className="bg-black/80 border border-slate-800 px-3.5 py-2.5 rounded-lg space-y-2 mt-4 z-10">
                  {/* Scrubber slider bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-slate-400 select-none">
                      {`00:${Math.round(offlineScrubber * 0.6).toString().padStart(2, '0')}`}
                    </span>
                    <input 
                      type="range" min="0" max="100" step="1" value={offlineScrubber}
                      onChange={(e) => {
                        setOfflineScrubber(parseInt(e.target.value));
                        setIsPlaying(false); // pause on manually scrubbing
                      }}
                      className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500 tracking-wider"
                    />
                    <span className="text-[9px] font-mono text-slate-400 select-none">01:00</span>
                  </div>

                  <div className="flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1 px-3 bg-orange-600 rounded-md text-[10px] font-bold tracking-wide uppercase hover:bg-orange-550 hover:bg-orange-500 text-white cursor-pointer"
                      >
                        {isPlaying ? <span className="flex items-center gap-1"><Pause className="w-2.5 h-2.5 shrink-0" /> Pause</span> : <span className="flex items-center gap-1"><Play className="w-2.5 h-2.5 shrink-0 fill-white" /> Play Reel</span>}
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setOfflineScrubber(0); setIsPlaying(false); }}
                        className="p-1 rounded bg-slate-850 hover:bg-slate-750 text-slate-300 font-mono text-[9px] cursor-pointer"
                      >
                        Reset Reel
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[9px]">
                      <span className="text-slate-400">Reel Speed:</span>
                      {[0.5, 1.0, 2.0].map(sp => (
                        <button 
                          key={sp}
                          type="button"
                          onClick={() => setPlaybackSpeed(sp)}
                          className={`py-0.5 px-1.5 rounded cursor-pointer transition-colors ${playbackSpeed === sp ? 'bg-orange-500 text-white font-bold' : 'bg-slate-850 text-slate-400 hover:text-slate-300'}`}
                        >
                          {sp}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
          </div>

          <div className="mt-4 border-t border-slate-900 pt-3.5 flex justify-between items-center text-[10.5px] font-semibold text-slate-400 font-mono">
            <span>Author Credit: {videoDetails.author}</span>
            <span>Duration estimation: {videoDetails.duration} minutes</span>
          </div>
        </div>

        {/* Lesson transcript and Board keypoints panel */}
        <div className="lg:col-span-5 bg-white p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="text-slate-800 font-black uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-500" /> Lesson Board Syllabus Analysis
              </h4>
              <span className="text-[9px] text-slate-400 font-bold">Class 11 CBSE/Karnataka State Syllabus</span>
            </div>
            
            <p className="text-slate-650 leading-relaxed text-[11.5px] font-semibold">
              {videoDetails.description}
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-inner">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Key Lecture Bulletins:</span>
              <ul className="space-y-2 text-[11px] font-semibold text-slate-600">
                {videoDetails.lecturePoints.map((point, index) => {
                  // highlight the bulletin based on current progress slider
                  const isActive = index <= Math.floor(offlineScrubber / 25);
                  return (
                    <li key={index} className={`flex gap-2 items-start transition-all duration-300 ${isActive ? 'text-slate-900' : 'opacity-40 text-slate-500'}`}>
                      <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span>{point}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-6 p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl flex gap-2.5 text-[10.5px] leading-relaxed">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-semibold text-amber-900">
              <strong>Offline Mode Ready:</strong> We engineered this cinematic visual layout to support direct vector render simulations, ensuring continuous interactive study even offline!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PracticeEMIInteractiveGuide() {
  const [activeSection, setActiveSection] = useState<SectionId>('section-1');
  const [activeTab, setActiveTab] = useState<TabId>('faraday-laws');
  const [viewMode, setViewMode] = useState<'sandbox' | 'video'>('sandbox');

  // Tab configurations map
  const tabsMap: Record<TabId, TabConfig> = {
    'faraday-laws': { id: 'faraday-laws', label: "1. Faraday's Laws", icon: Zap, color: 'text-amber-600', badgeBg: 'bg-amber-100', textColor: 'text-amber-800' },
    'magnetic-flux': { id: 'magnetic-flux', label: "2. Magnetic Flux (Φ)", icon: Compass, color: 'text-teal-600', badgeBg: 'bg-teal-100', textColor: 'text-teal-800' },
    'faraday-experiments': { id: 'faraday-experiments', label: "3. Faraday's Expt", icon: Layers, color: 'text-indigo-600', badgeBg: 'bg-indigo-100', textColor: 'text-indigo-800' },
    'lenzs-law': { id: 'lenzs-law', label: "4. Lenz's Law", icon: RotateCcw, color: 'text-orange-600', badgeBg: 'bg-orange-100', textColor: 'text-orange-850' },
    'self-induction': { id: 'self-induction', label: "5. Self Induction", icon: TrendingUp, color: 'text-emerald-600', badgeBg: 'bg-emerald-100', textColor: 'text-emerald-800' },
    'mutual-induction': { id: 'mutual-induction', label: "6. Mutual Induction", icon: Workflow, color: 'text-violet-600', badgeBg: 'bg-violet-100', textColor: 'text-violet-800' },
    'motional-emf': { id: 'motional-emf', label: "7. Motional EMF", icon: Play, color: 'text-cyan-600', badgeBg: 'bg-cyan-100', textColor: 'text-cyan-800' },
    'eddy-currents': { id: 'eddy-currents', label: "8. Eddy Currents", icon: Grid, color: 'text-rose-600', badgeBg: 'bg-rose-100', textColor: 'text-rose-800' },
    'ac-generator': { id: 'ac-generator', label: "9. AC Generator", icon: Activity, color: 'text-pink-600', badgeBg: 'bg-pink-100', textColor: 'text-pink-800' },
  };

  const sectionTabs: Record<SectionId, TabId[]> = {
    'section-1': ['faraday-laws', 'magnetic-flux', 'faraday-experiments', 'lenzs-law'],
    'section-2': ['self-induction', 'mutual-induction', 'motional-emf'],
    'section-3': ['eddy-currents', 'ac-generator'],
  };

  const sectionsList = [
    { id: 'section-1' as SectionId, label: 'Section 1: Core Principles', description: "Faraday & Lenz Foundations" },
    { id: 'section-2' as SectionId, label: 'Section 2: Inductance & EMF', description: "Self, Mutual & Motion Potentials" },
    { id: 'section-3' as SectionId, label: 'Section 3: Industrial Machinery', description: "Eddy Currents & Alternators" },
  ];

  // List of all 9 tabs in order
  const tabsInOrder: TabId[] = [
    'faraday-laws',
    'magnetic-flux',
    'faraday-experiments',
    'lenzs-law',
    'self-induction',
    'mutual-induction',
    'motional-emf',
    'eddy-currents',
    'ac-generator'
  ];

  // Handle section click - switches to that section and selects its first tab
  const handleSectionChange = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    const firstTabOfSection = sectionTabs[sectionId][0];
    setActiveTab(firstTabOfSection);
  };

  // Next and Previous Topic handlers
  const handleNextTopic = () => {
    const currentIndex = tabsInOrder.indexOf(activeTab);
    if (currentIndex < tabsInOrder.length - 1) {
      const nextTab = tabsInOrder[currentIndex + 1];
      setActiveTab(nextTab);
      // Auto-update section if next tab belongs to a different section
      const nextSection = (Object.keys(sectionTabs) as SectionId[]).find(sec => 
        sectionTabs[sec].includes(nextTab)
      );
      if (nextSection) setActiveSection(nextSection);
    }
  };

  const handlePrevTopic = () => {
    const currentIndex = tabsInOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      const prevTab = tabsInOrder[currentIndex - 1];
      setActiveTab(prevTab);
      // Auto-update section if prev tab belongs to a different section
      const prevSection = (Object.keys(sectionTabs) as SectionId[]).find(sec => 
        sectionTabs[sec].includes(prevTab)
      );
      if (prevSection) setActiveSection(prevSection);
    }
  };

  // --- Sub-Topic Physics Simulation States ---

  // Track mode ('simulator' vs 'video') for each of the 9 tabs individually
  const [sandboxMode, setSandboxMode] = useState<Record<TabId, 'simulator' | 'video'>>({
    'faraday-laws': 'simulator',
    'magnetic-flux': 'simulator',
    'faraday-experiments': 'simulator',
    'lenzs-law': 'simulator',
    'self-induction': 'simulator',
    'mutual-induction': 'simulator',
    'motional-emf': 'simulator',
    'eddy-currents': 'simulator',
    'ac-generator': 'simulator'
  });

  // Faraday's Law States
  const [magnetAction, setMagnetAction] = useState<'towards' | 'stationary' | 'away'>('towards');
  const [speed, setSpeed] = useState<'slow' | 'fast'>('fast');
  const [turns, setTurns] = useState<'few' | 'more'>('more');
  const [isFaradayAnimating, setIsFaradayAnimating] = useState(false);

  // Magnetic Flux States
  const [fluxB, setFluxB] = useState<number>(1.5); 
  const [fluxA, setFluxA] = useState<number>(2.0); 
  const [fluxAngle, setFluxAngle] = useState<number>(0); 

  // Faraday's Experiments Trial Board States
  const [expTrial, setExpTrial] = useState<string>('moving-in');
  const [trialAnimating, setTrialAnimating] = useState(false);
  const [needleDeflection, setNeedleDeflection] = useState(0); 

  // Lenz's Law States
  const [lenzDirection, setLenzDirection] = useState<'towards' | 'away'>('towards');

  // Self Induction States
  const [selfN, setSelfN] = useState<number>(600); 
  const [selfArea, setSelfArea] = useState<number>(12); 
  const [selfLength, setSelfLength] = useState<number>(25); 
  const [selfCore, setSelfCore] = useState<'air' | 'iron' | 'ferrite'>('ferrite');
  const [selfDeltaI, setSelfDeltaI] = useState<number>(4.0); 
  const [selfDeltaT, setSelfDeltaT] = useState<number>(0.1); 
  const [selfShowAns, setSelfShowAns] = useState<boolean>(false);

  // Mutual Induction States
  const [mutualN1, setMutualN1] = useState<number>(120); 
  const [mutualN2, setMutualN2] = useState<number>(300); 
  const [mutualCore, setMutualCore] = useState<'air' | 'iron'>('iron');
  const [mutualDeltaI1, setMutualDeltaI1] = useState<number>(5.0); 
  const [mutualDeltaT, setMutualDeltaT] = useState<number>(0.2); 
  const [mutualDistance, setMutualDistance] = useState<'closest' | 'medium' | 'far'>('closest');
  const [mutualShowAns, setMutualShowAns] = useState<boolean>(false);

  // Motional EMF States
  const [motionalB, setMotionalB] = useState<number>(1.2); 
  const [motionalV, setMotionalV] = useState<number>(4.0); 
  const [motionalL, setMotionalL] = useState<number>(1.5); 
  const [motionalAngle, setMotionalAngle] = useState<number>(90); 
  const [isRotatingConductor, setIsRotatingConductor] = useState<boolean>(false);
  const [motionalOmega, setMotionalOmega] = useState<number>(8.0); 

  // Eddy Currents States
  const [eddyType, setEddyType] = useState<'solid' | 'slotted'>('solid');
  const [isEddySwinging, setIsEddySwinging] = useState<boolean>(false);
  const [eddyDampedAngle, setEddyDampedAngle] = useState<number>(0);

  // AC Generator States
  const [genRPM, setGenRPM] = useState<number>(600);
  const [genPoles, setGenPoles] = useState<number>(2);
  const [genN, setGenN] = useState<number>(200);
  const [genB, setGenB] = useState<number>(1.8); 
  const [genArea, setGenArea] = useState<number>(1.0); 
  const [genAngle, setGenAngle] = useState<number>(0); 
  const [isGenRunning, setIsGenRunning] = useState<boolean>(false);

  // Generator rotation simulation
  useEffect(() => {
    let animId: number;
    if (isGenRunning) {
      const updateAngle = () => {
        const degreeIncrement = (genRPM / 60) * 360 / 60; 
        setGenAngle(prev => (prev + degreeIncrement) % 360);
        animId = requestAnimationFrame(updateAngle);
      };
      animId = requestAnimationFrame(updateAngle);
    }
    return () => cancelAnimationFrame(animId);
  }, [isGenRunning, genRPM]);

  // Eddy current swing simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isEddySwinging) {
      const dampingFactor = eddyType === 'solid' ? 0.45 : 0.92;
      const initialAmplitude = 45; 
      let frame = 0;
      
      const swingTick = () => {
        frame++;
        const amplitude = initialAmplitude * Math.pow(dampingFactor, frame / 3);
        const angle = amplitude * Math.cos(frame * 0.4);
        
        if (Math.abs(angle) < 0.8) {
          setIsEddySwinging(false);
          setEddyDampedAngle(0);
        } else {
          setEddyDampedAngle(angle);
          timer = setTimeout(swingTick, 50);
        }
      };
      
      swingTick();
    } else {
      setEddyDampedAngle(0);
    }
    return () => clearTimeout(timer);
  }, [isEddySwinging, eddyType]);

  // Galvanometer Needle helper for Faraday's Tab
  const getFaradayNeedleAngle = () => {
    if (magnetAction === 'stationary') return 0;
    const baseValue = speed === 'fast' ? 45 : 15;
    const sign = magnetAction === 'towards' ? 1 : -1;
    return baseValue * sign;
  };

  // Run a visual trigger for Faraday animation
  const playFaradayAction = (action: 'towards' | 'stationary' | 'away') => {
    setMagnetAction(action);
    setIsFaradayAnimating(true);
    setTimeout(() => setIsFaradayAnimating(false), 800);
  };

  // Run Faraday Trial Board Simulation
  const runTrial = (trialKey: string) => {
    setExpTrial(trialKey);
    setTrialAnimating(true);
    
    if (trialKey === 'moving-in') {
      setNeedleDeflection(45);
      setTimeout(() => setNeedleDeflection(0), 1000);
    } else if (trialKey === 'moving-out') {
      setNeedleDeflection(-45);
      setTimeout(() => setNeedleDeflection(0), 1000);
    } else if (trialKey === 'stationary') {
      setNeedleDeflection(0);
    } else if (trialKey === 'moving-coil') {
      setNeedleDeflection(35);
      setTimeout(() => setNeedleDeflection(0), 1000);
    } else if (trialKey === 'high-turns') {
      setNeedleDeflection(75);
      setTimeout(() => setNeedleDeflection(0), 1200);
    }

    setTimeout(() => {
      setTrialAnimating(false);
    }, 1200);
  };

  const renderSandboxHeaderAndMode = (
    tabName: TabId, 
    title: string, 
    IconComponent: any, 
    colorClass: string = "text-amber-500"
  ) => {
    const isSimMode = sandboxMode[tabName] === 'simulator';
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-2.5 mb-4 w-full select-none">
        <h3 className="text-slate-900 font-extrabold text-xs sm:text-sm uppercase tracking-wide flex items-center gap-2">
          <IconComponent className={`w-4 h-4 ${colorClass} ${isSimMode && tabName === 'ac-generator' ? 'animate-pulse' : ''}`} />
          <span>{isSimMode ? title : "Conceptual Walkthrough Video"}</span>
        </h3>
        <div className="flex bg-slate-100 p-0.5 rounded-xl text-[10px] font-black shrink-0 border border-slate-200 self-end sm:self-auto">
          <button
            onClick={() => setSandboxMode(prev => ({ ...prev, [tabName]: 'simulator' }))}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-[9.5px] uppercase cursor-pointer font-bold ${
              isSimMode
                ? 'bg-white text-slate-950 shadow-xs border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🕹️ Live Simulator
          </button>
          <button
            onClick={() => setSandboxMode(prev => ({ ...prev, [tabName]: 'video' }))}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-[9.5px] uppercase cursor-pointer font-bold ${
              !isSimMode
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🎥 Walkthrough Video
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white text-slate-800 rounded-3xl border border-slate-200 shadow-xl overflow-hidden font-sans my-4" id="emi-interactive-guide-light">
      
      {/* Top Banner (Pure Light Style) */}
      <div className="bg-gradient-to-r from-orange-50 via-slate-50 to-orange-50 p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-black text-orange-600 tracking-wider flex items-center gap-1.5 bg-orange-100/70 px-2.5 py-1 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Lab Workbook
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase mt-1.5 font-bold">
            Chapter 6: Electromagnetic Induction Laboratory
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Visualize coils induction, magnetic flux variations, and AC dynamics inside a structured classroom layout.
          </p>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm shrink-0 select-none">
          <span className="text-[10px] font-extrabold text-slate-700 tracking-wider font-mono uppercase">
            STUDY LOUNGE ACTIVE
          </span>
        </div>
      </div>

      {/* THREE GRAND SECTIONS NAV BAR (User requested Section 1, 2, 3 in order) */}
      <div className="bg-slate-50 p-3 border-b border-slate-200">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5 pl-1">
          Select Main Workbook Section:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {sectionsList.map((sec) => {
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleSectionChange(sec.id)}
                className={`text-left p-3.5 rounded-2xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-500 to-[#FF6B00] text-white border-orange-600 shadow-md transform scale-[1.01]'
                    : 'bg-white hover:bg-slate-100/70 text-slate-750 border-slate-200 hover:border-slate-350'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest ${isSelected ? 'text-orange-100' : 'text-slate-400'}`}>
                    {sec.id.replace('-', ' ')}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-100' : 'text-slate-400'}`} />
                </div>
                <h4 className="font-extrabold text-xs mt-1">{sec.label}</h4>
                <p className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-orange-50/80' : 'text-slate-500'}`}>
                  {sec.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* WORKBOOK TAB SUB-LEVEL (Shows only topics belonging to current selected section) */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mr-2 font-bold select-none">
          Active Topic:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sectionTabs[activeSection].map((tabId) => {
            const tabConf = tabsMap[tabId];
            const Icon = tabConf.icon;
            const isCurrent = activeTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-[11px] font-extrabold uppercase transition-all duration-150 cursor-pointer border ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-slate-950 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-650 border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-orange-400' : tabConf.color}`} />
                <span>{tabConf.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN STUDY INTERACTIVE WORKPLACE */}
      <div className="p-5 sm:p-6 bg-slate-50/50">

        {/* Play/Practice selection mode toggle */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center p-3.5 sm:p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm gap-3">
          <div className="max-w-md">
            <h3 className="text-[12.5px] font-black uppercase text-slate-800 tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
              Integrated Visual Learning Suite
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              Engage the active visual learning laboratory: toggle on-the-fly between interactive custom virtual sandboxes and rich lesson videos.
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('sandbox')}
              className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all duration-150 w-full md:w-auto cursor-pointer ${
                viewMode === 'sandbox'
                  ? 'bg-white text-slate-900 border border-slate-250 shadow-sm shadow-slate-200'
                  : 'text-slate-650 hover:text-slate-800 border border-transparent'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>🕹️ Physics Lab</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('video')}
              className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all duration-150 w-full md:w-auto cursor-pointer ${
                viewMode === 'video'
                  ? 'bg-slate-900 text-white border border-slate-950 shadow-sm shadow-slate-900'
                  : 'text-slate-650 hover:text-slate-805 border border-transparent hover:text-slate-800'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>📺 Concept Videos</span>
            </button>
          </div>
        </div>

        {viewMode === 'video' ? (
          <ConceptVideoHub activeTab={activeTab} />
        ) : (
          <>
            {/* 1. FARADAY'S LAWS OF ELECTROMAGNETIC INDUCTION */}
            {activeTab === 'faraday-laws' && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4.5 rounded-2xl leading-relaxed shadow-sm">
              <span className="font-extrabold uppercase text-[9px] text-amber-700 tracking-wider block mb-1">
                Central Principle:
              </span>
              Whenever the magnetic flux linked with a circuit changes, an electromotive force (emf) is induced. This voltage is directly proportional to the speed and turns count.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Theory Columns (Bright Styled cards) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2.5 border-b border-slate-100 pb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-lg uppercase">
                      First Law
                    </span>
                    <h3 className="text-slate-900 font-extrabold text-xs sm:text-sm">Nature of EMF</h3>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    An emf is induced in a coil <strong className="text-slate-900">if and only if</strong> the magnetic flux lines crossing through its area are changing over time.
                  </p>
                  <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] space-y-1">
                    <p className="text-slate-700 font-bold">Rule Comparison:</p>
                    <ul className="list-disc pl-4 text-slate-600 font-semibold space-y-0.5">
                      <li>Flux Change &ne; 0 &rArr; Current flows (G deflects)</li>
                      <li>Constant Flux &rArr; No induction (G stays at 0)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2 mb-2.5 border-b border-slate-100 pb-2">
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-lg uppercase">
                      Second Law
                    </span>
                    <h3 className="text-slate-900 font-extrabold text-xs sm:text-sm">Magnitude Formulation</h3>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed mb-3">
                    The induced voltage magnitude is the product of turns N and the negative rate of flux change:
                  </p>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                    <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Standard textbook formula</span>
                    <div className="text-xl font-mono text-emerald-600 font-extrabold tracking-wider">
                      e = -N &middot; (&Delta;&Phi;_B / &Delta;t)
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center gap-2 mb-1 border-b border-slate-150 pb-2">
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-lg uppercase">
                      Educational Reference
                    </span>
                    <h3 className="text-slate-900 font-extrabold text-xs sm:text-sm">Induction Schematic Representation</h3>
                  </div>
                  <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
                    Refer below to the official visual diagram representing magnet pushes and wire lines sweeps:
                  </p>
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-white p-1.5 shadow-sm">
                    <img 
                      src="/electromagnetic_induction_diagram.png" 
                      alt="Electromagnetic Induction Diagram" 
                      className="w-full h-auto object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Simulation Column */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  {renderSandboxHeaderAndMode('faraday-laws', 'Laboratory Sandbox Setup', Zap, 'text-amber-500')}

                  {sandboxMode['faraday-laws'] === 'simulator' ? (
                    <>
                      {/* Sandbox display */}
                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                        
                        {isFaradayAnimating && magnetAction !== 'stationary' && (
                          <div className="absolute inset-0 bg-orange-100/10 pointer-events-none flex justify-center items-center">
                            <div className={`w-64 h-32 border-2 ${magnetAction === 'towards' ? 'border-amber-400/20 scale-125' : 'border-indigo-400/20 scale-75'} rounded-full animate-ping duration-1000`}></div>
                          </div>
                        )}

                        {/* Galvanometer */}
                        <div className="w-28 h-20 border border-slate-250 bg-white rounded-t-full relative flex flex-col justify-end items-center mb-6 pt-1 shadow-sm">
                          <span className="absolute top-1.5 text-[8.5px] font-mono font-bold text-slate-500">GALVANOMETER G</span>
                          <div className="absolute inset-x-2 bottom-0 h-0.5 bg-slate-200"></div>
                          
                          <div className="absolute inset-x-3 bottom-0 h-10 flex justify-between text-[7px] text-slate-400 font-mono font-bold px-2.5">
                            <span className="text-rose-500">-50</span>
                            <span>0</span>
                            <span className="text-emerald-500">+50</span>
                          </div>

                          <div className="w-3 h-3 rounded-full bg-slate-800 border bg-[#FF6B00] border-white mb-2 relative z-10 shadow"></div>
                          <div
                            className="absolute bottom-3 w-0.5 h-12 bg-rose-500 origin-bottom rounded-t-full transition-transform duration-300"
                            style={{
                              transform: `rotate(${getFaradayNeedleAngle()}deg)`,
                              left: 'calc(50% - 1px)'
                            }}
                          ></div>
                        </div>

                        {/* Wire loops and Magnet system */}
                        <div className="w-full flex items-center justify-between gap-4 max-w-sm relative py-2">
                          {/* Bar Magnet */}
                          <div
                            className={`w-32 h-10 rounded-xl flex border border-slate-300 font-extrabold shadow-md transition-all duration-500 select-none ${
                              magnetAction === 'towards'
                                ? isFaradayAnimating
                                  ? 'translate-x-12 scale-105 shadow-orange-100'
                                  : 'translate-x-3'
                                : magnetAction === 'away'
                                ? isFaradayAnimating
                                  ? '-translate-x-4 scale-95'
                                  : 'translate-x-0'
                                : 'translate-x-6'
                            }`}
                          >
                            <div className="flex-1 bg-gradient-to-br from-red-500 to-red-650 rounded-l-xl flex items-center justify-center text-xs text-white">
                              <span>N</span>
                            </div>
                            <div className="flex-1 bg-gradient-to-br from-indigo-500 to-indigo-650 rounded-r-xl flex items-center justify-center text-xs text-white">
                              <span>S</span>
                            </div>
                            
                            {magnetAction === 'towards' && (
                              <div className="absolute -top-6 left-1/4 text-emerald-600 font-black text-[9px] animate-bounce bg-emerald-50 border border-emerald-150 px-1.5 py-0.5 rounded">
                                Pushing in &rarr;
                              </div>
                            )}
                            {magnetAction === 'away' && (
                              <div className="absolute -top-6 left-1/4 text-orange-600 font-black text-[9px] animate-bounce bg-orange-50 border border-orange-150 px-1.5 py-0.5 rounded">
                                &larr; Pulling out
                              </div>
                            )}
                            {magnetAction === 'stationary' && (
                              <div className="absolute -top-6 left-1/4 text-slate-500 font-bold text-[8.5px] bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                                Stationary
                              </div>
                            )}
                          </div>

                          {/* Coil Windings */}
                          <div className="relative shrink-0">
                            <div className="flex flex-col gap-0.5 select-none">
                              {Array.from({ length: turns === 'more' ? 6 : 3 }).map((_, idx) => (
                                <div
                                  key={idx}
                                  className="w-8 h-8 border-3 border-amber-500 rounded-full bg-transparent flex items-center justify-center -my-3 relative shadow-sm transition-all duration-350"
                                  style={{
                                    transform: 'rotateX(55deg) rotateY(5deg)',
                                    zIndex: 10 - idx
                                  }}
                                />
                              ))}
                            </div>
                            <div className="absolute left-1/2 top-4 w-10 h-16 border-b border-r border-slate-300 rounded-br-xl -z-10 bg-transparent" />
                            <div className="absolute left-4 top-10 w-16 h-12 border-b border-l border-slate-300 rounded-bl-xl -z-10 bg-transparent" />
                          </div>
                        </div>

                      </div>

                      {/* SandBox Controls (Light Gray Buttons) */}
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => playFaradayAction('towards')}
                            className={`py-2 px-1 text-[10.5px] font-black uppercase rounded-xl border cursor-pointer transition-all ${
                              magnetAction === 'towards'
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            Push Magnet In
                          </button>
                          <button
                            onClick={() => playFaradayAction('stationary')}
                            className={`py-2 px-1 text-[10.5px] font-black uppercase rounded-xl border cursor-pointer transition-all ${
                              magnetAction === 'stationary'
                                ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            Keep Still
                          </button>
                          <button
                            onClick={() => playFaradayAction('away')}
                            className={`py-2 px-1 text-[10.5px] font-black uppercase rounded-xl border cursor-pointer transition-all ${
                              magnetAction === 'away'
                                ? 'bg-orange-600 text-white border-orange-750 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            Pull Magnet Out
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 flex">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Magnet Speed:</span>
                            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 select-none">
                              {(['slow', 'fast'] as const).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => setSpeed(s)}
                                  className={`flex-1 py-1 text-[10px] font-extrabold rounded-lg uppercase cursor-pointer ${
                                    speed === s ? 'bg-white text-orange-600 font-black shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Coil Turn (N):</span>
                            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 select-none">
                              {(['few', 'more'] as const).map((t) => (
                                <button
                                  key={t}
                                  onClick={() => setTurns(t)}
                                  className={`flex-1 py-1 text-[10px] font-extrabold rounded-lg uppercase cursor-pointer ${
                                    turns === t ? 'bg-white text-indigo-600 font-black shadow-sm' : 'text-slate-500 hover:text-slate-805'
                                  }`}
                                >
                                  {t === 'few' ? '4 Turns' : '12 Turns'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-slate-700 mt-4 text-[11px] leading-relaxed">
                        <span className="font-bold text-orange-600 uppercase tracking-wide">Output Observation:</span>
                        <p className="mt-1 font-medium">
                          {magnetAction === 'stationary' ? (
                            <span>Flux integrated is constant. Temporal derivative is zero. Thus, <strong>voltage e = 0 V</strong>. No current is registered.</span>
                          ) : (
                            <span>
                              The magnet sweeps field lines. Since turn count <strong>N = {turns === 'more' ? '12' : '4'}</strong> and motion rate is <strong>{speed === 'fast' ? 'HIGH' : 'LOW'}</strong>, the computed instantaneous EMF peaks at <strong>{speed === 'fast' && turns === 'more' ? 'MAX DEFLECTION (~2.5 V)' : 'SMALL DEFLECTION (~0.8 V)'}</strong>!
                            </span>
                          )}
                        </p>
                      </div>
                    </>
                  ) : (
                    <ConceptVideoPlayer tabId="faraday-laws" />
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. MAGNETIC FLUX EXPLORER */}
        {activeTab === 'magnetic-flux' && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            <div className="bg-teal-50 border border-teal-200 text-teal-900 p-4.5 rounded-2xl leading-relaxed shadow-sm">
              <span className="font-extrabold uppercase text-[9px] text-teal-700 tracking-wider block mb-1">
                Theorem definition:
              </span>
              Magnetic Flux (&Phi;_B) is the dot product of Magnetic Field vector B and loop Area normal vector A. It represents the count of lines piercing through the loop area.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Sliders and math */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-4">
                  <span className="bg-teal-150 text-teal-800 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase bg-teal-100">
                    Flux formulation
                  </span>
                  
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-center">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold mb-0.5">Calculable equation:</span>
                    <code className="text-lg font-mono font-extrabold text-teal-600 block">
                      &Phi;_B = B &middot; A &middot; cos(&theta;)
                    </code>
                  </div>

                  {/* Factor Sliders */}
                  <div className="space-y-3.5 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px] text-slate-650">
                        <span>Field Strength (B):</span>
                        <span className="text-teal-600">{fluxB.toFixed(1)} Tesla</span>
                      </div>
                      <input 
                        type="range" min="0.5" max="3.0" step="0.5" value={fluxB}
                        onChange={(e) => setFluxB(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px] text-slate-650">
                        <span>Loop Area size (A):</span>
                        <span className="text-teal-600">{fluxA.toFixed(1)} m²</span>
                      </div>
                      <input 
                        type="range" min="1.0" max="3.0" step="0.5" value={fluxA}
                        onChange={(e) => setFluxA(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10.5px] font-bold text-slate-600 block">Angle of Tilt (&theta;):</span>
                      <div className="grid grid-cols-4 gap-1">
                        {[0, 30, 60, 90].map((deg) => (
                          <button
                            key={deg}
                            onClick={() => setFluxAngle(deg)}
                            className={`py-1 text-[11px] font-mono font-black rounded-lg border cursor-pointer ${
                              fluxAngle === deg 
                                ? 'bg-teal-600 border-teal-700 text-white shadow'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {deg}&deg;
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Flux calculus output block */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-250 font-mono text-xs">
                    <div className="flex justify-between font-bold text-slate-605 border-b border-slate-200 pb-1.5 mb-1.5">
                      <span>B &middot; A &middot; cos(&theta;)</span>
                      <span>Value (Weber)</span>
                    </div>
                    <p className="text-slate-600">{fluxB.toFixed(1)} T &middot; {fluxA.toFixed(1)} m² &middot; cos({fluxAngle}&deg;)</p>
                    <p className="text-teal-700 font-extrabold text-sm mt-1.5">
                      &Phi;_B = {(fluxB * fluxA * Math.cos((fluxAngle * Math.PI) / 180)).toFixed(3)} Weber (Wb)
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphical Area tilt */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  {renderSandboxHeaderAndMode('magnetic-flux', 'Visual Vector Piercing Factor', Compass, 'text-teal-600')}

                  {sandboxMode['magnetic-flux'] === 'simulator' ? (
                    <>
                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-around gap-4 min-h-[180px]">
                        
                        <div className="relative w-44 h-32 flex justify-center items-center">
                          {/* B-field lines */}
                          <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-20">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <div key={idx} className="w-full border-t border-dashed border-teal-500" />
                            ))}
                          </div>

                          {/* Tilted Ring */}
                          <div
                            className="border-3 border-amber-600 rounded-full w-20 h-20 bg-amber-500/10 flex items-center justify-center transition-all duration-300 relative shadow-inner"
                            style={{ transform: `rotateY(${fluxAngle}deg)` }}
                          >
                            {/* Area normal vector */}
                            <div className="absolute w-24 h-0.5 bg-rose-500 top-1/2 left-1/2 origin-left">
                              <span className="absolute -right-3 -top-2 text-[8px] font-mono font-black text-rose-600">A</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 max-w-xs space-y-2 text-slate-705">
                          <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-bold uppercase block w-fit">
                            Dynamic Interpretation:
                          </span>
                          <p className="font-semibold text-slate-800 leading-snug">
                            {fluxAngle === 0 ? (
                              <span>Field is **perpendicular** to the page face plane. The normal vector A is aligned (&theta;=0&deg;). **MAXIMUM FLUX** cuts copper loop area.</span>
                            ) : fluxAngle === 90 ? (
                              <span>Field lines run parallel to the loop face. Normal vector is orthogonal (&theta;=90&deg;). **ZERO FLUX** pierces the surface area.</span>
                            ) : (
                              <span>The loop is tilted. Only the transverse scalar vector projected component **(B cos &theta;)** actively cuts.</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10.5px] mt-4 font-semibold text-slate-650">
                        <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                          <strong className="text-slate-900 block font-extrabold uppercase text-[9px] mb-0.5 text-orange-600">1. Magnet Field Strength (B)</strong>
                          B is directly proportional to line density and flux value.
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                          <strong className="text-slate-900 block font-extrabold uppercase text-[9px] mb-0.5 text-indigo-600">2. Surface Loop area (A)</strong>
                          Wider area collects more force field lines of penetration.
                        </div>
                      </div>
                    </>
                  ) : (
                    <ConceptVideoPlayer tabId="magnetic-flux" />
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. FARADAY'S EXPERIMENTS TRIAL BOARD */}
        {activeTab === 'faraday-experiments' && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-4.5 rounded-2xl shadow-sm">
              <span className="font-extrabold uppercase text-[9px] text-indigo-700 tracking-wider block mb-1">
                Classic Experimentation log:
              </span>
              Relive the 1830 series. It's not the static magnetism, but rather the rapid fluxes that generate current in the copper windings.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-5 space-y-3">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block leading-none select-none">
                  Choose Textbook Trial:
                </span>

                {[
                  { id: 'moving-in', title: '1. Moving Magnet into Coil', desc: 'Slight deflection to the right on entry while motion exists.' },
                  { id: 'moving-out', title: '2. Moving Magnet Out', desc: 'Needle deflexes in opposite (negative) way on removal.' },
                  { id: 'stationary', title: '3. Stationary in Coil', desc: 'Magnet inside coil but non-moving. Deflexion vanishes instantly.' },
                  { id: 'moving-coil', title: '4. Moving Coil over Magnet', desc: 'Relative motion proves coil motion prompts equal emf.' },
                  { id: 'high-turns', title: '5. Fast Push with High N', desc: 'Fast rate of sweep and strong turns creates max voltage.' }
                ].map((trial) => (
                  <button
                    key={trial.id}
                    onClick={() => runTrial(trial.id)}
                    className={`text-left w-full p-3 rounded-2xl border transition-all cursor-pointer ${
                      expTrial === trial.id 
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="font-extrabold text-xs">{trial.title}</div>
                    <div className="text-[10.5px] font-semibold text-slate-500 mt-0.5">{trial.desc}</div>
                  </button>
                ))}
              </div>

              {/* Lab Visual screen */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  {renderSandboxHeaderAndMode('faraday-experiments', 'Active Coil Laboratory Screen', Compass, 'text-rose-600')}

                  {sandboxMode['faraday-experiments'] === 'simulator' ? (
                    <>
                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden">
                        
                        {/* Deflection Needle */}
                        <div className="w-24 h-18 border border-slate-300 bg-white rounded-t-full relative flex flex-col justify-end items-center mb-6 shadow-sm">
                          <div className="absolute top-1 text-[8px] font-mono text-slate-400">GALVANOMETER</div>
                          <div className="w-2 h-2 rounded-full bg-[#FF6B00] mb-1.5" />
                          <div 
                            className="absolute bottom-2.5 w-0.5 h-10 bg-rose-500 origin-bottom transition-transform duration-500"
                            style={{ transform: `rotate(${needleDeflection}deg)`, left: 'calc(50% - 1px)' }}
                          />
                        </div>

                        <div className="flex gap-4 items-center">
                          <Compass className={`w-8 h-8 text-indigo-600 ${trialAnimating ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                          <div className="bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm text-center">
                            <span className="text-[8px] uppercase tracking-wider block text-slate-400 font-bold">Induced Current Status</span>
                            <strong className="text-slate-800 text-xs font-mono">
                              {needleDeflection === 0 ? '0.00 mA (Null)' : `${(needleDeflection * 0.12).toFixed(2)} mA`}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-150 text-[11px] leading-relaxed text-indigo-900 mt-4">
                        <span className="font-extrabold uppercase block text-[9px] tracking-wide text-indigo-700">Lab Trial Log:</span>
                        <p className="mt-1 font-semibold leading-snug">
                          {expTrial === 'stationary' ? (
                            <span>Flux integrated remains idle. Deflexion is absolutely zero since relative distance change is stagnant.</span>
                          ) : (
                            <span>
                              Executing trial sweep. Copper coils cut the field. Instant flux change causes active flow! Galvanometer pointer shifted to **{needleDeflection}&deg;**.
                            </span>
                          )}
                        </p>
                      </div>
                    </>
                  ) : (
                    <ConceptVideoPlayer tabId="faraday-experiments" />
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 4. LENZ'S LAW */}
        {activeTab === 'lenzs-law' && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            <div className="bg-orange-50 border border-orange-200 text-orange-950 p-4.5 rounded-2xl shadow-sm leading-relaxed">
              <span className="font-extrabold uppercase text-[9px] text-orange-700 block mb-0.5">Lenz's Law & Conservation of Energy (Heinrich Lenz, 1834):</span>
              <p className="font-extrabold italic text-slate-900 leading-snug">
                "The polarity of the induced emf is such that it tends to produce a current which opposes the change in magnetic flux that produced it."
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-3">
                  <span className="text-[10px] bg-orange-100 text-orange-850 px-2.5 py-0.5 rounded-lg uppercase font-black block w-fit">
                    Thermodynamic Proof
                  </span>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    If the induced current didn't oppose flux change, a magnet pushed towards a loop would be pulled in with acceleration, generating current and heat without any mechanical push. This would breach the **Law of Conservation of Energy**!
                  </p>
                  <p className="p-3 bg-slate-50 border border-slate-150 text-[11px] font-semibold text-slate-700 rounded-xl leading-snug">
                    &bull; The physical work done pushing against the loop's magnetic opposition converts directly into electrical voltage inside coil windings!
                  </p>
                </div>
              </div>

              {/* Lenz illustration */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  {renderSandboxHeaderAndMode('lenzs-law', 'Polarity Repulsion Sandbox', Activity, 'text-orange-600')}

                  {sandboxMode['lenzs-law'] === 'simulator' ? (
                    <>
                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[180px] gap-4 relative overflow-hidden">
                        
                        <div className="flex bg-slate-150 p-0.5 rounded-xl border border-slate-200 absolute top-3">
                          <button 
                            onClick={() => setLenzDirection('towards')}
                            className={`py-1 px-3 text-[10px] font-black rounded-lg uppercase cursor-pointer ${lenzDirection === 'towards' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
                          >
                            Pushing N-Pole In
                          </button>
                          <button 
                            onClick={() => setLenzDirection('away')}
                            className={`py-1 px-3 text-[10px] font-black rounded-lg uppercase cursor-pointer ${lenzDirection === 'away' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
                          >
                            Pulling N-Pole Out
                          </button>
                        </div>

                        <div className="w-full flex items-center justify-around gap-2 mt-8">
                          {/* Magnet */}
                          <div className="flex border border-slate-350 rounded-xl w-28 h-8 font-mono text-center font-bold text-white shadow-sm overflow-hidden shrink-0 select-none">
                            <div className="flex-1 bg-red-500 py-1.5">N</div>
                            <div className="flex-1 bg-indigo-500 py-1.5">S</div>
                          </div>

                          {/* Opposing Arrow */}
                          <div className="text-center">
                            <span className="text-[9px] font-black text-rose-500 block uppercase tracking-wider animate-pulse">
                              {lenzDirection === 'towards' ? 'Opposition' : 'Attraction'}
                            </span>
                            <div className="text-xl text-slate-500">&harr;</div>
                          </div>

                          {/* Loop with induced current direction */}
                          <div className="w-16 h-16 border-4 border-amber-500 rounded-full bg-amber-50 flex items-center justify-center relative shadow-sm">
                            <span className="text-xs font-black font-mono text-slate-800">
                              {lenzDirection === 'towards' ? 'CCW (N)' : 'CW (S)'}
                            </span>
                            <div className="absolute -top-5 text-[8px] font-bold text-orange-600 tracking-wider">
                              Induced Face
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="bg-orange-50/70 p-4 rounded-xl border border-orange-150 text-[11px] leading-relaxed text-orange-950 mt-4 font-semibold">
                        <span>Physical polarity status: </span>
                        {lenzDirection === 'towards' ? (
                          <span>Loop generates a **North polarity** face. Pushing is resisted by repelling poles. Mechanical work done to push converts to current.</span>
                        ) : (
                          <span>Loop generates a **South polarity** face. Pulling is resisted by magnetic attraction. Work done pulling converts to current.</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <ConceptVideoPlayer tabId="lenzs-law" />
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 5. SELF INDUCTION */}
        {activeTab === 'self-induction' && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4.5 rounded-2xl shadow-sm leading-relaxed">
              <span className="font-extrabold uppercase text-[9px] text-emerald-700 block mb-1">
                Self Induction Theorem:
              </span>
              When current inside a single isolated coil changes, it induces a backing electromotive force in itself to resist that change. This is the electromagnetic analogue of mechanical inertia.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Sliders factors */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-3.5">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase">
                    Solenoid parameters
                  </span>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px] text-slate-650">
                        <span>Turns Count (N):</span>
                        <span className="text-emerald-600 font-mono">{selfN} Turns</span>
                      </div>
                      <input 
                        type="range" min="100" max="1000" step="50" value={selfN}
                        onChange={(e) => setSelfN(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px] text-slate-650">
                        <span>Core Area (A):</span>
                        <span className="text-emerald-600 font-mono">{selfArea} cm²</span>
                      </div>
                      <input 
                        type="range" min="5" max="30" step="1" value={selfArea}
                        onChange={(e) => setSelfArea(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px] text-slate-650">
                        <span>Solenoid Length (l):</span>
                        <span className="text-emerald-600 font-mono">{selfLength} cm</span>
                      </div>
                      <input 
                        type="range" min="10" max="60" step="2" value={selfLength}
                        onChange={(e) => setSelfLength(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10.5px] font-bold text-slate-600 block">Magnetic Path Core material:</span>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'air', label: 'Air (μ_r=1)' },
                          { id: 'ferrite', label: 'Ferrite (μ_r=300)' },
                          { id: 'iron', label: 'Iron (μ_r=600)' }
                        ].map((core) => (
                          <button
                            key={core.id}
                            onClick={() => setSelfCore(core.id as any)}
                            className={`py-1 text-[10px] font-black rounded-lg border cursor-pointer uppercase ${selfCore === core.id ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-250'}`}
                          >
                            {core.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Screen */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  {renderSandboxHeaderAndMode('self-induction', 'Computed Inductance & Back EMF', Zap, 'text-emerald-500')}

                  {(() => {
                    const mu_0 = 4 * Math.PI * 1e-7;
                    const mu_r = selfCore === 'air' ? 1 : selfCore === 'ferrite' ? 300 : 600;
                    const areaM2 = selfArea * 1e-4;
                    const lenM = selfLength * 1e-2;
                    const LVal = (mu_r * mu_0 * (selfN * selfN) * areaM2) / lenM; 
                    const selfEMF = LVal * (selfDeltaI / selfDeltaT);

                    return sandboxMode['self-induction'] === 'simulator' ? (
                      <div className="space-y-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center grid grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                            <span className="text-[9px] uppercase tracking-wider block text-slate-400 font-bold">Inductance (L)</span>
                            <span className="text-emerald-750 font-mono font-black text-sm block mt-0.5 text-emerald-600">
                              {LVal >= 1 ? `${LVal.toFixed(4)} H` : `${(LVal * 1000).toFixed(2)} mH`}
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                            <span className="text-[9px] uppercase tracking-wider block text-slate-400 font-bold">Induced Back e</span>
                            <span className="text-orange-600 font-mono font-black text-sm block mt-0.5">
                              {selfEMF.toFixed(4)} Volts
                            </span>
                          </div>
                        </div>

                        {/* Interactive Solenoid Coil Sandbox Visualizer */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[150px] relative overflow-hidden">
                          {/* Core background base representing different materials */}
                          <div className={`absolute w-44 h-10 rounded transition-colors duration-300 ${
                            selfCore === 'air' ? 'bg-slate-200/20 border border-dashed border-slate-300' :
                            selfCore === 'ferrite' ? 'bg-slate-700/80 border border-slate-800' :
                            'bg-slate-400/95 border border-slate-500 shadow-inner'
                          }`} />
                          
                          {/* Coil copper windings based on selfN */}
                          <div className="relative z-10 flex gap-0.5 justify-center items-center">
                            {Array.from({ length: Math.min(10, Math.max(3, Math.round(selfN / 80))) }).map((_, i) => (
                              <div key={i} className="relative w-4 h-12 flex items-center justify-center">
                                {/* Back side of the single turn loop */}
                                <div className="absolute w-1 h-12 bg-amber-700/60 rounded-md -left-0.5" />
                                {/* Front copper side */}
                                <div className="w-2.5 h-12 border-2 border-amber-500 rounded-full animate-pulse bg-transparent" style={{ transform: 'rotateY(40deg)', animationDuration: '2s' }} />
                                {/* Wire connections */}
                                <div className="absolute top-1/2 left-full w-2 h-0.5 bg-amber-500" />
                              </div>
                            ))}
                          </div>
                          
                          {/* Flux Arrows indicating back EMF opposition vectors */}
                          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between select-none font-bold text-xs pointer-events-none opacity-40">
                            <div className="text-orange-600 font-black text-[9px] animate-bounce bg-orange-50 border border-orange-100 px-1 rounded flex items-center gap-1">
                              &larr; Back EMF (e_back) opposes &Delta;I
                            </div>
                          </div>
                          
                          <span className="text-[8px] font-bold text-slate-400 mt-2 font-mono uppercase tracking-wider block">
                            Core Type: {selfCore.toUpperCase()} | Windings: {selfN} Turn count
                          </span>
                        </div>

                        {/* input change rates */}
                        <div className="border-t border-slate-150 pt-3 space-y-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-bold">Test Change parameters (dI/dt):</span>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-slate-500 text-[10.5px]">Current Shift &Delta;I (A):</span>
                              <input 
                                type="number" step="0.5" min="1" max="15" value={selfDeltaI}
                                onChange={(e) => setSelfDeltaI(parseFloat(e.target.value) || 2)}
                                className="bg-white border border-slate-200 rounded-lg p-1.5 text-center font-mono w-full font-bold focus:ring"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-slate-500 text-[10.5px]">Rise Time &Delta;t (sec):</span>
                              <input 
                                type="number" step="0.05" min="0.01" max="2" value={selfDeltaT}
                                onChange={(e) => setSelfDeltaT(parseFloat(e.target.value) || 0.1)}
                                className="bg-white border border-slate-200 rounded-lg p-1.5 text-center font-mono w-full font-bold focus:ring"
                              />
                            </div>
                          </div>
                        </div>

                        {/* textbook numerical steps */}
                        <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-emerald-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 font-serif">
                              <Award className="w-4 h-4 text-emerald-500" /> Solenoid Board Challenge
                            </span>
                            <button
                              onClick={() => setSelfShowAns(!selfShowAns)}
                              className="text-[9.5px] font-black text-slate-550 hover:text-slate-900 uppercase cursor-pointer underline"
                            >
                              {selfShowAns ? 'Hide Steps' : 'View Core Steps'}
                            </button>
                          </div>
                          <p className="text-slate-700 font-semibold text-[11px] leading-snug">
                            <strong>Standard Exercise:</strong> Solenoid of N = 600, Area = 12 cm², length = 25 cm, carrying a solid Ferrite core. If current falls to 0 in 0.1s from 4A, evaluate back EMF.
                          </p>
                          {selfShowAns && (
                            <div className="mt-3 p-3 bg-white border border-slate-200 text-slate-600 text-[11px] space-y-1 rounded-lg font-mono">
                              <p className="font-bold text-slate-800 underline">Calculations:</p>
                              <p>1. L = &mu;_r &mu;_0 N&sup2; A / l</p>
                              <p>2. L = 300 &middot; (4&pi; &times; 10&sup7;) &middot; 600&sup2; &middot; (12 &times; 10&sup4;) / 0.25 &approx; {LVal.toFixed(4)} Henrys</p>
                              <p>3. e_back = L &middot; (&Delta;I / &Delta;t)</p>
                              <p>4. e_back = {LVal.toFixed(4)} &middot; (4 A / 0.1 s) = <strong>{selfEMF.toFixed(4)} Volts</strong></p>
                            </div>
                          )}
                        </div>

                      </div>
                    ) : (
                      <ConceptVideoPlayer tabId="self-induction" />
                    );
                  })()}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 6. MUTUAL INDUCTION */}
        {activeTab === 'mutual-induction' && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            <div className="bg-violet-50 border border-violet-200 text-violet-950 p-4.5 rounded-2xl shadow-sm leading-relaxed">
              <span className="font-extrabold uppercase text-[9px] text-violet-700 block mb-1">
                Mutual Induction Theorem:
              </span>
              The physical mechanism where current shifts in a primary coil S1 induce a secondary counter voltage across neighboring coils S2 through electromagnetic coupling (M).
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-3.5">
                  <span className="bg-violet-100 text-violet-800 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase">
                    Coils configuration
                  </span>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px] text-slate-650">
                        <span>Primary Coils (N1):</span>
                        <span className="text-violet-600 font-mono">{mutualN1} Turns</span>
                      </div>
                      <input 
                        type="range" min="50" max="250" step="10" value={mutualN1}
                        onChange={(e) => setMutualN1(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px] text-slate-650">
                        <span>Secondary Coils (N2):</span>
                        <span className="text-violet-600 font-mono">{mutualN2} Turns</span>
                      </div>
                      <input 
                        type="range" min="100" max="500" step="25" value={mutualN2}
                        onChange={(e) => setMutualN2(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10.5px] font-bold text-slate-600 block">Coupling distance:</span>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'closest', label: 'Close (~90%)' },
                          { id: 'medium', label: 'Avg (~40%)' },
                          { id: 'far', label: 'Far (~8%)' }
                        ].map((dist) => (
                          <button
                            key={dist.id}
                            onClick={() => setMutualDistance(dist.id as any)}
                            className={`py-1 text-[10px] font-black rounded-lg border cursor-pointer uppercase ${mutualDistance === dist.id ? 'bg-violet-600 border-violet-700 text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'}`}
                          >
                            {dist.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation display board */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  {renderSandboxHeaderAndMode('mutual-induction', 'Coils Interactions Board', Workflow, 'text-violet-500')}

                  {(() => {
                    const k = mutualDistance === 'closest' ? 0.90 : mutualDistance === 'medium' ? 0.40 : 0.08;
                    const coreMutFactor = mutualCore === 'air' ? 1.0 : 600.0;
                    const MVal = k * coreMutFactor * (mutualN1 * mutualN2) * 1.5e-7; 
                    const inducedEmf2 = MVal * (mutualDeltaI1 / mutualDeltaT);

                    return sandboxMode['mutual-induction'] === 'simulator' ? (
                      <div className="space-y-4">
                        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-around min-h-[150px] gap-4 relative overflow-hidden">
                          
                          {MVal > 0.0001 && (
                            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 flex justify-between">
                              <span className="border-t-2 border-dashed border-violet-400 flex-1 h-3 animate-pulse" />
                              <span className="border-b-2 border-dashed border-violet-400 flex-1 h-3 animate-pulse" />
                            </div>
                          )}

                          {/* primary coil */}
                          <div className="text-center">
                            <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold font-mono">Primary Solenoid</span>
                            <div className="flex flex-col gap-0.5 justify-center mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-8 h-2.5 border-2 border-violet-500 rounded-full animate-pulse" />
                              ))}
                            </div>
                            <div className="text-[10px] text-violet-700 font-bold font-mono mt-1">I_1 = {mutualDeltaI1} A</div>
                          </div>

                          <div className="text-center">
                            <Workflow className="w-5 h-5 text-violet-500 animate-spin" style={{ animationDuration: '6s' }} />
                            <span className="text-[7.5px] font-mono text-slate-400 block mt-0.5 font-bold">Linked M</span>
                          </div>

                          {/* secondary coil */}
                          <div className="text-center">
                            <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold font-mono">Secondary Solenoid</span>
                            <div className="flex flex-col gap-0.5 justify-center mt-1">
                              {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="w-8 h-2.5 border-2 border-indigo-400 rounded-full animate-pulse" />
                              ))}
                            </div>
                            <div className="text-[10px] text-indigo-700 font-bold font-mono mt-1">e_2 = {inducedEmf2.toFixed(4)} V</div>
                          </div>

                        </div>

                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                            <span className="text-[9px] text-slate-400 block font-bold">Mutual Coupling Co-efficient (M)</span>
                            <span className="text-violet-700 font-mono font-black text-sm block mt-0.5">
                              {MVal >= 1 ? `${MVal.toFixed(4)} H` : `${(MVal * 1000).toFixed(2)} mH`}
                            </span>
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                            <span className="text-[9px] text-slate-400 block font-bold">Secondary Induced voltage (e_2)</span>
                            <span className="text-orange-600 font-mono font-black text-sm block mt-0.5">
                              {inducedEmf2.toFixed(4)} Volts
                            </span>
                          </div>
                        </div>

                        {/* input sliders and mutual numerical check */}
                        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[#FF6B00] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                              <Award className="w-4 h-4 text-orange-500" /> Mutual Induction Challenge
                            </span>
                            <button
                              onClick={() => setMutualShowAns(!mutualShowAns)}
                              className="text-[9.5px] font-black text-slate-550 hover:text-slate-900 uppercase cursor-pointer underline"
                            >
                              {mutualShowAns ? 'Hide Steps' : 'View Core Steps'}
                            </button>
                          </div>
                          <p className="text-slate-700 font-semibold text-[11px] leading-snug">
                            Two coils are coupled with mutual inductance <strong>M = 0.5 H</strong>. If current in the primary loop sweeps from <strong>2 A</strong> to <strong>6 A</strong> in a rapid interval of <strong>0.1 s</strong>, evaluate voltage.
                          </p>
                          {mutualShowAns && (
                            <div className="mt-3 p-3 bg-white border border-slate-200 text-slate-600 text-[11px] space-y-1.5 rounded-lg font-mono">
                              <p className="font-bold text-slate-800">Answer sequence:</p>
                              <p>1. &Delta;I_primary = 6A - 2A = 4A. Rise &Delta;t = 0.1s</p>
                              <p>2. e_2 = -M &middot; dI1/dt = -0.5 &middot; (4A / 0.1s) = <strong>-20 Volts</strong></p>
                            </div>
                          )}
                        </div>

                      </div>
                    ) : (
                      <ConceptVideoPlayer tabId="mutual-induction" />
                    );
                  })()}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 7. MOTIONAL EMF */}
        {activeTab === 'motional-emf' && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            <div className="bg-cyan-50 border border-cyan-200 text-cyan-950 p-4.5 rounded-2xl shadow-sm leading-relaxed">
              <span className="font-extrabold uppercase text-[9px] text-cyan-700 block mb-1">
                Motional EMF Theorem:
              </span>
              Terminal electric potential difference stands established whenever a conducting copper wire rod moves across static magnetic vectors cutting through force fields.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-3.5">
                  
                  <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setIsRotatingConductor(false)}
                      className={`flex-1 py-1.5 text-[9.5px] font-black uppercase rounded-lg cursor-pointer ${!isRotatingConductor ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Straight Sliding
                    </button>
                    <button
                      onClick={() => setIsRotatingConductor(true)}
                      className={`flex-1 py-1.5 text-[9.5px] font-black uppercase rounded-lg cursor-pointer ${isRotatingConductor ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Rotating Rod
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[9px] font-mono text-slate-400 block font-bold">Standard formula:</span>
                    <code className="text-md font-mono font-extrabold text-cyan-600">
                      {isRotatingConductor ? 'e = 1/2 &middot; B &middot; &omega; &middot; l²' : 'e = B &middot; v &middot; l &middot; sin(&theta;)'}
                    </code>
                  </div>

                  {/* Factor Sliders */}
                  <div className="space-y-3.5 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px] text-slate-650">
                        <span>Magnetic Field (B):</span>
                        <span className="text-cyan-600 font-mono">{motionalB.toFixed(1)} Tesla</span>
                      </div>
                      <input 
                        type="range" min="0.5" max="3" step="0.5" value={motionalB}
                        onChange={(e) => setMotionalB(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px] text-slate-650">
                        <span>Rod length (l):</span>
                        <span className="text-cyan-600 font-mono">{motionalL.toFixed(1)} m</span>
                      </div>
                      <input 
                        type="range" min="0.5" max="3" step="0.5" value={motionalL}
                        onChange={(e) => setMotionalL(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>

                    {!isRotatingConductor ? (
                      <div className="space-y-1 animate-fade-in">
                        <div className="flex justify-between font-bold text-[11px] text-slate-650">
                          <span>Conductive speed (v):</span>
                          <span className="text-cyan-600 font-mono">{motionalV.toFixed(1)} m/s</span>
                        </div>
                        <input 
                          type="range" min="1" max="10" step="1" value={motionalV}
                          onChange={(e) => setMotionalV(parseFloat(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1 animate-fade-in">
                        <div className="flex justify-between font-bold text-[11px] text-slate-650">
                          <span>Rotary speed (&omega;):</span>
                          <span className="text-cyan-600 font-mono">{motionalOmega} rad/s</span>
                        </div>
                        <input 
                          type="range" min="2" max="20" step="2" value={motionalOmega}
                          onChange={(e) => setMotionalOmega(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Simulation visual display */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  {renderSandboxHeaderAndMode('motional-emf', 'Conductor Sweep Area Sandbox', ShieldAlert, 'text-cyan-600')}

                  {(() => {
                    const emVal = isRotatingConductor 
                      ? 0.5 * motionalB * motionalOmega * (motionalL * motionalL)
                      : motionalB * motionalV * motionalL * Math.sin((motionalAngle * Math.PI) / 180);

                    return sandboxMode['motional-emf'] === 'simulator' ? (
                      <div className="space-y-4">
                        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                          
                          {/* Cross symbols for field */}
                          <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 gap-2 p-3 opacity-20 pointer-events-none">
                            {Array.from({ length: 18 }).map((_, idx) => (
                              <div key={idx} className="text-xs text-cyan-650 font-bold text-center select-none font-mono">x</div>
                            ))}
                          </div>

                          {!isRotatingConductor ? (
                            <div className="w-full max-w-xs mt-4 relative">
                              <span className="text-[8px] font-black text-orange-600 tracking-wider absolute -top-5 block">INWARD FIELD (B)</span>
                              <div className="w-full h-12 border border-slate-200 bg-white rounded-xl relative flex items-center">
                                <div 
                                  className="w-4 h-14 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-lg border-2 border-white absolute transition-all shadow shadow-cyan-300"
                                  style={{ left: `${30 + (motionalV * 5)}%` }}
                                />
                                <div className="absolute right-4 text-[8px] text-teal-600 uppercase font-black animate-pulse font-bold">&rarr; Velocity (v)</div>
                              </div>
                            </div>
                          ) : (
                            <div className="relative w-24 h-24 border-2 border-dashed border-cyan-400/40 rounded-full animate-spin flex items-center justify-center" style={{ animationDuration: `${25 / motionalOmega}s` }}>
                              <div className="w-1 h-12 bg-gradient-to-t from-cyan-400 to-indigo-600 origin-bottom absolute bottom-1/2 left-1/2 rounded" />
                              <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-amber-400 absolute z-10" />
                            </div>
                          )}
                        </div>

                        <div className="bg-slate-50 p-4.5 border border-slate-150 rounded-2xl">
                          <span className="text-[10px] uppercase font-black text-[#FF6B00] tracking-wider block">Induced potential (Motional EMF):</span>
                          <div className="text-xl font-mono font-extrabold text-cyan-705 text-cyan-750 block mt-0.5">
                            e = {emVal.toFixed(4)} Volts
                          </div>
                          <p className="text-[10.5px] text-slate-500 mt-1 leading-snug font-semibold">
                            {isRotatingConductor ? (
                              <span>Effective average velocity varies from zero at pivot to **&omega;l** at tip, giving an integrated average EMF value: **0.5 &middot; B &middot; &omega; &middot; l&sup2;**!</span>
                            ) : (
                              <span>Positive ions drift perpendicular to velocity and field lines, creating steady electromotive terminals output value: **B &middot; v &middot; l**!</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <ConceptVideoPlayer tabId="motional-emf" />
                    );
                  })()}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 8. EDDY CURRENTS (LOSSES & DAMPING) */}
        {activeTab === 'eddy-currents' && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            <div className="bg-rose-50 border border-rose-200 text-rose-950 p-4.5 rounded-2xl shadow-sm leading-relaxed">
              <span className="font-extrabold uppercase text-[9px] text-rose-700 block mb-1">
                Eddy Currents Theorem:
              </span>
              Circulating current loops induced inside solid flat bulks of metallic conductors when crossing magnetic fields. They yield massive undesirable **I&sup2;R resistive heat losses**.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-4">
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase">
                    Reduction parameters
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setEddyType('solid'); setIsEddySwinging(false); }}
                      className={`py-3 text-[10px] font-black uppercase rounded-xl border cursor-pointer ${eddyType === 'solid' ? 'bg-rose-600 border-rose-700 text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-105 text-slate-600 border-slate-200'}`}
                    >
                      Solid Plate (Uncut)
                    </button>
                    <button
                      onClick={() => { setEddyType('slotted'); setIsEddySwinging(false); }}
                      className={`py-3 text-[10px] font-black uppercase rounded-xl border cursor-pointer ${eddyType === 'slotted' ? 'bg-rose-600 border-rose-700 text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-105 text-slate-600 border-slate-200'}`}
                    >
                      Slotted Plate (Broken path)
                    </button>
                  </div>

                  <button
                    onClick={() => setIsEddySwinging(true)}
                    disabled={isEddySwinging}
                    className="w-full py-2.5 bg-slate-900 border border-slate-950 text-white text-[11px] font-extrabold uppercase tracking-wide rounded-xl disabled:opacity-40 cursor-pointer text-center hover:brightness-110 shadow-sm"
                  >
                    {isEddySwinging ? 'Test Swing Swirling...' : 'Engage Gravity Release Pendulum'}
                  </button>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-650 space-y-1.5 font-semibold">
                    <strong className="text-rose-700 uppercase text-[9.5px] block font-black">Countermeasure Techniques:</strong>
                    <ul className="list-disc pl-4 space-y-1 text-[11px]">
                      <li>**Laminated core plates** broken by non-conducting varnish.</li>
                      <li>**Cut slits or slits paths** that block large physical swirl diameters.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Swing Visualizer */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  {renderSandboxHeaderAndMode('eddy-currents', 'Active Electromagnetic Damping', Cpu, 'text-teal-600')}

                  {sandboxMode['eddy-currents'] === 'simulator' ? (
                    <>
                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[190px] relative overflow-hidden">
                    
                    {/* Poles */}
                    <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 flex justify-between select-none font-bold text-xs pointer-events-none opacity-30">
                      <div className="w-8 h-8 bg-red-500 text-white flex items-center justify-center rounded-lg">N</div>
                      <div className="w-8 h-8 bg-indigo-650 text-white flex items-center justify-center rounded-lg">S</div>
                    </div>

                    {/* Pendulum */}
                    <div
                      className="origin-top flex flex-col items-center relative transition-transform"
                      style={{
                        transform: `rotate(${eddyDampedAngle}deg)`,
                        transformOrigin: 'top center',
                        height: '100px'
                      }}
                    >
                      <div className="w-0.5 h-12 bg-slate-400" />
                      {eddyType === 'solid' ? (
                        <div className="w-12 h-10 bg-slate-300 rounded border border-slate-400 relative flex items-center justify-center">
                          {isEddySwinging && (
                            <div className="absolute inset-1 border border-dashed border-red-500 rounded-full animate-spin" />
                          )}
                          <span className="text-[7.5px] font-black text-slate-800">SOLID Plate</span>
                        </div>
                      ) : (
                        <div className="w-12 h-10 bg-slate-300 rounded border border-slate-400 relative flex justify-around p-0.5 overflow-hidden">
                          <div className="w-0.5 bg-slate-500 h-full" />
                          <div className="w-0.5 bg-slate-500 h-full" />
                          <div className="w-0.5 bg-slate-500 h-full" />
                          <span className="absolute bottom-0.5 text-[7px] font-black text-slate-800">SLIT Plate</span>
                        </div>
                      )}
                    </div>

                  </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-[11px] mt-4 leading-relaxed font-semibold text-slate-650">
                  <span className="text-rose-700 font-extrabold uppercase text-[9px] block">Observation logs:</span>
                  {eddyType === 'solid' ? (
                    <p className="mt-0.5">
                      Notice how the **Solid Plate** damps and stops **instantly** (almost within 1 swing). Large face area permits heavy current loops to swirl uninterrupted, inducing a massive repelling magnetic force.
                    </p>
                  ) : (
                    <p className="mt-0.5">
                      Notice the **Slotted Plate** swings **freely** multiple times! The vertical air slits broke the physical conductivity circle paths. Damping is highly muted.
                    </p>
                  )}
                </div>
                    </>
                  ) : (
                    <ConceptVideoPlayer tabId="eddy-currents" />
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 9. AC GENERATOR */}
        {activeTab === 'ac-generator' && (
          <div className="space-y-6 animate-fade-in text-xs sm:text-sm">
            <div className="bg-pink-50 border border-pink-200 text-pink-950 p-4.5 rounded-2xl shadow-sm leading-relaxed">
              <span className="font-extrabold uppercase text-[9px] text-pink-700 block mb-1">
                AC Generator (Alternator) Theorem:
              </span>
              Converts mechanical rotations to sinusoidal alternating voltage terminals, governed by Nikola Tesla's relative face loop sweeps.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm space-y-3.5">
                  <span className="bg-pink-100 text-pink-800 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase">
                    Alternator settings
                  </span>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center font-mono text-[11px] space-y-1">
                    <strong className="block text-slate-700 underline">Alternating formulary</strong>
                    <code className="text-pink-600 font-bold block">e(t) = e_m &middot; sin(&omega;t)</code>
                    <code className="text-pink-600 font-bold block">e_m = N &middot; B &middot; A &middot; &omega;</code>
                  </div>

                  {/* Settings Sliders */}
                  <div className="space-y-3.5 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px] text-slate-650">
                        <span>Rotor speed (RPM):</span>
                        <span className="text-pink-600 font-mono">{genRPM} rpm</span>
                      </div>
                      <input 
                        type="range" min="200" max="1200" step="100" value={genRPM}
                        onChange={(e) => setGenRPM(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-600 text-[11px] font-bold block">Generator Magnetic Poles (P):</span>
                      <div className="grid grid-cols-4 gap-1">
                        {[2, 4, 6, 8].map((poles) => (
                          <button
                            key={poles}
                            onClick={() => setGenPoles(poles)}
                            className={`py-1 text-[10px] font-black rounded-lg border cursor-pointer ${genPoles === poles ? 'bg-pink-600 border-pink-700 text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'}`}
                          >
                            {poles} P
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px] text-slate-650">
                        <span>Coil Winding Turns (N):</span>
                        <span className="text-pink-600 font-mono">{genN} Turns</span>
                      </div>
                      <input 
                        type="range" min="100" max="400" step="50" value={genN}
                        onChange={(e) => setGenN(parseInt(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                    </div>

                    <button
                      onClick={() => setIsGenRunning(!isGenRunning)}
                      className={`w-full py-2 rounded-xl font-black uppercase text-xs mt-3 flex items-center justify-center gap-2 border cursor-pointer shadow transition-all ${isGenRunning ? 'bg-rose-600 text-white border-rose-700' : 'bg-pink-600 text-white border-pink-700'}`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenRunning ? 'animate-spin' : ''}`} />
                      <span>{isGenRunning ? 'Stop Engine' : 'Engage Rotator Crank'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulation sine chart */}
              <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  {renderSandboxHeaderAndMode('ac-generator', 'Sinusoidal Alternator Output', RefreshCw, 'text-pink-600')}

                  {(() => {
                    const f = (genRPM * genPoles) / 120;
                    const omega = 2 * Math.PI * (genRPM / 60);
                    const em = genN * genB * genArea * omega * 0.005; // scaled down slightly for visualizer reading
                    const instEMF = em * Math.sin((genAngle * Math.PI) / 180);

                    return sandboxMode['ac-generator'] === 'simulator' ? (
                      <div className="space-y-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-around min-h-[180px] gap-6 relative overflow-hidden">
                          
                          {/* Rotating Armature Loop Simulation */}
                          <div className="flex items-center gap-2 relative">
                            {/* Magnet Poles */}
                            <div className="w-8 h-10 bg-red-500 text-white flex items-center justify-center rounded font-mono font-bold text-xs select-none shadow">N</div>
                            
                            {/* Armature rectangular frame rotating */}
                            <div className="relative w-20 h-16 border-2 border-dashed border-pink-400/30 flex items-center justify-center">
                              <div 
                                className="w-12 h-10 border-2 border-pink-500 rounded bg-pink-100/10 transition-transform duration-75 flex items-center justify-center"
                                style={{ transform: `rotateY(${genAngle}deg)` }}
                              >
                                {/* Arrow on loop representing current rotation direction */}
                                <span className={`text-[8px] font-black uppercase text-pink-600 ${Math.sin((genAngle * Math.PI) / 180) >= 0 ? '' : 'scale-x-[-1]'}`}>&rarr;</span>
                              </div>
                              {/* Shaft line */}
                              <div className="absolute w-24 h-0.5 bg-slate-400 -z-10" />
                            </div>

                            <div className="w-8 h-10 bg-indigo-600 text-white flex items-center justify-center rounded font-mono font-bold text-xs select-none shadow">S</div>
                          </div>

                          {/* Sinusoidal visualization bar */}
                          <div className="w-11 h-28 border border-slate-300 bg-white rounded-lg relative flex items-center justify-center shadow-sm shrink-0">
                            <div className="absolute inset-x-0 h-0.5 bg-slate-300" />
                            <div 
                              className={`w-8 bg-gradient-to-t from-pink-400 to-pink-600 rounded absolute transition-all duration-100 ${instEMF >= 0 ? 'origin-bottom' : 'origin-top'}`}
                              style={{
                                height: `${Math.min(50, Math.abs(instEMF * 15))}px`,
                                bottom: instEMF >= 0 ? '50%' : 'auto',
                                top: instEMF < 0 ? '50%' : 'auto'
                              }}
                            />
                            <span className="absolute bottom-2 text-[8px] font-mono text-slate-400 font-bold">Sin Phase</span>
                          </div>
                        </div>

                        <div className="mt-1 text-center text-[10.5px] font-mono text-slate-500 font-black">
                          Current Angle: {Math.round(genAngle % 360)}&deg; | Peak Code e_m: {em.toFixed(2)} V
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center text-[10.5px] uppercase font-black text-pink-700">
                            <strong>Instant voltage (e_t):</strong>
                            <strong>Frequency (f): {f.toFixed(1)} Hz</strong>
                          </div>
                          <div className="text-xl font-mono font-extrabold text-pink-750 block mt-1">
                            e_out = {instEMF.toFixed(3)} Volts
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 leading-snug font-semibold text-slate-550">
                            Armature coil sweeps at **{genRPM} rpm**, spinning past **{genPoles}** magnetic field poles. Total electrical speed yields **{f.toFixed(1)} cycles per second (Hz)** alternating sinusoidal voltage!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <ConceptVideoPlayer tabId="ac-generator" />
                    );
                  })()}
                </div>
              </div>

            </div>
          </div>
        )}

          </>
        )}

      </div>

      {/* FOOTER DIRECTED WORKBOOK NAVIGATION (Next and Previous Topic) */}
      <div className="bg-slate-55 p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
        <button
          onClick={handlePrevTopic}
          disabled={tabsInOrder.indexOf(activeTab) === 0}
          className="flex items-center gap-1.5 py-2 px-4 shadow rounded-xl text-xs font-black uppercase text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 cursor-pointer select-none"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Topic
        </button>

        <div className="hidden sm:block text-xs font-black text-slate-400 font-serif lowercase italic">
          topic {tabsInOrder.indexOf(activeTab) + 1} of 9 &bull; TIM Physics Tutor
        </div>

        <button
          onClick={handleNextTopic}
          disabled={tabsInOrder.indexOf(activeTab) === tabsInOrder.length - 1}
          className="flex items-center gap-1.5 py-2 px-4 shadow rounded-xl text-xs font-black uppercase text-white bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-950 disabled:opacity-45 cursor-pointer select-none hover:brightness-110"
        >
          Next Topic <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
