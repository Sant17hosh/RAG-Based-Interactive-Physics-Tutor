import React, { useState } from 'react';
import { AlertCircle, BookOpen, Star, HelpCircle, Check, Compass, Info, ArrowUpRight } from 'lucide-react';

interface SolveState {
  [key: string]: boolean;
}

export function renderChapter8Page(pageNum: number) {
  return <Chapter8Page pageNum={pageNum} />;
}

export function Chapter8Page({ pageNum }: { pageNum: number }) {
  // We simulate real-time interactive solved tabs
  const [solvedState, setSolvedState] = useState<SolveState>({});

  const toggleSolve = (id: string) => {
    setSolvedState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  switch (pageNum) {
    case 1:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          {/* Chapter Cover Highlight */}
          <div className="bg-sky-500 text-white p-8 rounded-xl relative overflow-hidden shadow-md">
            <span className="text-[10px] uppercase tracking-widest font-black text-sky-100 block mb-1">
              NCERT Physics Key Textbook Page
            </span>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none text-slate-950 font-serif">
                  Chapter Eight
                </h1>
                <h2 className="text-4xl font-extrabold tracking-tight text-white mt-1 uppercase">
                  Electromagnetic Waves
                </h2>
              </div>
              <div className="bg-slate-950 text-sky-400 font-mono text-[10px] p-2.5 rounded-lg border border-sky-400/30 text-center uppercase shrink-0 font-bold">
                CODE<br/>12089CH08
              </div>
            </div>
            <div className="mt-8 border-t border-sky-400/30 pt-4 flex gap-4 text-xs font-semibold text-sky-100">
              <span>Section 8.1: Introduction</span>
              <span>•</span>
              <span>Section 8.2: Displacement Current</span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
              8.1 INTRODUCTION
            </h3>
            <p className="text-sm font-medium leading-relaxed text-slate-705">
              In <strong className="text-slate-900">Chapter 4</strong>, we learnt that an electric current produces a magnetic field and that two current-carrying wires exert a magnetic force on each other. Further, in <strong className="text-slate-900">Chapter 6</strong>, we have seen that a magnetic field changing with time gives rise to an electric field. 
            </p>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
              <span className="text-xs font-black text-amber-800 block uppercase tracking-wider">Fundamental Symmetry Question:</span>
              <p className="text-xs font-bold text-amber-900 mt-0.5 leading-relaxed">
                Is the converse also true? Does an electric field changing with time give rise to a magnetic field?
              </p>
            </div>

            <p className="text-sm font-medium leading-relaxed text-slate-705">
              <strong className="text-slate-900">James Clerk Maxwell (1831–1879)</strong> argued that this was indeed the case — not only an electric current but also a time-varying electric field generates a magnetic field. While applying the Ampere’s circuital law to find the magnetic field at a point outside a capacitor connected to a time-varying current, Maxwell noticed an inconsistency in the Ampere’s circuital law. He suggested the existence of an additional current, called by him, the <span className="bg-sky-50 border-b border-sky-300 text-sky-850 px-1 font-bold">displacement current</span> to remove this inconsistency.
            </p>
            <p className="text-sm font-medium leading-relaxed text-slate-705">
              Maxwell formulated a set of equations involving electric and magnetic fields, and their sources, the charge and current densities. These equations are known as <strong className="text-slate-900">Maxwell’s equations</strong>. Together with the Lorentz force formula (Chapter 4), they mathematically express all the basic laws of electromagnetism.
            </p>
            <p className="text-sm font-medium leading-relaxed text-slate-705">
              The most important prediction to emerge from Maxwell’s equations is the existence of <strong className="text-slate-900">electromagnetic waves</strong>, which are (coupled) time-varying electric and magnetic fields that propagate in space. The speed of the waves, according to these equations, turned out to be very close to the speed of light (<strong className="text-slate-900">3 × 10⁸ m/s</strong>), obtained from optical measurements. This led to the remarkable conclusion that light is an electromagnetic wave. Maxwell’s work thus unified the domains of electricity, magnetism and light.
            </p>
          </div>
        </div>
      );

    case 2:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Biography Column */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 md:col-span-1 space-y-3">
              <div className="w-full aspect-[4/5] bg-slate-200 rounded-lg overflow-hidden relative border border-slate-300">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-mono text-[10px] tracking-widest text-center select-none font-bold">
                  JAMES CLERK MAXWELL
                </div>
                <div className="absolute bottom-3 left-3 right-3 z-20 text-white leading-tight">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-sky-300">Great Physicist Series</span>
                  <p className="text-xs font-black font-serif">James Clerk Maxwell</p>
                  <p className="text-[10px] font-semibold opacity-80">(1831 – 1879)</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Born in Edinburgh, Scotland, was among the greatest physicists of the nineteenth century. He derived the thermal velocity distribution of molecules in a gas and was among the first to obtain reliable estimates of molecular parameters. His greatest achievement was the unification of the laws of electricity and magnetism.
              </p>
            </div>

            {/* Main Content Column */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
                <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
                8.2 DISPLACEMENT CURRENT
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-705">
                We have seen in Chapter 4 that an electrical current produces a magnetic field around it. Maxwell showed that for logical consistency, a changing electric field must also produce a magnetic field. This effect is of great importance because it explains the existence of radio waves, gamma rays and visible light, as well as all other forms of electromagnetic waves.
              </p>
              <p className="text-sm font-medium leading-relaxed text-slate-705">
                To see how a changing electric field gives rise to a magnetic field, let us consider the process of charging of a capacitor and apply Ampere's circuital law given by:
              </p>
              
              <div className="my-5 bg-slate-950 text-sky-300 font-mono p-4 rounded-xl border border-sky-400/20 text-center relative">
                <span className="absolute top-2 left-3 text-[8px] tracking-wider text-white/35 font-sans font-bold">AMPERE'S LAW FORMULA (8.1)</span>
                <p className="text-sm md:text-base font-bold my-2">
                  {"\u222E"} B · dl = &mu;₀ i(t)
                </p>
              </div>

              <p className="text-sm font-medium leading-relaxed text-slate-705">
                to find the magnetic field at a point outside the capacitor. Consider a parallel plate capacitor C which is a part of a circuit through which a time-dependent current <strong className="text-slate-900">i(t)</strong> flows. Let us find the magnetic field at a point such as P, in a region outside the parallel plate capacitor.
              </p>
              <p className="text-sm font-medium leading-relaxed text-slate-705">
                For this, we consider a plane circular loop of radius r whose plane is perpendicular to the direction of the current-carrying wire. So from symmetry:
              </p>

              <div className="bg-slate-950 text-sky-300 font-mono p-4 rounded-xl border border-sky-400/20 text-center relative">
                <span className="absolute top-2 left-3 text-[8px] tracking-wider text-white/35 font-sans font-bold">CIRCULAR INTEGRAL SOLOMON (8.2)</span>
                <p className="text-sm md:text-base font-bold my-2">
                  B (2&pi;r) = &mu;₀ i(t)
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
            CAPACITOR CONTRADICTION & ELECTRIC FLUX
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <p className="text-sm font-medium leading-relaxed text-slate-705">
                Now, consider a different surface, which has the same boundary loop. This is a <strong>pot-like surface</strong> which nowhere touches the current-carrying conducting wire itself, but has its bottom between the capacitor plates. Another such surface is shaped like a tiffin box (without the lid).
              </p>
              <p className="text-sm font-medium leading-relaxed text-slate-705">
                On applying Ampere's circuital law to such surfaces with the <em className="text-slate-900 font-bold not-italic">same perimeter</em>, we find that the left hand side of Eq. (8.1) has not changed but the right hand side is <strong className="text-red-650 text-red-600">zero</strong> and not &mu;₀ i, since no conduction current passes through the surface inside the plates!
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <span className="text-xs font-black text-red-850 block uppercase tracking-wider">The Contradiction:</span>
                <p className="text-xs font-semibold text-red-900 mt-0.5 leading-relaxed">
                  Calculated one way, there is a magnetic field at a point P; calculated another way, the magnetic field at P is zero since the conduction loop is cut off!
                </p>
              </div>
            </div>

            {/* Vector Diagram Placeholder Card */}
            <div className="bg-slate-950 p-6 rounded-xl border border-white/10 text-center space-y-3">
              <span className="text-[9px] uppercase tracking-widest text-sky-400 font-bold block">Figure 8.1 Sketch: Capacitor Surface Loop</span>
              <div className="w-full h-36 bg-white/3 rounded-lg border border-dashed border-white/15 flex flex-col items-center justify-center p-3 relative">
                {/* Visual rendering of capacitor plates and loop */}
                <div className="flex gap-12 items-center">
                  <div className="w-1.5 h-20 bg-emerald-500 rounded relative">
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-emerald-400 font-mono font-bold">+</span>
                  </div>
                  <div className="w-1.5 h-20 bg-red-500 rounded relative">
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-red-400 font-mono font-bold">-</span>
                  </div>
                </div>
                <div className="absolute w-24 h-8 border border-sky-400 rounded-full border-dashed opacity-70 animate-pulse"></div>
                <span className="text-[10px] text-white/50 font-mono font-medium mt-4">Electric Flux &Phi;_E passing inside S</span>
              </div>
              <p className="text-[11px] text-white/60">
                The electric field <strong className="text-white">E</strong> exists between the plates but conduction current is zero.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Solving the contradiction:</h4>
            <p className="text-sm font-medium leading-relaxed text-slate-705">
              Is there anything passing through the surface S <em>between</em> the plates of the capacitor? Yes, of course, the <strong>electric field!</strong> If the plates of the capacitor have area A, and a total charge Q, the magnitude of the electric field E between the plates is:
            </p>

            <div className="bg-slate-950 text-sky-300 font-mono p-4 rounded-xl border border-sky-400/25 text-center relative leading-snug">
              <span className="absolute top-2 left-3 text-[8px] tracking-wider text-white/35 font-sans font-bold">ELECTRIC FLUX INTEGRATION (8.3)</span>
              <p className="text-sm font-semibold my-1">
                &Phi;<sub>E</sub> = |E| · A = (1 / &epsilon;₀) * (Q / A) * A = Q / &epsilon;₀
              </p>
            </div>

            <p className="text-sm font-medium leading-relaxed text-slate-705">
              Now if the charge Q on the capacitor plates changes with time, there is a current <strong className="text-slate-900">i = dQ/dt</strong>, so that:
            </p>

            <div className="bg-slate-950 text-sky-300 font-mono p-4 rounded-xl border border-sky-400/25 text-center relative leading-snug">
              <span className="absolute top-2 left-3 text-[8px] tracking-wider text-white/35 font-sans font-bold">DISPLACEMENT CURRENT DECOMPOSITION (8.4)</span>
              <p className="text-sm font-semibold my-1">
                &epsilon;₀ (d&Phi;<sub>E</sub> / dt) = dQ / dt = i_d
              </p>
            </div>

            <p className="text-sm font-semibold text-slate-700 bg-sky-50 border border-sky-200 p-3.5 rounded-xl">
              This is the missing term in Ampere’s circuital law! This term is due to changing electric field and is called the <strong className="text-sky-900 font-black">displacement current</strong>.
            </p>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
            THE AMPERE-MAXWELL LAW FORMULATION
          </h3>
          <p className="text-sm font-medium leading-relaxed text-slate-705">
            Having resolved the inconsistencies, Maxwell generalized the law by stating that the source of a magnetic field is not just the conduction electric current due to flowing charges, but also the time rate of change of the electric field!
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-705">
            More precisely, the total current <strong className="text-slate-900">i</strong> is the sum of the conduction current denoted by <strong className="text-slate-900">i_c</strong>, and the displacement current denoted by <strong className="text-slate-900">i_d</strong>:
          </p>

          <div className="bg-slate-950 text-sky-300 font-mono p-4 rounded-xl border border-sky-400/20 text-center relative">
            <span className="absolute top-2 left-3 text-[8px] tracking-wider text-white/35 font-sans font-bold">AMPERE-MAXWELL SUM (8.5)</span>
            <p className="text-sm md:text-base font-bold my-1">
              i = i_c + i_d = i_c + &epsilon;₀ (d&Phi;<sub>E</sub> / dt)
            </p>
          </div>

          <p className="text-sm font-medium leading-relaxed text-slate-750">
            Therefore, outside the capacitor plates, we have only conduction current i_c = i, and displacement current i_d = 0. On the other hand, inside the capacitor, there is no conduction current (i_c = 0), and there is only displacement current (i_d = i).
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-750">
            The generalized (and correct) Ampere's circuital law now becomes:
          </p>

          <div className="bg-slate-950 text-sky-300 font-mono p-4.5 rounded-xl border border-sky-400/25 text-center relative">
            <span className="absolute top-2 left-3 text-[8px] tracking-wider text-white/35 font-sans font-bold">THE GENERALIZED LAW - (8.6)</span>
            <p className="text-sm md:text-[15px] font-black my-1 text-emerald-400">
              {"\u222E"} B · dl = &mu;₀ i_c + &mu;₀ &epsilon;₀ (d&Phi;<sub>E</sub> / dt)
            </p>
          </div>

          <div className="p-4 bg-sky-50 border border-sky-200/50 rounded-xl space-y-1">
            <h4 className="text-xs font-black text-sky-850 uppercase tracking-wider">Far-Reaching Consequences:</h4>
            <p className="text-xs text-sky-750 font-medium leading-relaxed">
              This displacement current makes the laws of electricity and magnetism symmetrical! Faraday's law of induction states that a magnetic field changing with time gives rise to an electric field. The symmetrical counterpart established by Maxwell states that an electric field changing with time gives rise to a magnetic field!
            </p>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
            MAXWELL'S FAMOUS EQUATIONS IN VACUUM
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-slate-950 text-white text-xs font-black uppercase tracking-wider">
                  <th className="p-3 border-b border-slate-300">#</th>
                  <th className="p-3 border-b border-slate-300">Integral Statement Equation</th>
                  <th className="p-3 border-b border-slate-300">Corresponding Law Name</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-slate-700 font-mono">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 border-b border-slate-200 text-slate-400 font-bold">1</td>
                  <td className="p-3.5 border-b border-slate-200 text-sky-755 text-sky-700 font-bold">{"\u222E"} E · dA = Q / &epsilon;₀</td>
                  <td className="p-3.5 border-b border-slate-200 text-slate-900 font-sans font-bold">Gauss's Law for Electricity</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 border-b border-slate-200 text-slate-400 font-bold">2</td>
                  <td className="p-3.5 border-b border-slate-200 text-sky-755 text-sky-700 font-bold">{"\u222E"} B · dA = 0</td>
                  <td className="p-3.5 border-b border-slate-200 text-slate-900 font-sans font-bold">Gauss's Law for Magnetism</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 border-b border-slate-200 text-slate-400 font-bold">3</td>
                  <td className="p-3.5 border-b border-slate-200 text-sky-755 text-sky-700 font-bold">{"\u222E"} E · dl = -d&Phi;<sub>B</sub> / dt</td>
                  <td className="p-3.5 border-b border-slate-200 text-slate-900 font-sans font-bold">Faraday's Law of Induction</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 border-b border-slate-200 text-slate-400 font-bold">4</td>
                  <td className="p-3.5 border-b border-slate-200 text-emerald-700 font-bold">
                    {"\u222E"} B · dl = &mu;₀ i_c + &mu;₀ &epsilon;₀ (d&Phi;<sub>E</sub> / dt)
                  </td>
                  <td className="p-3.5 border-b border-slate-200 text-slate-900 font-sans font-bold">Ampere-Maxwell Circuital Law</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
              <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
              8.3 ELECTROMAGNETIC WAVES
            </h3>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">8.3.1 Sources of electromagnetic waves</h4>
            <p className="text-sm font-medium leading-relaxed text-slate-705">
              How are electromagnetic waves produced? Neither stationary charges nor charges in uniform motion (steady currents) can be sources of electromagnetic waves. The former produces only electrostatic fields, while the latter produces magnetic fields that do not vary with time.
            </p>
            <p className="text-sm font-medium leading-relaxed text-slate-705">
              It is an important result of Maxwell's theory that <span className="bg-amber-50 text-amber-900 border-b border-amber-300 font-bold px-1 py-0.5">accelerated charges radiate electromagnetic waves.</span>
            </p>
            <p className="text-sm font-medium leading-relaxed text-slate-705">
              Consider a charge oscillating with some frequency (an oscillating charge is an example of an accelerating charge). This produces an oscillating electric field in space, which produces an oscillating magnetic field, which in turn, is a source of oscillating electric field, and so on! The oscillating electric and magnetic fields thus regenerate each other, as the wave propagates through the space.
            </p>
          </div>
        </div>
      );

    case 6:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Biography Column */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 md:col-span-1 space-y-3">
              <div className="w-full aspect-[4/5] bg-slate-200 rounded-lg overflow-hidden relative border border-slate-300">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-mono text-[10px] tracking-widest text-center select-none font-bold">
                  HEINRICH RUDOLF HERTZ
                </div>
                <div className="absolute bottom-3 left-3 right-3 z-20 text-white leading-tight">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-sky-400">Great Physicist Series</span>
                  <p className="text-xs font-black font-serif">Heinrich Rudolf Hertz</p>
                  <p className="text-[10px] font-semibold opacity-80">(1857 – 1894)</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                German physicist who was the first to broadcast and receive radio waves. He produced electromagnetic waves experimentally, sent them through space, and measured their wavelength and speed. He verified the wave nature of electric fields and discovered the photoelectric effect.
              </p>
            </div>

            {/* Main Content Column */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
                <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
                8.3.2 NATURE OF ELECTROMAGNETIC WAVES
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-705">
                It can be shown from Maxwell's equations that electric and magnetic fields in an electromagnetic wave are perpendicular to each other, and also to the direction of propagation.
              </p>
              <p className="text-sm font-medium leading-relaxed text-slate-705">
                Let us assume a plane electromagnetic wave propagating along the <strong className="text-slate-900">z-axis</strong> (Fig 8.3). The oscillating electric field <strong>E_x</strong> is along the x-axis, and varies sinusoidally with z. The magnetic field <strong>B_y</strong> is along the y-axis, and also varies sinusoidally with z. We can write expressions as follows:
              </p>

              <div className="bg-slate-950 text-sky-300 font-mono p-4 rounded-xl border border-sky-400/20 text-[11px] space-y-2 text-left relative">
                <span className="absolute top-2 right-3 text-[8px] tracking-wider text-white/35 font-sans font-bold">WAVE WAVE EQUATIONS (8.7)</span>
                <div>
                  <p className="text-white font-bold">Electric Field:</p>
                  <p className="text-emerald-400 pl-4">E<sub>x</sub> = E₀ sin(kz - &omega;t)</p>
                </div>
                <div>
                  <p className="text-white font-bold">Magnetic Field:</p>
                  <p className="text-emerald-400 pl-4">B<sub>y</sub> = B₀ sin(kz - &omega;t)</p>
                </div>
              </div>

              <p className="text-sm font-medium leading-relaxed text-slate-705">
                Here the wave propagation vector wavenumber is:
              </p>
              
              <div className="bg-slate-950 text-sky-300 font-mono p-3 rounded-xl border border-sky-400/20 text-center text-xs">
                k = 2&pi; / &lambda;  &nbsp;&nbsp;&nbsp;&nbsp;(8.8)
              </div>
            </div>
          </div>
        </div>
      );

    case 7:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
            SPEED & PHYSICAL PROPERTIES of EM WAVES
          </h3>
          <p className="text-sm font-medium leading-relaxed text-slate-705">
            Since &omega; is active angular frequency, the speed of propagation is (&omega;/k). Applying Maxwell's equations, one finds:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-center space-y-1">
              <span className="text-[8px] uppercase tracking-wider text-sky-450 text-sky-400 font-bold block">Speed of Light in Vacuum (8.9)</span>
              <p className="text-emerald-400 font-mono text-sm font-extrabold my-2">c = 1 / &radic;(&mu;₀&epsilon;₀) &nbsp;&approx; 3 &times; 10⁸ m/s</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-center space-y-1">
              <span className="text-[8px] uppercase tracking-wider text-sky-450 text-sky-400 font-bold block">Amplitude Fields Ratio (8.10)</span>
              <p className="text-emerald-400 font-mono text-sm font-extrabold my-2">E₀ / B₀ = c</p>
            </div>
          </div>

          <p className="text-sm font-medium leading-relaxed text-slate-705">
            What if a physical material medium is actually there? The total electromagnetic fields inside a medium are described by permittivity &epsilon; and magnetic permeability &mu; because of standard field interaction with material lattices:
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-center relative max-w-sm mx-auto">
            <span className="absolute top-2 left-3 text-[8px] tracking-wider text-white/35 font-sans font-bold">Speed in Material Medium (8.11)</span>
            <p className="text-emerald-400 font-mono text-sm font-extrabold my-1">
              v = 1 / &radic;(&mu;&epsilon;)
            </p>
          </div>

          <p className="text-sm font-black text-slate-800 uppercase mt-4 block tracking-wider">Key Physical Characteristics:</p>
          <ul className="space-y-2.5 pl-4 list-disc marker:text-sky-500">
            <li className="text-xs text-slate-700 font-semibold leading-relaxed">
              <strong>Carry Energy & Momentum:</strong> Electromagnetic waves transport momentum and energy. When they strike a surface, they exert a tiny force per unit area known as **radiation pressure**.
            </li>
            <li className="text-xs text-slate-700 font-semibold leading-relaxed">
              <strong>Momentum formula:</strong> Total energy delivered to a surface in time t is U, then the momentum p delivered is <strong className="font-mono text-slate-950">p = U / c</strong>.
            </li>
            <li className="text-xs text-slate-700 font-semibold leading-relaxed">
              <strong>Transverse Polarization:</strong> Electric and magnetic vector components are polarization-aligned. They can be linearly polarized, circularly polarized, or unpolarized.
            </li>
          </ul>
        </div>
      );

    case 8:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
            SOLVED EXAMPLES & WORKED OUT PROBLEMS
          </h3>

          {/* EXAMPLE 8.1 */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-sky-100 text-sky-850">
              NCERT Example 8.1
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              A plane electromagnetic wave of frequency 25 MHz travels in free space along the x-direction. At a particular point in space and time, electric vector E = 6.3 ĵ V/m. What is magnetic vector B at this point?
            </p>
            
            <button
              onClick={() => toggleSolve('ex81')}
              className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-450 text-slate-950 transition-all font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Info className="w-4 h-4 shrink-0" />
              <span>{solvedState['ex81'] ? "Hide Solver Breakdown" : "View Step-by-Step Solution"}</span>
            </button>

            {solvedState['ex81'] && (
              <div className="p-4 bg-white/60 border border-slate-200/50 rounded-lg space-y-2 mt-2 text-xs text-slate-700 border-l-4 border-l-sky-500">
                <p>
                  <strong>Step 1: Calculate amplitude magnitude of B:</strong>
                  <br />
                  B = E / c
                  <br />
                  B = 6.3 V/m / (3 &times; 10⁸ m/s) = <strong className="text-slate-950">2.1 &times; 10⁻⁸ Tesla (T)</strong>
                </p>
                <p>
                  <strong>Step 2: Determine directions:</strong>
                  <br />
                  The wave propagates along positive x-axis (î direction). E is given along y-axis (ĵ). Since propagation is calculated as the cross product (Vector E &times; Vector B) directed along (+î), using vector algebra:
                  <br />
                  <code className="bg-slate-100 px-1 py-0.5 font-mono text-slate-950 font-bold">(+ĵ) &times; (+k̂) = î</code>. Therefore, B vector must oscillate along z-direction (k̂).
                </p>
                <p className="text-emerald-700 font-bold font-mono">
                  Final Vector: B = 2.1 &times; 10⁻⁸ k̂ Tesla.
                </p>
              </div>
            )}
          </div>

          {/* EXAMPLE 8.2 */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-sky-100 text-sky-850">
              NCERT Example 8.2
            </span>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              The magnetic field in a plane electromagnetic wave is given by B_y = (2 × 10⁻⁷) T sin[0.5×10³ x + 1.5×10¹¹ t]. Find (a) wavelength and frequency, (b) write expression for electric field.
            </p>

            <button
              onClick={() => toggleSolve('ex82')}
              className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-450 text-slate-950 transition-all font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Info className="w-4 h-4 shrink-0" />
              <span>{solvedState['ex82'] ? "Hide Solver Breakdown" : "View Step-by-Step Solution"}</span>
            </button>

            {solvedState['ex82'] && (
              <div className="p-4 bg-white/60 border border-slate-200/50 rounded-lg space-y-2 mt-2 text-xs text-slate-700 border-l-4 border-l-sky-500">
                <p>
                  <strong>(a) Compare given B equation with standard harmonic template:</strong>
                  <br />
                  B<sub>y</sub> = B₀ sin[ 2&pi; (x/&lambda; + t/T) ] = B₀ sin [ kx + &omega;t ]
                  <br />
                  We get: B₀ = 2 &times; 10⁻⁷ T, wavenumber k = 0.5 &times; 10³ r/m, and &omega; = 1.5 &times; 15¹¹ rad/s.
                  <br />
                  &lambda; = 2&pi; / k = 2 &times; 3.1416 / (0.5 &times; 10³) = <strong className="text-slate-950">1.26 cm</strong>
                  <br />
                  f = &omega; / 2&pi; = 1.5 &times; 10¹¹ / (2 &times; 3.1416) = <strong className="text-slate-950">23.9 Gigahertz (GHz)</strong>
                </p>
                <p>
                  <strong>(b) Find electric field amplitude magnitude:</strong>
                  <br />
                  E₀ = B₀ &times; c = (2 &times; 10⁻⁷ T) &times; (3 &times; 10⁸ m/s) = <strong className="text-slate-950 font-bold">60 V/m</strong>.
                  <br />
                  Since wave is travelling on (-x direction) and magnetic field is on y-axis, E must oscillate perpendicularly on the z-axis.
                </p>
                <p className="text-emerald-700 font-bold font-mono">
                  Final expression: E_z = 60 sin(0.5 &times; 10³ x + 1.5 &times; 10¹¹ t) V/m.
                </p>
              </div>
            )}
          </div>
        </div>
      );

    case 9:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
            8.4 THE ELECTROMAGNETIC SPECTRUM
          </h3>
          <p className="text-sm font-medium leading-relaxed text-slate-705">
            The classification of electromagnetic waves according to frequency is known as the electromagnetic spectrum. There are no sharp boundaries between one kind of wave and another. The classification is based roughly on how they are produced or detected.
          </p>

          {/* Interactive Spectrum Chart Panel */}
          <div className="bg-slate-950 rounded-xl p-5 border border-white/10 space-y-4">
            <span className="text-[10px] tracking-widest text-sky-400 font-black block uppercase">
              Interactive Micro Spectrum Guide
            </span>
            
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-7 gap-1 h-14 relative text-[9px] font-black text-center text-slate-950 select-none">
                <div className="bg-violet-300 rounded hover:scale-105 transition-all cursor-pointer flex items-center justify-center border border-violet-150" title="Gamma: <10^-3 nm">Gamma</div>
                <div className="bg-sky-300 rounded hover:scale-105 transition-all cursor-pointer flex items-center justify-center border border-sky-150" title="X-Rays: 1nm - 10^-3 nm">X-Rays</div>
                <div className="bg-blue-300 rounded hover:scale-105 transition-all cursor-pointer flex items-center justify-center border border-blue-150" title="UV: 400nm - 1nm">UV</div>
                <div className="bg-gradient-to-r from-violet-400 via-green-400 to-red-400 rounded hover:scale-105 transition-all cursor-pointer flex items-center justify-center h-full border border-white/20 text-white shadow" title="Visible: 700 - 400 nm">Visible</div>
                <div className="bg-amber-300 rounded hover:scale-105 transition-all cursor-pointer flex items-center justify-center border border-amber-150" title="Infra: 1mm - 700nm">Infrared</div>
                <div className="bg-orange-300 rounded hover:scale-105 transition-all cursor-pointer flex items-center justify-center border border-orange-150" title="Micro: 0.1m - 1mm">Microwave</div>
                <div className="bg-red-300 rounded hover:scale-105 transition-all cursor-pointer flex items-center justify-center border border-red-150" title="Radio: > 0.1 m">Radio</div>
              </div>
              <div className="flex justify-between text-[8px] font-mono text-white/50 px-1 font-bold">
                <span>Wavelength &lambda; decreases (10⁶ m &rarr; 10⁻¹⁴ m)</span>
                <span>Frequency f increases (10⁴ Hz &rarr; 10²² Hz)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">8.4.1 Radio Waves</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              Radio waves are produced by the accelerated motion of charges in conducting wires. They are used in radio and television communication systems. They are generally in the frequency range from 500 kHz to about 1000 MHz. The AM (amplitude modulated) band is from 530 kHz to 1710 kHz. FM radio extends from 88 MHz to 108 MHz.
            </p>

            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">8.4.2 Microwaves</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              Microwaves are short-wavelength radio waves with frequencies in the gigahertz (GHz) range. They are produced by special vacuum tubes called klystrons, magnetrons and Gunn diodes. Because of their short wavelengths, they are highly suitable for the radar systems used in aircraft navigation. Vacuum magnetrons form the basis of domestic microwave ovens.
            </p>
          </div>
        </div>
      );

    case 10:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
            8.4.3 INFRARED, VISIBLE, & ULTRAVIOLET
          </h3>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl space-y-1">
              <h4 className="text-sm font-black text-slate-800 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-amber-500 rounded"></span> 8.4.3 Infrared Waves ("Heat Waves")
              </h4>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                Infrared waves are produced by hot bodies and molecules. This band lies adjacent to the low-frequency or long-wavelength end of the visible spectrum. Infrared waves are referred to as <strong>heat waves</strong> because water molecules present in materials readily absorb them, raising thermal molecular motion. They are widely used in remote switches of electronic appliances.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl space-y-1">
              <h4 className="text-sm font-black text-slate-800 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-red-500 rounded"></span> 8.4.4 Visible Rays
              </h4>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                It is the most familiar form of electromagnetic waves and is detected directly by the human retina. It ranges from about <strong className="text-slate-950 font-mono font-bold">4 &times; 10¹⁴ Hz to 7 &times; 10¹⁴ Hz</strong>, with a wavelength span of <strong>700 nm to 400 nm</strong>. Visible photons are emitted or reflected from objects to give sensory visibility.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl space-y-1">
              <h4 className="text-sm font-black text-slate-800 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-violet-600 rounded"></span> 8.4.5 Ultraviolet Rays (UV)
              </h4>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                It covers wavelengths ranging from about <strong>400 nm down to 1 nm</strong>. Produced by high temperature mercury lamps and hot stellar bodies (sun). Exposure induces melanin synthesis, causing skin tanning. UV radiation is highly absorbed by glass. UV rays are focused in narrow beams for high-precision <strong>LASIK surgery</strong> and germicidal water sterilizers.
              </p>
            </div>
          </div>
        </div>
      );

    case 11:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
            8.4.6 X-RAYS, GAMMA RAYS, & SPECTRUM TABLE
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <h4 className="text-xs font-black text-slate-800 uppercase">8.4.6 X-Rays</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Covers wavelengths from <strong>10 nm down to 10⁻¹³ m</strong>. Generated by bombarding a heavy metal target anode with fast high-energy cathode electrons. Used extensively in clinical diagnostics and oncology therapies.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
              <h4 className="text-xs font-black text-slate-800 uppercase">8.4.7 Gamma Rays</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Upper limit frequencies from <strong>10⁻¹⁰ m to less than 10⁻¹⁴ m</strong>. Radiated through nuclear transformations and radioactive isotopes disintegrations. Capable of destroying tumor tissue.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest block">TABLE 8.1 SPECTRAL REGIONS IDENTITIES</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-200 bg-white">
                <thead>
                  <tr className="bg-slate-950 text-white font-mono text-[9px] uppercase tracking-wider">
                    <th className="p-2 border border-slate-300">Wave Type</th>
                    <th className="p-2 border border-slate-300">Wavelength Range</th>
                    <th className="p-2 border border-slate-300">Primary Production</th>
                    <th className="p-2 border border-slate-300">Primary Detection</th>
                  </tr>
                </thead>
                <tbody className="text-[10px] font-semibold text-slate-700 font-mono">
                  <tr className="hover:bg-slate-50">
                    <td className="p-1.5 border border-slate-250 font-bold">Radio</td>
                    <td className="p-1.5 border border-slate-250">&gt; 0.1 m</td>
                    <td className="p-1.5 border border-slate-250">Electron accelerations in aerials</td>
                    <td className="p-1.5 border border-slate-250">Aerial Receivers</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-1.5 border border-slate-250 font-bold">Microwave</td>
                    <td className="p-1.5 border border-slate-250">0.1m to 1 mm</td>
                    <td className="p-1.5 border border-slate-250">Klystron, Magnetron tubes</td>
                    <td className="p-1.5 border border-slate-250">Point contact diodes</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-1.5 border border-slate-250 font-bold">Infra-red</td>
                    <td className="p-1.5 border border-slate-250">1mm to 700 nm</td>
                    <td className="p-1.5 border border-slate-250">Atomic molecular vibrations</td>
                    <td className="p-1.5 border border-slate-250">Thermopiles, Infrared Film</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-1.5 border border-slate-250 font-bold">Light</td>
                    <td className="p-1.5 border border-slate-250">700nm to 400 nm</td>
                    <td className="p-1.5 border border-slate-250">Electron outer shell transitions</td>
                    <td className="p-1.5 border border-slate-250">Eye, Photocells</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-1.5 border border-slate-250 font-bold">Ultraviolet</td>
                    <td className="p-1.5 border border-slate-250">400nm to 1nm</td>
                    <td className="p-1.5 border border-slate-250">Inner shell atomic transitions</td>
                    <td className="p-1.5 border border-slate-250">Photocells</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-1.5 border border-slate-250 font-bold">X-Rays</td>
                    <td className="p-1.5 border border-slate-250">1nm to 10⁻³ nm</td>
                    <td className="p-1.5 border border-slate-250">Cathode bombardment targets</td>
                    <td className="p-1.5 border border-slate-250">Geiger tubes, Film</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-1.5 border border-slate-250 font-bold">Gamma</td>
                    <td className="p-1.5 border border-slate-250">&lt; 10⁻³ nm</td>
                    <td className="p-1.5 border border-slate-250">Isotope nuclear decay</td>
                    <td className="p-1.5 border border-slate-250">Geiger, Ion chambers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    case 12:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
            CHAPTER EIGHT: REVISION SUMMARY
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1.5">
              <span className="text-[10px] text-sky-500 font-bold block">1. Displacement Current Code</span>
              <p className="text-slate-650 text-slate-600">
                Maxwell resolved the inconsistencies of Ampere's original circuital laws by introducing a replacement term dependent on electric flux d&Phi;<sub>E</sub>/dt.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1.5">
              <span className="text-[10px] text-sky-500 font-bold block">2. Self-Regenerative Mechanism</span>
              <p className="text-slate-650 text-slate-600">
                An accelerating point electrical charge yields a coupled self-sustaining chain of oscillating magnetic and electric induction vectors across space, constituting the physical EM wave.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1.5">
              <span className="text-[10px] text-sky-500 font-bold block">3. Speed Ratio Constant</span>
              <p className="text-slate-650 text-slate-600">
                In free space vacuum, electromagnetic spectrum waves travel at matching constant speed c &approx; 3 &times; 10⁸ m/s, where E₀ / B₀ is equivalent to c.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1.5">
              <span className="text-[10px] text-sky-500 font-bold block">4. Transverse Coordinates</span>
              <p className="text-slate-650 text-slate-600">
                The wave vectors satisfy linear orthogonal criteria, wherein electric E and magnetic oscillation fields B propagate along E &times; B direction.
              </p>
            </div>
          </div>
          
          <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-xs text-sky-905">
            <strong>Revision Recommendation:</strong> Keep your indices for displacement derivative parameters strictly aligned with vacuum permittivity constants. Board numeric evaluation models carry up to 2 marks solely for correctly expressing conduction current sums!
          </div>
        </div>
      );

    case 13:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
            POINTS TO PONDER & CORE BOARD EXERCISES
          </h3>

          <div className="bg-amber-50 p-4.5 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-2">
            <span className="font-black uppercase block tracking-wider">Points to Ponder:</span>
            <p>
              1. The main underlying variance across all partitions of the electromagnetic spectrum is centered solely on frequencies and wavelengths, since all travel at equal constant velocities in vacuum paths.
            </p>
            <p>
              2. Micro-molecular lattice vibrations inside matter readily absorb infra-red, giving rise to "heat wave descriptions". Visible receptors on humanity evolved matching stellar peaks range.
            </p>
          </div>

          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest block pt-2">CHAPTER BOARD EXERCISES</h4>

          {/* EXERCISE 8.1 */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-3">
            <span className="inline-block px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-sky-100 text-sky-850">
              Board Exercise 8.1
            </span>
            <p className="text-xs font-bold text-slate-900 leading-snug">
              A parallel plate capacitor made of two circular list plates has radius r = 12 cm, and spacing d = 5.0 cm. It is being charged by a steady external source. Charging current is constant at I_c = 0.15 A.
              <br />
              (a) Find capacitance and rate of change of potential difference.
              <br />
              (b) Find displacement current across plates.
            </p>

            <button
              onClick={() => toggleSolve('q81')}
              className="px-3.5 py-1.5 bg-sky-400 hover:bg-sky-450 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer border border-sky-500/20"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{solvedState['q81'] ? "Hide Answer Expansion" : "Show Answers Key"}</span>
            </button>

            {solvedState['q81'] && (
              <div className="p-4 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                <p>
                  <strong>(a) Capacitance calculations:</strong>
                  <br />
                  C = &epsilon;₀ A / d = &epsilon;₀ &pi; r² / d
                  <br />
                  C = (8.854 &times; 10⁻¹² C²/N·m²) &times; &pi; &times; (0.12)² / 0.05 = <strong className="text-slate-950">8.01 pF (picofarad)</strong>.
                  <br />
                  Since rate of voltage charge is dV/dt = I / C, dV/dt = 0.15 / (8.01 &times; 10⁻¹²) = <strong className="text-slate-950">1.87 &times; 10¹⁰ Volts per second (V/s)</strong>.
                </p>
                <p>
                  <strong>(b) Displacement current calculations:</strong>
                  <br />
                  displacement current is mathematically identical to conduction current inside a closed charging capacitor loop: <strong className="text-emerald-700 font-bold font-mono">I_d = I_c = 0.15 A.</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      );

    case 14:
      return (
        <div className="space-y-6 text-slate-800 leading-relaxed font-sans border-b pb-8">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span className="w-2.5 h-4 bg-sky-550 bg-sky-500 rounded"></span>
            BOARD HIGH-YIELD QUESTIONS INDEX (8.3 - 8.10)
          </h3>

          <div className="space-y-3.5">
            {/* EXERCISE 3 */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-sky-650 font-black block uppercase">Q8.3 • Match-up trend</span>
              <p className="text-xs font-bold text-slate-950">
                What physical quantity remains identical for X-rays of wavelength 10⁻¹⁰m, red light of wavelength 6800 Å and radiowaves of 500m?
              </p>
              <button onClick={() => toggleSolve('q83')} className="text-[10px] font-black text-sky-500 hover:text-sky-400">
                {solvedState['q83'] ? "Hide Solution Hint" : "Check Solution Hint"}
              </button>
              {solvedState['q83'] && (
                <p className="text-xs text-slate-650 bg-white p-2.5 rounded border leading-relaxed font-semibold">
                  <strong>Answer:</strong> The speed in vacuum! All of them are electromagnetic waves, so they travel at velocity <code className="font-bold">c &approx; 3 &times; 10⁸ m/s</code>.
                </p>
              )}
            </div>

            {/* EXERCISE 4 */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-sky-650 font-black block uppercase">Q8.4 • propagation alignments</span>
              <p className="text-xs font-bold text-slate-950">
                A plane electromagnetic wave travels in vacuum along z-direction. What can you say about directions of its electric and magnetic vectors?
              </p>
              <button onClick={() => toggleSolve('q84')} className="text-[10px] font-black text-sky-500 hover:text-sky-400">
                {solvedState['q84'] ? "Hide Solution Hint" : "Check Solution Hint"}
              </button>
              {solvedState['q84'] && (
                <p className="text-xs text-slate-650 bg-white p-2.5 rounded border leading-relaxed font-semibold">
                  <strong>Answer:</strong> Both vectors must lie in the x-y plane. Since they are mutually orthogonal and perpendicular to the wave propagation vector (z): if E is along x-axis, B must orient along y-axis, satisfying <code className="font-bold">E &times; B</code> direction matching the z projection.
                </p>
              )}
            </div>

            {/* EXERCISE 7 */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-sky-650 font-black block uppercase">Q8.7 • field conversion challenge</span>
              <p className="text-xs font-bold text-slate-950">
                The amplitude of magnetic field component B₀ is 510 nT. Find the corresponding electric field amplitude E₀.
              </p>
              <button onClick={() => toggleSolve('q87')} className="text-[10px] font-black text-sky-500 hover:text-sky-400">
                {solvedState['q87'] ? "Hide Solution Hint" : "Check Solution Hint"}
              </button>
              {solvedState['q87'] && (
                <p className="text-xs text-slate-650 bg-white p-2.5 rounded border leading-relaxed font-semibold">
                  <strong>Answer:</strong> Use amplitude relation: E₀ = B₀ &times; c.
                  <br />
                  E₀ = (510 &times; 10⁻⁹ T) &times; (3 &times; 10⁸ m/s) = <strong className="text-emerald-700">153 Volts per meter (V/m)</strong>.
                </p>
              )}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
