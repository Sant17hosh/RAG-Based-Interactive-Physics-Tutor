import { Chapter, GroundingChunk, Question, MCQ } from './types';

export const CHANNELS_PUC_DATA: Chapter[] = [
  {
    id: 1,
    name: "Electromagnetic Induction",
    weightage: "8 Marks",
    pucImportance: "High",
    description: "Magnetic flux and electromagnetic induction: Faraday's experiments and laws of electromagnetic induction, Lenz's law and conservation of energy. Motional EMF, eddy currents, self-induction and mutual induction, including their concepts, coefficients, and practical systems like AC generators.",
    formulas: [
      "Magnetic Flux: Ф_B = B • A • cos(θ)",
      "Faraday's Law (Induced EMF): e = -dФ_B / dt",
      "Motional EMF: e = B * v * l",
      "Induced Charge Flow: ΔQ = ΔФ_B / R",
      "Self-Inductance Flux relation: Ф = L * I",
      "Self-Induced EMF: e = -L * (dI / dt)",
      "Solenoid Self-Inductance: L = μ_0 * N^2 * A / l",
      "Mutual Induced EMF: e_s = -M * (dI_p / dt)",
      "AC Generator Induced EMF: e = N * B * A * ω * sin(ωt)"
    ]
  },
  {
    id: 2,
    name: "Electromagnetic Waves",
    weightage: "6 Marks",
    pucImportance: "High",
    description: "Displacement current: inconsistency of Ampere's circuital law and need for displacement current. Electromagnetic waves: sources, transverse nature, basic characteristics, speed in vacuum and media. Electromagnetic spectrum: Radio waves, Microwaves, Infrared, Visible light, Ultraviolet, X-rays, and Gamma rays, including their wavelength/frequency ranges, production, detection, and practical applications.",
    formulas: [
      "Displacement Current: I_d = ε_0 * (dФ_E / dt)",
      "Ampere-Maxwell Law: ∮ B • dl = μ_0 * (I_c + I_d) = μ_0 * I_c + μ_0 * ε_0 * (dФ_E / dt)",
      "Speed of EM Waves (Vacuum): c = 1 / sqrt(μ_0 * ε_0) ≈ 3 * 10^8 m/s",
      "Speed of EM Waves (Medium): v = 1 / sqrt(μ * ε)",
      "EM Wave Fields Relation: E_0 / B_0 = c",
      "Momentum Transferred: p = U / c (complete absorption)",
      "Propagation Constant: k = 2 * π / λ",
      "Wave Velocity Formula: c = ω / k = f * λ"
    ]
  }
];

