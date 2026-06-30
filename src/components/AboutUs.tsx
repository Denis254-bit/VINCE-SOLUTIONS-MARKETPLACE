import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  Users, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  Briefcase, 
  Target, 
  Lightbulb, 
  Handshake, 
  ArrowRight, 
  Check, 
  TrendingUp, 
  Cpu, 
  MapPin, 
  Phone, 
  Mail, 
  Heart,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface AboutUsProps {
  onContactSubmit?: (name: string, email: string, message: string) => void;
  onShowToast: (message: string) => void;
  onNavigateToHardware: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onContactSubmit, onShowToast, onNavigateToHardware }) => {
  const [activeTimelineYear, setActiveTimelineYear] = useState<'2011' | '2015' | '2020' | '2026'>('2026');
  const [selectedCoreValue, setSelectedCoreValue] = useState<'excellence' | 'integrity' | 'innovation' | 'clientFocus'>('excellence');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    department: 'general',
    message: ''
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Stats Interactive Factor
  const [targetImpactFactor, setTargetImpactFactor] = useState(1);

  const milestones = {
    '2011': {
      title: 'Our humble startup',
      subtitle: 'Where Vince began',
      description: 'Incorporated as a small IT consulting firm in Kisumu, focusing on local business systems, networking arrays, and custom repair services with high trust levels.',
      achievements: ['First local office launched', 'Assisted 20+ neighborhood retail stores', 'Laid foundational trust network']
    },
    '2015': {
      title: 'Scaling up Enterprise Channels',
      subtitle: 'Going national across Kenya',
      description: 'Opened corporate logistics nodes in Nairobi and expanded core capabilities to large business system imports, enterprise networks, and cloud installations.',
      achievements: ['Reached 200+ active business accounts', 'Secured specialized transport configurations', 'Registered with KRA for tax audits']
    },
    '2020': {
      title: 'Lenovo OEM Tier Integration',
      subtitle: 'Strategic global partnerships',
      description: 'Forged high-continuity wholesale paths directly with the Lenovo and Intel program. Shifted target workloads to high-security BIOS-protected workstations.',
      achievements: ['Certified Lenovo OEM Delivery Partner', '99.99% operational continuity SLAs introduced', 'Full hybrid workplace kits launched']
    },
    '2026': {
      title: 'Next-Gen AI & Edge Hardware',
      subtitle: 'The future of decentralized compute',
      description: 'Deploying high-speed edge intelligence servers that bring neural network vision, fast local database queries, and secure VPN sandboxing directly to office floors.',
      achievements: ['Active AI-enabled commercial workspaces', 'Automated cloud continuity integrations', 'KSh 12M+ in hardware savings created']
    }
  };

  const coreValues = {
    excellence: {
      title: 'Excellence in Execution',
      icon: Target,
      color: 'bg-indigo-50 border-indigo-200/60 text-indigo-700',
      description: 'We don’t just supply computers; we engineer end-to-end stability. Every unit undergoes strict multi-point BIOS and operating safety checks before dispatch.'
    },
    integrity: {
      title: 'Unyielding Integrity',
      icon: Handshake,
      color: 'bg-emerald-50 border-emerald-200/60 text-emerald-700',
      description: 'All deliveries are backed by authorized manufacturer serial codes. No grey imports, no unsealed components, and complete KRA tax transparency.'
    },
    innovation: {
      title: 'Pragmatic Innovation',
      icon: Lightbulb,
      color: 'bg-amber-50 border-amber-200/60 text-amber-700',
      description: 'We align physical workstations with modern virtual machine architectures, secure cloud continuity backup lines, and hybrid automation networks.'
    },
    clientFocus: {
      title: 'Client-Centered Focus',
      icon: UserCheck,
      color: 'bg-purple-50 border-purple-200/60 text-purple-700',
      description: 'Our technical support managers stay on line. If a field motherboard registers faults, we guarantee rapid shipping turnaround or back-to-back unit replacements.'
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email) {
      onShowToast('Please complete both name and email fields first.');
      return;
    }
    
    // Log inquiry state
    if (onContactSubmit) {
      onContactSubmit(
        bookingForm.name,
        bookingForm.email,
        `[Office Appointment - Dept: ${bookingForm.department}] ${bookingForm.message}`
      );
    }

    setBookingSubmitted(true);
    onShowToast(`Successfully logged appointment blueprint for ${bookingForm.name}!`);

    setTimeout(() => {
      setBookingSubmitted(false);
      setBookingForm({
        name: '',
        email: '',
        department: 'general',
        message: ''
      });
    }, 4500);
  };

  return (
    <div className="space-y-12 pb-12 animate-fade-in text-slate-800">
      
      {/* COHESIVE MODERN BANNER CONTAINER */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 md:p-14 border border-slate-800 shadow-xl">
        <div className="absolute inset-0 bg-cover bg-center brightness-[0.2] pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200')" }} />
        
        {/* Soft grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-mono font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ESTABLISHED 2011</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight text-white">
            Excellence, Innovation, <span className="text-indigo-400">Strategic Integrity</span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            Vince Solutions and Investment Limited bridges high-fidelity computing hardware with optimized corporate frameworks. We empower Kenyan clinics, educational structures, offices, and retailers to scale securely.
          </p>

          <div className="pt-3">
            <button
              onClick={onNavigateToHardware}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl cursor-pointer transition-all transform hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2 shadow-lg"
            >
              <span>Explore Certifed Hardware</span>
              <ArrowRight className="w-4 h-4 text-indigo-200" />
            </button>
          </div>
        </div>
      </section>

      {/* CORE DOUBLE CARD STORY & TIMELINE RHYTHM */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Story Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 md:p-8 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-slate-900 rounded-full inline-block" />
              <h3 className="text-lg font-display font-extrabold text-indigo-950 uppercase tracking-wider">Our Story & Mission</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              We started Vince Solutions with a simple realization: businesses in Kenya need authentic technology hardware combined with direct local support and KRA legal compliance, rather than unverified gray-market imports.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              By working in strategic partnership with global OEMs like Lenovo, we ensure every business notebook, edge computer, and enterprise printer is loaded with full factory-certified warranty shields and bios-level security layers.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Whether you are an SMB configuring a remote 10-person customer branch, or a complex hospital needing hybrid cloud security setups against local power failures, our certified Kisumu technical managers handle the design, compliance records, and direct dispatch and network routing under rigorous SLAs.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 text-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Direct KRA Tax Compliance</p>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
                We handle legal accounting, customized VAT business invoices, and clean clearance codes so your procurement pipelines remain fully protected.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Milestones timeline */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200/70 p-6 rounded-3xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-3">
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-slate-400">CORPORATE MILESTONES</span>
              <span className="text-xs text-indigo-600 font-bold">Timeline Track</span>
            </div>

            {/* Interactive Timeline Tabs */}
            <div className="grid grid-cols-4 gap-1.5">
              {(['2011', '2015', '2020', '2026'] as const).map(year => (
                <button
                  key={year}
                  onClick={() => setActiveTimelineYear(year)}
                  className={`py-2 rounded-xl border text-xs font-mono font-bold cursor-pointer transition-all ${
                    activeTimelineYear === year
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm scale-102'
                      : 'bg-white border-slate-250/50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Milestone Description Box */}
            <div className="bg-white border border-slate-150 p-5 rounded-2xl space-y-3 min-h-[160px] flex flex-col justify-between shadow-xs">
              <div className="space-y-1">
                <span className="text-[9px] font-semibold text-indigo-500 uppercase font-mono tracking-wider">
                  {milestones[activeTimelineYear].subtitle}
                </span>
                <h4 className="text-xs font-bold text-slate-950">
                  {milestones[activeTimelineYear].title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {milestones[activeTimelineYear].description}
                </p>
              </div>

              <div className="border-t border-slate-50 pt-2.5 space-y-1">
                <span className="text-[8px] font-mono uppercase tracking-widest font-black text-slate-400 block">KEY DIRECTIVES ARCHIVED:</span>
                <ul className="text-[10px] text-slate-600 space-y-1">
                  {milestones[activeTimelineYear].achievements.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <p className="text-[10px] text-center text-slate-400 font-mono italic">
              *All history milestones audited by compliance partners.
            </p>
          </div>
        </div>
      </section>

      {/* CORE VALUES INTERACTIVE SECTION */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1 pb-2">
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-slate-400 block">FOUNDATIONAL ETHOS</span>
          <h3 className="text-lg font-display font-extrabold text-indigo-950">Our Four Pillars of Corporate Integrity</h3>
          <p className="text-xs text-slate-500">Pick any core value to see how our Kisumu office enforces code values daily.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(coreValues).map(([key, value]) => {
            const Icon = value.icon;
            const isSelected = selectedCoreValue === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCoreValue(key as any)}
                className={`p-5 rounded-2xl border text-left cursor-pointer transition-all space-y-3 ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-102'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  isSelected 
                    ? 'bg-indigo-600/30 border-indigo-400/30 text-indigo-300' 
                    : 'bg-white border-slate-200/50 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold font-display">{value.title}</h4>
                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {value.description.slice(0, 75)}...
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Core Value expanded card rendering */}
        <div className="bg-slate-50 border border-slate-250 p-6 rounded-2xl text-xs flex flex-col sm:flex-row items-center gap-5 justify-between shadow-xs">
          <div className="space-y-2 max-w-2xl text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-bold uppercase rounded-md text-[9px] font-mono bg-indigo-50 border border-indigo-200/50 text-indigo-700">
              <Sparkles className="w-3 h-3" />
              <span>ACTIVE SYSTEM AUDIT: Excellence</span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">
              {coreValues[selectedCoreValue].title}
            </h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              {coreValues[selectedCoreValue].description} We believe that long-term strategic relationships are built on rigorous technical quality. To live up to these values, Vince maintains localized logistics buffers to instantly dispatch replacement parts or configure remote user setups whenever corporate partners seek assistance.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 self-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span className="text-[10px] text-emerald-800 font-mono font-bold tracking-wider">Active Policy</span>
          </div>
        </div>
      </section>

      {/* INTERACTIVE STATISTICS ENGINE WITH PREVIEW SCALE SLIDER */}
      <section className="bg-gradient-to-tr from-slate-50 to-indigo-50/20 border border-indigo-100/40 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 space-y-3">
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-indigo-600 block">OUR BUSINESS IMPACT</span>
          <h3 className="text-lg font-display font-extrabold text-slate-900 leading-snug">Project Volume & Team Footprint</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Move the slider to see how our certified experts scale their outputs as our client pool continues to expand year after year.
          </p>
          
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between font-bold text-[11px] text-slate-600">
              <span>Interactive Scale Factor</span>
              <span className="font-mono text-indigo-600 bg-white/80 border border-slate-100 px-2 py-0.5 rounded shadow-xs">Scale {targetImpactFactor}x</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={0.5}
              value={targetImpactFactor}
              onChange={(e) => setTargetImpactFactor(Number(e.target.value))}
              className="w-full accent-indigo-600 h-1 bg-slate-250 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold text-slate-700">
          {[
            { label: 'Satisfied Clients', value: 500, suffix: '+', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
            { label: 'Completed Projects', value: 1000, suffix: '+', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { label: 'Years Experience', value: 15, suffix: '+', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' },
            { label: 'Expert Staff', value: 50, suffix: '+', icon: Award, color: 'text-purple-600 bg-purple-50 border-purple-100' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            const originalVal = stat.value;
            const scaledVal = Math.round(originalVal * targetImpactFactor);
            return (
              <div key={i} className={`bg-white border rounded-2xl p-4.5 text-center shadow-xs flex flex-col justify-between space-y-2 border-slate-150`}>
                <div className="flex justify-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <span className="block text-xl md:text-2xl font-black font-mono text-slate-900 leading-none">
                    {scaledVal}{stat.suffix}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest leading-none">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* APPOINTMENT & CONSULTATION COMPONENT */}
      <section id="consult-booking-sec" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Booking Form Layout */}
        <div className="lg:col-span-7 bg-white border border-slate-250 p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
              Appointment Registry
            </span>
            <h3 className="text-lg font-display font-extrabold text-slate-900 leading-snug">
              Book a Certified Consultation at Kisumu Office
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              Need specialized assistance regarding fleet hardware deployments, cloud continuity schemas, or legal VAT invoicing? Register a session and we will align an engineer.
            </p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
            {bookingSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 p-5 rounded-2xl space-y-2 text-center animate-fade-in my-8">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-sm">Consultation Reserved Successfully!</h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We have registered your appointment for <strong>{bookingForm.name}</strong>. A technical logistics lead will dispatch a calendar invite to <strong>{bookingForm.email}</strong> dynamically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Okoth"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-700 outline-none focus:border-slate-800 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. client@domain.ke"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-700 outline-none focus:border-slate-800 focus:bg-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Expertise Target Area</label>
                  <select
                    value={bookingForm.department}
                    onChange={(e) => setBookingForm(p => ({ ...p, department: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-700 outline-none focus:border-slate-800 focus:bg-white cursor-pointer"
                  >
                    <option value="general">Helpdesk & Corporate fleets procurement</option>
                    <option value="systems">AI Edge deployment solutions & Servers</option>
                    <option value="continuity">Disaster backup and Hybrid Cloud arrays</option>
                    <option value="compliance">VAT compliance audits and Legal invoices</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Deployment Project Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Detail units count, network setup parameters, or constraints..."
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs text-slate-700 outline-none focus:border-slate-800 focus:bg-white resize-none"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white font-black py-3.5 rounded-xl cursor-pointer shadow duration-150 transform active:scale-95 text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Reserve My Consultation Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Office details panel */}
        <div className="lg:col-span-5 bg-slate-900 text-white border border-slate-800 p-6 md:p-8 rounded-3xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-indigo-400 block">OUR GATES ARE OPEN</span>
              <h4 className="text-base font-extrabold font-display">Vince Investments Office</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clients are always welcome to inspect active hardware batches or chat directly with our regional engineers.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Kisumu Office Location</span>
                  <span className="block text-[11px] text-slate-200">Vince Building Plaza, Kampala Street</span>
                  <span className="text-[10px] text-slate-400 italic">Kisumu City, Kenya</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Direct Telephone Desk</span>
                  <a href="tel:+254700000000" className="block text-[11px] text-slate-200 hover:underline hover:text-amber-300">
                    +254 700 000 000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-amber-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Administrative Email</span>
                  <a href="mailto:okothden99@gmail.com" className="block text-[11px] text-zinc-200 hover:underline hover:text-amber-300">
                    okothden99@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center gap-3.5 mt-6">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />
            <p className="text-[10px] text-slate-300 leading-normal font-sans">
              Proudly aligned with local development initiatives, fostering technical employment pathways across standard universities.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