export const GROUNDING_CHUNKS: GroundingChunk[] = [
  {
    id: "chunk-1-1",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    section: "1.1 Introduction & Magnetic Flux",
    content: "Electromagnetic induction is the phenomenon of generating an electromotive force (EMF) and/or electric current in a conductor by changing the magnetic flux linked with it. Magnetic flux (Ф_B) through any surface of area A placed in a magnetic field B is defined as the total number of magnetic field lines crossing that area normally. Mathematically, Ф_B = B • A = B * A * cos(θ), where θ is the angle between the magnetic field vector B and the area vector A. The SI unit of magnetic flux is Weber (Wb) or Tesla-meter-squared (T m²). It is a scalar quantity.",
    bloomLevel: "Remember"
  },
  {
    id: "chunk-1-2",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    section: "1.2 Faraday's Experiments & Laws of Induction",
    content: "Michael Faraday conducted a series of seminal experiments showing electricity and magnetism are linked. First, moving a bar magnet into or out of a wire coil induces a transient current in the coil. Second, varying the current in a primary coil induces a transient current in an adjacent secondary coil. Faraday's First Law of Electromagnetic Induction states that whenever the magnetic flux linked with a closed circuit changes, an electromotive force (EMF) is induced in it, which lasts only as long as the change in flux continues. Faraday's Second Law states that the magnitude of the induced EMF is directly proportional to the rate of change of magnetic flux linked with the circuit: e = -dФ_B / dt.",
    bloomLevel: "Understand"
  },
  {
    id: "chunk-1-3",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    section: "1.3 Lenz's Law & Conservation of Energy",
    content: "Lenz's Law, formulated by Heinrich Lenz, provides the direction of induced EMF or current: The direction of the induced current is always such that it opposes the change in magnetic flux that produces it. Mathematically, this opposition is represented by the negative sign in Faraday's equation: e = -dФ_B / dt. Lenz's law is a direct consequence of the Law of Conservation of Energy. If the induced current did not oppose the incoming magnet, it would attract it, speeding it up recursively. This would create infinite electrical energy without external work, which violates energy conservation. Thus, mechanical work done in moving the magnet against the opposing field is converted into electrical energy.",
    bloomLevel: "Analyze"
  },
  {
    id: "chunk-1-4",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    section: "1.4 Motional Electromotive Force (EMF)",
    content: "When a straight conducting rod of length l is moved with a uniform velocity v perpendicular to a uniform, constant magnetic field B, an EMF is induced across its ends. This is called Motional EMF. As the rod moves, free electrons inside experience a magnetic Lorentz force F = q * (v x B) along the length of the rod. Accumulation of charges at the ends creates an electrostatic field which eventually balances the magnetic force. The resulting steady-state potential difference or induced motional EMF is given by e = B * v * l. This can also be derived by finding the rate at which the moving rod sweeps across the magnetic flux area: dФ_B/dt = B * d(l*x)/dt = B * l * v.",
    bloomLevel: "Apply"
  },
  {
    id: "chunk-1-5",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    section: "1.5 Eddy Currents Definition & Mitigation",
    content: "When bulk pieces of conductors are subjected to changing magnetic flux, circulating induced currents are produced throughout their volume. These currents resemble eddies in swirling water and are called Eddy Currents (or Foucault currents). Due to Joule heating (H = I²Rt), eddy currents cause undesirable dissipation of electrical energy as heat in devices like transformer cores, electric motors, and dynamos. This heat loss is minimized or mitigated by using laminated iron cores, where thin sheets of iron coated with insulating varnish are stacked together, drastically interrupting the potential paths of circulating eddy currents. Useful applications include electromagnetic braking in trains, induction furnaces, and speedometers.",
    bloomLevel: "Understand"
  },
  {
    id: "chunk-1-6",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    section: "1.6 Self-Induction & Solenoid Coefficients",
    content: "Self-induction is the phenomenon where an induced EMF is produced in a single coil itself due to a change in current flowing through it. The magnetic flux Ф linked with the coil is proportional to the current I: Ф = L * I, where L is the self-inductance (coefficient of self-induction). The induced back EMF is e = -L * (dI/dt). For a long straight solenoid of length l, cross-sectional area A, and total turns N, the magnetic field inside is B = μ_0 * n * I = μ_0 * (N/l) * I. The total flux linkage is N * Ф_B = N * B * A = μ_0 * N² * A * I / l. Since total flux Ф = L * I, the self-inductance is L = μ_0 * N² * A / l. Its SI unit is Henry (H).",
    bloomLevel: "Apply"
  },
  {
    id: "chunk-1-7",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    section: "1.7 Mutual Induction & Coaxial Solenoids",
    content: "Mutual induction is the phenomenon of producing an induced EMF in a secondary coil due to a change in current in an adjacent primary coil. The magnetic flux Ф_s linked with the secondary coil is proportional to the primary current I_p: Ф_s = M * I_p, where M is the mutual inductance (coefficient of mutual induction). The induced EMF in the secondary is e_s = -M * (dI_p / dt). For two closely-wound coaxial solenoids of length l, area A, with primary turns N_1 and secondary turns N_2, the mutual inductance is M = μ_0 * N_1 * N_2 * A / l. Mutual inductance depends on their geometry, turn density, and relative orientation.",
    bloomLevel: "Evaluate"
  },
  {
    id: "chunk-1-8",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    section: "1.8 AC Generator Principal Details",
    content: "An AC generator is a device that converts mechanical energy into electrical energy based on the principle of electromagnetic induction. It consists of an armature coil of N turns and area A, rotated with a constant angular velocity ω in a uniform magnetic field B. The magnetic flux linked with the rotating coil at any instant is Ф_B = B • A = B * A * cos(ωt). According to Faraday's law, the induced EMF is e = -N * (dФ_B / dt) = -N * d(B * A * cos(ωt))/dt = N * B * A * ω * sin(ωt). The maximum induced EMF (peak value) is e_0 = N * B * A * ω. Thus, the alternating EMF varies sinusoidally as e = e_0 * sin(ωt), changing direction periodically and generating alternating current (AC).",
    bloomLevel: "Apply"
  },
  {
    id: "chunk-2-1",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    section: "2.1 Introduction & Unification",
    content: "James Clerk Maxwell argued that a time-varying electric field must generate a magnetic field. This symmetrical counterpart to Faraday's law of induction unified the domains of electricity, magnetism, and light. Heinrich Hertz experimentally demonstrated the existence of electromagnetic waves in 1887, verifying Maxwell's mathematical prediction. Later, Jagdish Chandra Bose in Kolkata succeeded in producing waves of much shorter wavelengths (25 mm to 5 mm), and Guglielmo Marconi succeeded in transmitting them over long distances, pioneering modern telecommunications.",
    bloomLevel: "Remember"
  },
  {
    id: "chunk-2-2",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    section: "2.2 Inconsistency of Ampere's Law & Displacement Current",
    content: "During the charging of a parallel plate capacitor, Ampere's circuital law ∮ B • dl = μ_0 * I leads to a logical inconsistency. For a flat loop C1 outside the plates, the current passing through is I (so B ≠ 0). For a pot-shaped surface C2 whose bottom lies between the plates, no conduction current passes through it (so B = 0), though C1 and C2 have the same boundary. To resolve this contradiction, Maxwell introduced 'displacement current' I_d = ε_0 * (dФ_E / dt) arising from the time-varying electric flux Ф_E between the plates. This makes current continuous across the circuit: outside, I_c = I and I_d = 0; inside, I_c = 0 and I_d = I.",
    bloomLevel: "Understand"
  },
  {
    id: "chunk-2-3",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    section: "2.2.1 Conduction Current vs Displacement Current",
    content: "Conduction current (I_c) is due to the actual flow of electric charges in a conductor under an applied potential difference, satisfying I_c = V/R. Displacement current (I_d) is due to a time-varying electric field in insulators or vacuum and is given by I_d = ε_0 * (dФ_E / dt). In a charging capacitor, I_c exists solely in the external wires, whereas I_d exists solely in the dielectric/vacuum between the plates, maintaining current continuity with identical magnetic field effects.",
    bloomLevel: "Understand"
  },
  {
    id: "chunk-2-4",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    section: "2.3.1 Sources & Production of Electromagnetic Waves",
    content: "Neither stationary charges nor charges in uniform motion can produce electromagnetic waves. Stationary charges produce only electrostatic fields, while steady currents produce time-invariant magnetic fields. Accelerated or oscillating charges radiate electromagnetic waves. An oscillating charge generates a time-varying electric field, which induces a time-varying magnetic field, which in turn regenerates a time-varying electric field. This self-sustaining interplay propagates in space. The wave's frequency matches the charge's oscillation frequency. Demonstration of visible light is difficult electrically because its frequency is ~6 * 10^14 Hz, while modern circuits only reach ~10^11 Hz.",
    bloomLevel: "Analyze"
  },
  {
    id: "chunk-2-5",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    section: "2.3.2 Transverse Nature & Mathematical Equations",
    content: "EM waves are transverse in nature; the oscillating electric (E) and magnetic (B) fields are perpendicular to each other and perpendicular to the direction of wave propagation. For a plane wave propagating along the z-direction, E lies along the x-axis, E_x = E_0 * sin(kz - ωt), and B lies along the y-axis, B_y = B_0 * sin(kz - ωt). They satisfy the amplitude ratio E_0 / B_0 = c, where c is the speed of light. In vacuum, c = 1 / sqrt(μ_0 * ε_0) ≈ 3 * 10^8 m/s, whereas in a material medium, speed is v = 1 / sqrt(μ * ε). Energy and momentum are carried by EM waves: momentum transferred to a completely absorbing surface is p = U / c.",
    bloomLevel: "Apply"
  },
  {
    id: "chunk-2-6",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    section: "2.4 Electromagnetic Spectrum & Order Mnemonic",
    content: "The electromagnetic spectrum is an orderly arrangement of all electromagnetic waves according to their wavelengths or frequencies. In order of increasing wavelength (decreasing frequency), the spectrum regions are: Gamma rays, X-rays, Ultraviolet rays, Visible rays, Infrared rays, Microwaves, and Radio waves. The board success mnemonic to remember this order (by capital letters) is: 'Ganguly’s team Xcept Uvaraj Visited IRfan’s Marriage with Radha' (Gamma, X-ray, UV, Visible, Infrared, Microwave, Radio). The entire spectrum covers wavelengths from 10^-14 m to 10^7 m and frequencies from 10 Hz to 10^22 Hz.",
    bloomLevel: "Remember"
  },
  {
    id: "chunk-2-7",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    section: "2.4.1 Radio Waves & Microwaves details",
    content: "Radio waves have wavelengths > 0.1 m and are produced by rapid acceleration/deceleration of electrons in conducting wires or aerials. They are detected by receiver aerials and used in broadcasting, TV, and cellular UHF networks. Microwaves have wavelengths from 0.1 m down to 1 mm, produced by special vacuum tubes like klystrons, magnetrons, or Gunn diodes. They are detected by point contact diodes and used in Radar systems for aviation/speed-guns, satellite communication, and domestic Microwave ovens where water molecules resonant frequency (~2.45 GHz) is matched for heating.",
    bloomLevel: "Apply"
  },
  {
    id: "chunk-2-8",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    section: "2.4.2 Infrared, Visible & Ultraviolet details",
    content: "Infrared (IR) waves (1 mm - 700 nm) are produced by hot bodies/molecules, detected by bolometers or photofilm, and used in physical therapy, remote controls, and military crop satellites; called 'heat waves' because water, CO2, and NH3 molecules readily absorb them. Visible rays (700 nm - 400 nm) are detected by the human eye and used for vision and photosynthesis. Ultraviolet (UV) rays (400 nm - 0.6 nm) are produced by very hot bodies like the Sun or welding arcs, and used in sterilizing surgical instruments, germ killing in water purifiers, forged document detection, and LASIK eye surgery.",
    bloomLevel: "Analyze"
  },
  {
    id: "chunk-2-9",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    section: "2.4.3 Ultraviolet Hazards & Window Tanning Paradox",
    content: "UV radiation carries significant energy and in large quantities has harmful effects on humans, such as inducing excess melanin production (skin tanning) or sunburn. Welders wear special glass goggles or face masks to protect their eyes from the high volume of UV produced by welding arcs. Ordinary glass acts as a barrier: it strongly absorbs UV radiation. Therefore, one cannot get skin tanned or sunburned while sitting indoors behind standard glass windows. The ozone layer in the atmosphere at 40-50 km plays a protective role by absorbing harmful solar UV radiation.",
    bloomLevel: "Understand"
  },
  {
    id: "chunk-2-10",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    section: "2.4.4 X-Rays & Gamma Rays details",
    content: "X-rays (10 nm - 10^-13 m) are produced by bombarding a heavy metal target with high-energy electrons in X-ray tubes. They are detected by Geiger tubes, photographic plates, or ionization chambers, and used as diagnostic tools for bones, treatment of cancer, and crystal structure analysis. Gamma rays (<10^-10 m down to <10^-14 m) have the highest frequency and are produced in nuclear reactions or radioactive nucleus decay. They are used in radiotherapy to destroy cancer cells and sterilize surgical equipment. Due to high ionizing power, unnecessary exposure to both is highly dangerous.",
    bloomLevel: "Evaluate"
  }
];

export const BOARD_QUESTION_BANK: Question[] = [
  {
    id: "q-1-1",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    questionText: "State Faraday's laws of electromagnetic induction. State Lenz's law and explain how Lenz's law is in accordance with the law of conservation of energy.",
    marks: 5,
    bloomLevel: "Understand",
    rubric: [
      "Stating Faraday's First and Second laws of electromagnetic induction clearly [2 marks]",
      "Stating Lenz's law correctly [1 mark]",
      "Explaining the physical scenario of moving a north pole of a magnet towards a coil [1 mark]",
      "Proving that work done against the opposing force is converted to electrical energy, satisfying energy conservation [1 mark]"
    ],
    sampleAnswer: "1. **Faraday's Laws of Electromagnetic Induction:**\n- **First Law:** Whenever the magnetic flux linked with an electric circuit changes, an electromotive force (EMF) is induced in the circuit. This induced EMF lasts only as long as the change in magnetic flux continues.\n- **Second Law:** The magnitude of the induced EMF is directly proportional to the time rate of change of magnetic flux linked with the circuit:\n  e = - (dФ_B / dt)\n\n2. **Lenz's Law:**\nLenz's Law states that the direction of the induced current (or EMF) is such that it always opposes the change in magnetic flux that produces it.\n\n3. **Accordance with Conservation of Energy:**\nConsider a closed coil and a bar magnet. When the North pole of the bar magnet is moved towards the coil, the magnetic flux links with the coil and changes. This induces an electric current in the coil.\n- According to Lenz's law, the induced current in the coil flows in such a direction (counter-clockwise) that the face of the coil behaves as a North pole. This set of similar poles repels the incoming magnet.\n- To push the magnet further towards the coil, external mechanical work must be done to overcome this force of repulsion.\n- This mechanical work done is converted directly into electrical energy inside the coil (and subsequently into heat energy due to resistance).\n- If the induced pole were a South pole instead (violating Lenz's law), the magnet would be attracted, accelerating on its own and creating infinite current without external work—a blatant violation of the conservation of energy. Therefore, Lenz's law is a direct consequence of the Law of Conservation of Energy."
  },
  {
    id: "q-1-2",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    questionText: "Derive the expression for the motional EMF induced across a straight conductor moving perpendicular to a uniform magnetic field: e = B * v * l.",
    marks: 5,
    bloomLevel: "Apply",
    rubric: [
      "Drawing or describing a rectangular conductor frame in a perpendicular magnetic field [1 mark]",
      "Writing the expression for magnetic flux Ф_B = B * l * x [1 mark]",
      "Applying Faraday's second law: e = -dФ_B / dt [1 mark]",
      "Substituting dx/dt = -v as the velocity of the conductor [1 mark]",
      "Obtaining the final equation e = B * v * l [1 mark]"
    ],
    sampleAnswer: "1. **Motional EMF Derivation:**\nLet us consider a straight conducting rod PQ of length l moving with a constant velocity v perpendicular to a uniform, constant magnetic field B directed perpendicularly into the plane of the paper (represented by crosses).\n- The rod moves on a U-shaped metallic frame to form a closed rectangular loop PQRS. Let x be the distance of the moving rod PQ from the side RS.\n- The area of the loop PQRS at any instant is: A = l * x.\n\n2. **Calculating Magnetic Flux:**\nThe magnetic flux Ф_B linked with this loop PQRS is:\nФ_B = B • A = B * l * x (since B is perpendicular to the area, θ = 0°).\n\n3. **Applying Faraday’s Law:**\nAccording to Faraday's law of electromagnetic induction, the magnitude of the induced EMF e is:\ne = - (dФ_B / dt)\nSubstitute the flux relation Ф_B = B * l * x into the equation:\ne = - d(B * l * x) / dt\nSince B and l are constants, they can be pulled out of the derivative:\ne = - B * l * (dx / dt)\n\n4. **Establishing Velocity:**\nHere, dx/dt represents the rate of change of position x. As the rod is moving inwards, the distance x is decreasing with time. Therefore, the velocity v of the rod is defined as:\nv = - (dx / dt)\nSubstituting this value back into our EMF equation yields:\ne = B * v * l\nThis is the required expression for the motional EMF induced across a moving straight conductor."
  },
  {
    id: "q-1-3",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    questionText: "Define self-inductance. Derive the expression for the self-inductance of a long straight solenoid of length l, cross-sectional area A, and total turns N.",
    marks: 5,
    bloomLevel: "Apply",
    rubric: [
      "Defining self-inductance clearly with SI units (Henry) [1 mark]",
      "State magnetic field inside a long solenoid B = μ_0 * N * I / l [1 mark]",
      "Calculating magnetic flux through a single turn and total flux linkage NФ_B [1 mark]",
      "Equating NФ_B = L * I [1 mark]",
      "Obtaining the final self-inductance formula: L = μ_0 * N^2 * A / l [1 mark]"
    ],
    sampleAnswer: "1. **Definition of Self-Inductance:**\nSelf-inductance is the property of a coil by virtue of which it opposes any change in the strength of current flowing through it by inducing an opposing back EMF. Its SI unit is **Henry (H)**.\n\n2. **Derivation for a Long Solenoid:**\nConsider a long straight solenoid of length l, uniform cross-sectional area A, and total number of turns N. Let I be the current flowing through it.\n- The number of turns per unit length is n = N/l.\n- The uniform magnetic field B inside the solenoid far from the ends is given by:\n  B = μ_0 * n * I = μ_0 * (N / l) * I (Equation 1)\n\n3. **Flux Linkage Determination:**\nThe magnetic flux associated with a single turn of the solenoid is:\nФ_B = B * A = μ_0 * (N / l) * I * A\n- Therefore, the total magnetic flux linked with all N turns (flux linkage) is:\n  Total Flux = N * Ф_B = N * [μ_0 * (N / l) * I * A]\n  Total Flux = [μ_0 * N^2 * A * I] / l (Equation 2)\n\n4. **Obtaining Self-Inductance (L):**\nWe know that the total magnetic flux linked with a coil is proportional to the current flow I, satisfying:\nTotal Flux = L * I (Equation 3)\nwhere L is the self-inductance of the solenoid. Equating Equation 2 and Equation 3:\nL * I = [μ_0 * N^2 * A * I] / l\nDividing both sides by the current I yields the final coefficient of self-induction:\nL = (μ_0 * N^2 * A) / l\nThis shows that self-inductance depends only on the geo-structural dimensions (N, A, l) and the magnetic permeability of the core medium."
  },
  {
    id: "q-2-1",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    questionText: "Explain the inconsistency of Ampere's circuital law during the charging of a capacitor. How did Maxwell resolve this, and what is displacement current?",
    marks: 5,
    bloomLevel: "Analyze",
    rubric: [
      "Stating Ampere's circuital law and drawing/describing the parallel plate capacitor setup [1 mark]",
      "Applying Ampere's law to loop C1 (B ≠ 0) and pot-shaped surface C2 (B = 0) to prove contradiction [2 marks]",
      "Defining displacement current mathematically as I_d = ε_0 * (dФ_E / dt) [1 mark]",
      "Explaining how displacement current restores continuity of current inside the capacitor [1 mark]"
    ],
    sampleAnswer: "1. **The Inconsistency of Ampere's Circuital Law:**\nConsider a parallel plate capacitor C being charged by a steady current I(t). Let's apply Ampere's circuital law, ∮ B • dl = μ_0 * I, to find the magnetic field at point P outside the capacitor.\n- First, we choose a flat circular loop C1 of radius r around the wire. The current passing through it is I, so we have: ∮ B • dl = B(2πr) = μ_0 * I  ⇒  B ≠ 0 (Equation 1).\n- Second, we consider a pot-shaped surface C2 whose mouth is the same loop C1 but its bottom lies in the region between the capacitor plates. No conduction current passes through this surface, so I = 0. Applying Ampere's law gives: ∮ B • dl = B(2πr) = 0  ⇒  B = 0 (Equation 2).\nSince C1 and C2 share the exact same perimeter path, their line integrals must be identical. Yet Equation 1 and Equation 2 completely contradict each other. This shows that Ampere's circuital law is logically inconsistent!\n\n2. **Maxwell's Resolution & Displacement Current:**\nMaxwell argued that a changing electric field between the capacitor plates must generate a magnetic field. He introduced an additional current called **displacement current (I_d)**:\nI_d = ε_0 * (dФ_E / dt)\nwhere Ф_E is the electric flux through the surface S between the plates (Ф_E = E * A = Q / ε_0).\nTherefore, dФ_E/dt = (1/ε_0) * (dQ/dt) = I_c / ε_0  ⇒  ε_0 * (dФ_E/dt) = I_c.\nBy substituting the generalized current (I_c + I_d) into Ampere's law, we obtain the consistent **Ampere-Maxwell Law**:\n∮ B • dl = μ_0 * I_c + μ_0 * ε_0 * (dФ_E / dt)\nThis completely resolves the contradiction, making the total current continuous: outside the plates, current is conduction current; inside the plates, current is displacement current."
  },
  {
    id: "q-2-2",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    questionText: "Write the expressions for the electric (E) and magnetic (B) field vectors of a transverse plane electromagnetic wave propagating along the z-direction. Show how the wave speed related to constants.",
    marks: 5,
    bloomLevel: "Apply",
    rubric: [
      "Writing the sinusoidal equation for electric field vector E_x(t) along x-axis [1 mark]",
      "Writing the sinusoidal equation for magnetic field vector B_y(t) along y-axis [1 mark]",
      "Stating the transverse nature as E, B, and propagation vectors being mutually perpendicular [1 mark]",
      "Giving the relation between amplitude ratio and speed: E_0 / B_0 = c [1 mark]",
      "Expressing wave speed in terms of vacuum constants c = 1 / sqrt(μ_0 * ε_0) with value 3 * 10^8 m/s [1 mark]"
    ],
    sampleAnswer: "For a plane electromagnetic wave propagating along the positive z-direction:\n1. **Sinusoidal Field Equations:**\n- The oscillating Electric field E is directed along the x-axis, varying sinusoidally with time t and position z:\n  E_x(z, t) = E_0 * sin(kz - ωt)\n- The oscillating Magnetic field B is directed along the y-axis, varying sinusoidally with the same phase:\n  B_y(z, t) = B_0 * sin(kz - ωt)\n\n2. **Transverse Nature & Ratios:**\n- The electric field vector E, magnetic field vector B, and direction of propagation z are mutually perpendicular to each other (E ⊥ B ⊥ z), which proves the transverse nature of electromagnetic waves.\n- The maximum amplitude of fields are related by the ratio: E_0 / B_0 = c\n\n3. **Relationship with Constants:**\n- The speed of the electromagnetic wave in free space/vacuum (c) is determined by the permeability (μ_0) and permittivity (ε_0) constants of free space:\n  c = 1 / sqrt(μ_0 * ε_0)\n- Substituting the values (μ_0 = 4π * 10^-7 T m/A and ε_0 = 8.854 * 10^-12 C^2/N m^2) yields: c ≈ 3 * 10^8 m/s.\n- In a material medium, the speed v of light becomes v = 1 / sqrt(μ * ε)."
  },
  {
    id: "q-2-3",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    questionText: "State the mathematical forms of Maxwell's four equations in vacuum and briefly write down what physical laws they represent.",
    marks: 5,
    bloomLevel: "Understand",
    rubric: [
      "Gauss's Law for Electricity: ∮ E • dA = q / ε_0 [1 mark]",
      "Gauss's Law for Magnetism: ∮ B • dA = 0 [1 mark]",
      "Faraday's Law of Induction: ∮ E • dl = -dФ_B / dt [1 mark]",
      "Ampere-Maxwell Law: ∮ B • dl = μ_0 * I_c + μ_0 * ε_0 * (dФ_E / dt) [1 mark]",
      "Explaining the physical importance and significance of these equations [1 mark]"
    ],
    sampleAnswer: "Maxwell's equations in vacuum are the fundamental mathematical expressions of all laws of electromagnetism. They are:\n1. **Gauss's Law for Electrostatics:**\n   ∮ E • dA = Q / ε_0\n   *Physical Law:* Represents that electric charges are sources of electric fields, and isolated electric monopoles (charges) can exist.\n2. **Gauss's Law for Magnetism:**\n   ∮ B • dA = 0\n   *Physical Law:* Shows that the net magnetic flux through any closed surface is always zero. This proves that magnetic monopolies do not exist; magnetic poles always occur as equal and opposite dipoles.\n3. **Faraday's Law of Electromagnetic Induction:**\n   ∮ E • dl = -dФ_B / dt\n   *Physical Law:* Rephrases Faraday's law, stating that a time-varying magnetic flux induces a circulating, non-conservative electric field.\n4. **Ampere-Maxwell Law:**\n   ∮ B • dl = μ_0 * I_c + μ_0 * ε_0 * (dФ_E / dt)\n   *Physical Law:* States that magnetic fields are produced both by conducting currents (I_c) and by time-varying electric flux (displacement current)."
  },
  {
    id: "q-2-4",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    questionText: "List any five key properties or characteristics of electromagnetic waves.",
    marks: 5,
    bloomLevel: "Remember",
    rubric: [
      "Transverse nature (E and B perpendicular to propagation) [1 mark]",
      "No material medium required for propagation [1 mark]",
      "Constant speed in vacuum c = 3 * 10^8 m/s [1 mark]",
      "Capable of carrying energy, momentum, and exerting radiation pressure [1 mark]",
      "They are uncharged (not deflected by electric or magnetic fields) and exhibit reflection, refraction, and polarization [1 mark]"
    ],
    sampleAnswer: "The five key characteristics of electromagnetic waves are:\n1. **Transverse Nature:** The oscillating electric field (E) and magnetic field (B) are mutually perpendicular to each other, and also perpendicular to the direction of propagation of the wave.\n2. **No Material Medium Required:** Unlike mechanical waves, electromagnetic waves can travel through a vacuum or free space. They are self-sustaining oscillations of electric and magnetic fields.\n3. **Constant Speed:** In free space, all electromagnetic waves propagate with the exact same constant velocity, irrespective of their wavelength, which is c ≈ 3 * 10^8 m/s.\n4. **Energy, Momentum, and Radiation Pressure:** EM waves carry energy and transport momentum (p = U / c). When they strike a surface, they exert force per unit area known as radiation pressure.\n5. **Uncharged & Wave Properties:** Being uncharged, they are not deflected by external electric or magnetic fields. They undergo standard optical phenomena like reflection, refraction, interference, diffraction, and polarization."
  },
  {
    id: "q-2-5",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    questionText: "How are electromagnetic waves produced by accelerating charges? Why was it not easy to demonstrate their existence experimentally at first?",
    marks: 3,
    bloomLevel: "Understand",
    rubric: [
      "Explaining oscillating or accelerated charge generating self-propagating fields [1 mark]",
      "Explaining that the wave frequency equals the charge's oscillation frequency [1 mark]",
      "Explaining the frequency gap: visible light is ~6 * 10^14 Hz, while circuits reach only ~10^11 Hz. This is why low-frequency radio waves were used first [1 mark]"
    ]
  },
  {
    id: "q-2-6",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    questionText: "Distinguish between conduction current and displacement current. Provide their respective mathematical formulas.",
    marks: 3,
    bloomLevel: "Understand",
    rubric: [
      "Defining conduction current as charge flow in conductors, and displacement current as changing electric fields [1 mark]",
      "Writing conduction current formula I_c = V/R or dq/dt [1 mark]",
      "Writing displacement current formula I_d = ε_0 * (dФ_E / dt) [1 mark]"
    ]
  },
  {
    id: "q-2-7",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    questionText: "Explain the following board questions: (a) Why do welders wear special goggles? (b) Why are standard glass windows safe from sunburns? (c) Why are infrared waves called heat waves?",
    marks: 3,
    bloomLevel: "Understand",
    rubric: [
      "Welders goggles: protect eyes from dangerous high-volume UV produced by welding arcs [1 mark]",
      "Glass windows: standard ordinary glass strongly absorbs UV radiation, preventing tanning/sunburn [1 mark]",
      "Infrared heat waves: they are readily absorbed by water, CO2, and NH3 molecules, which increases thermal motion of the atoms and raises temperature [1 mark]"
    ]
  }
];

export const STATIC_MCQS_BANK: MCQ[] = [
  {
    id: "mcq-1-1",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    bloomLevel: "Remember",
    question: "Lenz's law is a direct consequence of which of the following physical laws?",
    options: [
      "Law of conservation of charge",
      "Law of conservation of momentum",
      "Law of conservation of energy",
      "Newton’s third law of motion"
    ],
    correctIndex: 2,
    explanation: "Lenz's law is a direct manifestation of the Law of Conservation of Energy. It ensures that the mechanical work done in moving a magnet against opposing forces is converted into the electrical energy of the induced current."
  },
  {
    id: "mcq-1-2",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    bloomLevel: "Understand",
    question: "The self-inductance of a long solenoid is directly proportional to:",
    options: [
      "the number of turns N",
      "the square of the number of turns N²",
      "the square root of the number of turns √N",
      "the current flowing through it I"
    ],
    correctIndex: 1,
    explanation: "According to the derived formula L = μ_0 * N² * A / l, the self-inductance L of a solenoid is directly proportional to the square of the total number of turns (N²)."
  },
  {
    id: "mcq-1-3",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    bloomLevel: "Apply",
    question: "Coils of resistance 10 Ω are placed in a changing magnetic flux. If the flux decreases from 12 Wb to 2 Wb in 0.5 s, find the magnitude of the induced current:",
    options: [
      "1 A",
      "2 A",
      "5 A",
      "20 A"
    ],
    correctIndex: 1,
    explanation: "Induced EMF e = -ΔФ_B / Δt = -(2 - 12) / 0.5 = 10 / 0.5 = 20 V. Then, according to Ohm's Law, induced current I = e / R = 20 V / 10 Ω = 2 A."
  },
  {
    id: "mcq-1-4",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    bloomLevel: "Understand",
    question: "What is the primary method used to reduce heating loss from eddy currents in a transformer core?",
    options: [
      "Using a high voltage input",
      "Using a thick hollow wire winding",
      "Using a laminated iron core stack",
      "Wrapping the core in superconducting tape"
    ],
    correctIndex: 2,
    explanation: "Eddy current heat dissipation is reduced by using laminated cores. The thin iron sheets are separated by insulating varnish which breaks the large circulating paths of currents, reducing energy losses."
  },
  {
    id: "mcq-1-5",
    chapterId: 1,
    chapterName: "Electromagnetic Induction",
    bloomLevel: "Apply",
    question: "A metallic rod of length 2 m goes perpendicular to a magnetic field of 0.5 T with a speed of 10 m/s. What EMF is induced across its ends?",
    options: [
      "1 V",
      "5 V",
      "10 V",
      "20 V"
    ],
    correctIndex: 2,
    explanation: "Induced motional EMF is given by e = B * v * l. Substituting the given values: e = 0.5 T * 10 m/s * 2 m = 10 V."
  },
  {
    id: "mcq-2-1",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    bloomLevel: "Remember",
    question: "Who experimentally demonstrated the existence of electromagnetic waves in 1887?",
    options: [
      "James Clerk Maxwell",
      "Heinrich Rudolf Hertz",
      "Guglielmo Marconi",
      "Jagdish Chandra Bose"
    ],
    correctIndex: 1,
    explanation: "Heinrich Rudolf Hertz experimentally verified Maxwell's equations and demonstrated the existence of electromagnetic waves in his laboratory setup in 1887. He also discovered the photoelectric effect during this experiment."
  },
  {
    id: "mcq-2-2",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    bloomLevel: "Remember",
    question: "What is the angle between the electric field vector E and the magnetic field vector B in an electromagnetic wave?",
    options: [
      "0° (Parallel)",
      "45°",
      "90° (Perpendicular)",
      "180°"
    ],
    correctIndex: 2,
    explanation: "E and B fields oscillate perpendicular to each other, and perpendicular to the direction of propagation in an electromagnetic wave. Thus, the angle between the E and B vectors is 90°."
  },
  {
    id: "mcq-2-3",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    bloomLevel: "Understand",
    question: "During charging of a parallel plate capacitor, the direction of the magnetic field generated between the plates is:",
    options: [
      "Perpendicular to the plane of the plates",
      "Parallel to the plane of the plates",
      "Along the direction of the conduction current",
      "Always zero"
    ],
    correctIndex: 1,
    explanation: "Inside the plates, the displacement current generates a circular magnetic field whose field lines lie parallel to the plane of the plates. The electric field itself is perpendicular to the plates."
  },
  {
    id: "mcq-2-4",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    bloomLevel: "Apply",
    question: "If an electromagnetic wave with total energy U strikes a completely absorbing surface, what is the momentum p transferred to that surface?",
    options: [
      "p = U * c",
      "p = U / c",
      "p = U * c^2",
      "p = U / c^2"
    ],
    correctIndex: 1,
    explanation: "According to electromagnetic theory, EM waves carry momentum. If the wave energy is U and the wave is completely absorbed at the boundary, the momentum transferred is given by p = U / c. (If completely reflected, momentum transferred is 2U/c)."
  },
  {
    id: "mcq-2-5",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    bloomLevel: "Remember",
    question: "Which of the following electromagnetic radiations has the highest frequency in the electromagnetic spectrum?",
    options: [
      "X-rays",
      "Ultraviolet rays",
      "Gamma rays",
      "Microwaves"
    ],
    correctIndex: 2,
    explanation: "Gamma rays reside at the upper frequency range of the electromagnetic spectrum (wavelengths < 10^-10 m down to < 10^-14 m), giving them the highest frequency and highest quantum energy (E = hν)."
  },
  {
    id: "mcq-2-6",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    bloomLevel: "Apply",
    question: "LASIK eye surgery is a high-precision medical application that relies on which region of the electromagnetic spectrum?",
    options: [
      "Microwaves",
      "Infrared waves",
      "Visible light",
      "Ultraviolet rays"
    ],
    correctIndex: 3,
    explanation: "LASIK (Laser-assisted in situ keratomileusis) eye surgery utilizes highly focused, narrow excimer laser beams in the Ultraviolet (UV) spectrum range to reshape the cornea with high precision."
  },
  {
    id: "mcq-2-7",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    bloomLevel: "Understand",
    question: "Why are infrared waves often referred to as 'heat waves' in board textbooks?",
    options: [
      "They travel with the greatest velocity",
      "They are strongly absorbed by water and carbon dioxide molecules, raising their kinetic energy",
      "They originate solely from radioactive decay of nucleii",
      "They have the highest ionizing power of the spectrum"
    ],
    correctIndex: 1,
    explanation: "Infrared waves are absorbed readily by water, carbon dioxide, and ammonia molecules present in materials. After absorption, the thermal motion of these molecules increases, raising the temperature of their surroundings. This is why they are called heat waves."
  },
  {
    id: "mcq-2-8",
    chapterId: 2,
    chapterName: "Electromagnetic Waves",
    bloomLevel: "Apply",
    question: "A plane electromagnetic wave of frequency 25 MHz travels in free space along the x-direction. At a particular point in space and time, E = 6.3 j V/m. What is the magnetic field vector B at this point?",
    options: [
      "B = 2.1 * 10^-8 i T",
      "B = 2.1 * 10^-8 k T",
      "B = 1.89 * 10^9 k T",
      "B = 2.1 * 10^-8 (-k) T"
    ],
    correctIndex: 1,
    explanation: "The magnitude is B = E / c = 6.3 / (3 * 10^8) = 2.1 * 10^-8 T. For direction, we know the cross product E x B must point in the direction of wave propagation (positive x-direction or i-vector). Since E is along y-direction (j-vector), we solve: j x (?vector) = i. From vector algebra, j x k = i. Hence, B is directed along positive z-direction (k-vector), giving B = 2.1 * 10^-8 k T."
  }
];
