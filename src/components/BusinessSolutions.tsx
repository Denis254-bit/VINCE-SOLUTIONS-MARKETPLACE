import React, { useState } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  Activity, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  RefreshCw, 
  BarChart2, 
  Laptop, 
  Users, 
  Building, 
  HelpCircle, 
  HardDrive, 
  Cpu, 
  Plus, 
  ShoppingCart, 
  Send, 
  ChevronRight,
  Sparkles,
  Info,
  DollarSign,
  Search,
  Check,
  Package,
  Monitor
} from 'lucide-react';
import { Product } from '../types';

interface BusinessSolutionsProps {
  onAddProductToCart: (product: Product, quantity: number, options: { [key: string]: string }, extraPrice: number) => void;
  onNavigateToInvoice: () => void;
}

export const BusinessSolutions: React.FC<BusinessSolutionsProps> = ({ onAddProductToCart, onNavigateToInvoice }) => {
  // Tabs inside Solutions
  const [activeSection, setActiveSection] = useState<'suites' | 'laptops' | 'advisor' | 'directory'>('suites');

  // Directory filter search query
  const [dirSearch, setDirSearch] = useState('');

  // ROI Calculator States
  const [endpoints, setEndpoints] = useState<number>(25);
  const [supportLevel, setSupportLevel] = useState<'standard' | 'premium' | 'ultimate'>('premium');

  // Advisor States
  const [quizAnswers, setQuizAnswers] = useState({
    businessSize: 'smb',
    primaryGoal: 'hybrid-workforce',
    industry: 'retail',
    slaNeed: '24-7'
  });
  const [showAdvisorResult, setShowAdvisorResult] = useState(false);

  // Success Notification
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    notes: 'Please customize my chosen solution blueprint.'
  });

  // ROI Calculations
  const averageHardwareCostPerEmployee = 85000; // in KSh
  const calculatedITSavings = Math.round(endpoints * 12500 * (supportLevel === 'ultimate' ? 1.4 : supportLevel === 'premium' ? 1.2 : 0.9));
  const estimatedDowntimeReduction = supportLevel === 'ultimate' ? 95 : supportLevel === 'premium' ? 85 : 60;
  const estimatedHoursSavedMonthly = endpoints * (supportLevel === 'ultimate' ? 4 : supportLevel === 'premium' ? 3 : 1.8);

  // Quiz evaluation
  const evaluateAdvisor = () => {
    setShowAdvisorResult(true);
  };

  const resetAdvisor = () => {
    setShowAdvisorResult(false);
  };

  // Original suite products transformed into modern schema
  const LENOVO_SUITES = [
    {
      id: 'sol-ai-edge',
      name: 'Lenovo AI & Edge System Suite',
      price: 850000,
      specs: 'Edge-to-Cloud System Hardware Bundle · AI Analytics Software Stack · Installation included',
      image: 'https://p2-ofp.static.pub/ShareResource/ww/img/solutions/solutions-landing-page/solution-ai-edge.jpg',
      badge: 'Advanced AI',
      description: 'Brings high-speed server intelligence directly to your on-site retail surveillance cameras, factory production rows, or warehouse sensors without cloud latencies.',
      features: [
        'Complete physical edge computer rack unit with Xeon processing',
        'On-device local computer vision and NLP model setup assistance',
        'Secure encrypted routing gateway with zero external leaks',
        'Full physical engineer deployment and installation included'
      ],
      tagline: 'Optimize operations where data lives.'
    },
    {
      id: 'sol-digitalwork',
      name: 'Digital Workplace Endpoint Suite',
      price: 600000,
      specs: '10 Secure Hybrid Workstations · Unified Cloud Management Dashboard · 1 Year Endpoint Support',
      image: 'https://p4-ofp.static.pub/ShareResource/ww/img/solutions/solutions-landing-page/solution-digital-workplace.jpg',
      badge: 'Hybrid Workplace',
      description: 'Deploy a completely pre-configured high-security digital environment for your office team. Includes hardware setups, endpoint antivirus setups, and cloud communication routing.',
      features: [
        '10 customized professional employee laptops preconfigured on delivery',
        'Enterprise Active Directory and unified login accounts setup support',
        'Advanced central VPN routing defending company files from home Wi-Fi',
        '24/7 dedicated IT support hotline managed by certified specialists'
      ],
      tagline: 'Empower hybrid teams with world-class stability.'
    },
    {
      id: 'sol-hybridcloud',
      name: 'Vince Enterprise Hybrid Cloud Continuity',
      price: 1200000,
      specs: 'Hybrid server arrays · High speed fiber integration · Automated backup systems',
      image: 'https://p2-ofp.static.pub/ShareResource/ww/img/solutions/solutions-landing-page/solution-hybrid-cloud.jpg',
      badge: 'Hybrid Cloud & Continuity',
      description: 'Ensure 99.99% operational continuity. Replicates physical server environments instantly to virtual clouds to dodge any business downtime caused by power blackouts.',
      features: [
        'Local server array configuration + seamless synchronization to cloud instances',
        'Zero-loss disaster recovery protocols tested dynamically',
        'Highly resistant hardware shielding protecting financial databases',
        'Weekly compliance audits delivered directly to leadership emails'
      ],
      tagline: 'Banish downtime permanently.'
    },
    {
      id: "sol-sustainability",
      name: "ECO-Grid Green IT Initiative",
      price: 450000,
      badge: "Sustainability First",
      tagline: "Reduce overhead, support eco goals.",
      specs: "Low-voltage hardware selection · Solar backup arrays · Certified disposal",
      image: "https://p4-ofp.static.pub/ShareResource/ww/img/solutions/solutions-landing-page/solution-sustainability.jpg",
      description: "Our carbon offset hardware systems help you run high-performance compute cycles while minimizing climate footprint and physical office utility tariffs.",
      features: [
        "Energy Star certified low-draw power adapters",
        "EPEAT Gold hardware auditing logs",
        "Legacy system recycling credit values up to 15%",
        "Smart voltage switching protecting motherboards from voltage spikes"
      ]
    },
    {
      id: "sol-truscale",
      name: "Lenovo TruScale Infrastructure-as-a-Service",
      price: 750000,
      badge: "TruScale Model",
      tagline: "Scalable compute, immediate response.",
      specs: "Pay-as-you-go capacity · Flexible scale setups · Zero upfront licensing",
      image: "https://p3-ofp.static.pub/ShareResource/ww/img/solutions/solutions-landing-page/solution-truscale.jpg",
      description: "Immediate processing scaling without large capital budgets. Add node power dynamically for heavy analytical pipelines or month-end inventory runs.",
      features: [
        "Pay only for the hardware capacity and disk bandwidth you utilize",
        "Automatic server hardware upgrades handled transparently",
        "Direct API integration endpoints mapped in your cloud console",
        "Proactive remote management resolving firmware bugs before impact"
      ]
    }
  ];

  const BUSINESS_LAPTOPS = [
    {
      title: 'Professional AI Workstations',
      desc: 'High-performance workstations with AI capabilities, manageability and security for your hybrid workforce.',
      icon: Cpu,
      status: 'Elite Series',
      highlights: ['NVIDIA AI acceleration integration', 'Failsafe cooling mechanisms', 'Built-in neural processing core']
    },
    {
      title: 'Enterprise Chromebooks',
      desc: 'Engineered for enterprise, powered for productivity with cloud-based solutions and enhanced security.',
      icon: CloudIcon,
      status: 'Secure Cloud',
      highlights: ['Zero-touch deployments support', 'Ultra-fast sandboxed OS security', 'Seamless Google Workspace sync']
    },
    {
      title: 'Thin Client Solutions',
      desc: 'Mobile thin clients built secure and manageable for cloud and VDI environments with enterprise-grade reliability.',
      icon: Monitor,
      status: 'Cloud Virtualization',
      highlights: ['Minimalist local storage exposure', 'Exceptional battery performance life', 'Centralized configuration profiles']
    },
    {
      title: 'Business Security Hardware',
      desc: 'Advanced security features to protect data, identity, and devices from cyberattacks and unauthorized access.',
      icon: ShieldCheck,
      status: 'Defense Ready',
      highlights: ['BIOS-level self-healing safeguard', 'Fingerprint and IR camera login', 'Hardware-enforced virtual sandbox']
    }
  ];

  // Large arrays from the original Page
  const INDUSTRIES = [
    'Architecture, Engineering & Construction',
    'Education Systems',
    'Government Offices',
    'Healthcare Clinics',
    'Manufacturing Lines',
    'Media & Entertainment Studios',
    'OEM Infrastructure Solutions',
    'Enterprise Retail Deployments',
    'SMB Infrastructure Solutions',
    'Telco & ISP Networks'
  ];

  const OTHER_SOLUTIONS = [
    'Virtual & Augmented Reality (ThinkReality)',
    'Enterprise Data Protection & Ransomware Shield',
    'Big Data & Analytical Warehouse Hubs',
    'Integrated Business Enterprise ERP Matrices',
    'Secure Financial Database Infrastructure',
    'High-Performance Clustered Computing (HPC)',
    'Kubernetes & Native Docker Container Pools',
    'Windows 11 Migration & Fleet Management'
  ];

  const PARTNERS = [
    'Advanced Micro Devices (AMD Corp)',
    'Intel Core & Xeon Accelerators',
    'Microsoft Cloud & Azure Hybrid Team',
    'NVIDIA GPU Computing Alliance',
    'Red Hat Enterprise Linux Platforms',
    'SAP Database Specialists Group',
    'VMWare Cloud Virtualization Suite',
    'Lenovo AI Innovators Alliance Ecosystem'
  ];

  // Filter lists based on Search input
  const filteredIndustries = INDUSTRIES.filter(i => i.toLowerCase().includes(dirSearch.toLowerCase()));
  const filteredOther = OTHER_SOLUTIONS.filter(o => o.toLowerCase().includes(dirSearch.toLowerCase()));
  const filteredPartners = PARTNERS.filter(p => p.toLowerCase().includes(dirSearch.toLowerCase()));

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryForm({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        notes: 'Please customize my chosen solution blueprint.'
      });
    }, 5000);
  };

  const addToCartHelper = (suite: typeof LENOVO_SUITES[0]) => {
    // Mapping model into structural format of PRODUCTS_CATALOG
    const mockProduct: Product = {
      id: suite.id,
      name: suite.name,
      category: 'solutions',
      price: suite.price,
      brand: 'Lenovo Suite Partner',
      specs: suite.specs,
      image: suite.image,
      description: suite.description,
      features: suite.features,
      rating: 5.0,
      reviewsCount: 1,
      stockStatus: 'In Stock'
    };
    onAddProductToCart(mockProduct, 1, {}, 0);
  };

  return (
    <div className="space-y-12 pb-12 animate-fade-in text-slate-800">
      
      {/* GLORIOUS HERO BANNER SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 md:p-14 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-cover bg-center brightness-[0.22] pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200')" }} />
        
        {/* Real-time decorative tech grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-mono font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXECUTIVE ENTERPRISE HUB</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight leading-tight text-white">
            Transform Your Infrastructure via <span className="text-amber-400 bg-clip-text">Vince Enterprise & Lenovo</span>
          </h2>
          
          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
            Vince Solutions coordinates fully-managed IT, AI-Edge server infrastructure arrays, high-continuity backup modules, and premium Lenovo business fleets. We design local deployments, handle VAT filings, and provide robust SLAs directly across Kenya.
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <button
              onClick={() => {
                const quizSec = document.getElementById('advisor-quiz-sec');
                if (quizSec) quizSec.scrollIntoView({ behavior: 'smooth' });
                setActiveSection('advisor');
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-6 py-3.5 rounded-xl cursor-pointer transition-all transform hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2 shadow-lg hover:shadow-amber-500/10"
            >
              <span>Launch Dynamic Advisor Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#consult-form"
              className="bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 border border-slate-700/50"
            >
              <span>Get Commercial Price Blueprint</span>
            </a>
          </div>
        </div>

        {/* Real-time stats display in page margins */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-center">
          <div>
            <span className="block text-2xl md:text-3xl font-extrabold text-white font-mono">99.99%</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5 block">Continuity SLA</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-extrabold text-white font-mono">&lt;2 Hours</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5 block">Local Dispatch</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-extrabold text-white font-mono">100%</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5 block">KRA Tax Compliant</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-extrabold text-amber-400 font-mono">KSh 12M+</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5 block">Fleet Savings</span>
          </div>
        </div>
      </section>

      {/* DETAILED INTERACTIVE CONTROL TABS */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1 px-1 h-5 bg-indigo-600 rounded-full inline-block" />
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-display">Interactive Navigation</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Active Tab Selector</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'suites', label: 'Lenovo Systems Suites', desc: 'Managed Bundles' },
            { id: 'laptops', label: 'Business AI Hardware', desc: 'Device Classes' },
            { id: 'advisor', label: 'AI Solution Advisor', desc: 'Tailored Quiz' },
            { id: 'directory', label: 'Solutions Directory', desc: 'Explore Specs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex-1 min-w-[150px] text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-[1.02]'
                  : 'bg-white border-slate-200/70 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="font-bold text-xs">{tab.label}</div>
              <div className={`text-[10px] mt-0.5 ${activeSection === tab.id ? 'text-amber-400/85' : 'text-slate-400'}`}>{tab.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* TABS VIEW RENDERERS */}

      {/* TAB 1: LENOVO SYSTEMS SUITES */}
      {activeSection === 'suites' && (
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-display font-extrabold text-slate-900">Explore Preconfigured Lenovo Suites</h3>
            <p className="text-xs text-slate-500">
              Pick a complete architecture designed for ultimate security. Add easily to your cart index or request a direct quotation blueprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LENOVO_SUITES.map(suite => (
              <div key={suite.id} className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div className="relative h-48 overflow-hidden pointer-events-none">
                  <img src={suite.image} alt={suite.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-slate-900 text-white font-mono font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {suite.badge}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="block text-lg font-extrabold text-slate-100 font-mono">
                      KSh {new Intl.NumberFormat('en-KE').format(suite.price)}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-display font-extrabold text-slate-900 leading-snug">{suite.name}</h4>
                    <span className="text-[10px] font-semibold text-slate-400 block">{suite.specs}</span>
                    <p className="text-xs text-slate-500 leading-normal">{suite.description}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                    <span className="text-[8px] font-mono tracking-widest uppercase font-bold text-slate-400 block">KEY OUTCOMES</span>
                    <ul className="space-y-1 text-[10px] text-slate-600 leading-normal">
                      {suite.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => addToCartHelper(suite)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl transition-all text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Vault Cart</span>
                    </button>
                    <a
                      href="#consult-form"
                      onClick={() => {
                        setInquiryForm(prev => ({
                          ...prev,
                          notes: `Interested in customized options for ${suite.name} (Blueprint Reference ID: ${suite.id}).`
                        }));
                      }}
                      className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-3 rounded-xl transition-colors text-[10px] flex items-center justify-center text-center"
                    >
                      Quote Support
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: BUSINESS AI HARDWARE */}
      {activeSection === 'laptops' && (
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-display font-extrabold text-slate-900">Elite Business AI Computing</h3>
            <p className="text-xs text-slate-500">
              Specially selected enterprise notebook lines integrated with self-healing BIOS-level defense blocks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BUSINESS_LAPTOPS.map((lap, i) => {
              const IconComp = lap.icon;
              return (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:border-indigo-100 hover:shadow-sm transition-all space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{lap.status}</span>
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{lap.title}</h4>
                    <p className="text-xs text-slate-500 leading-normal">{lap.desc}</p>
                  </div>

                  <div className="border-t border-slate-50 pt-3.5 space-y-1.5">
                    <span className="text-[8px] font-mono tracking-widest text-slate-400 block uppercase font-bold">SYSTEM STABILITY</span>
                    <ul className="space-y-1 text-[10px] text-slate-500 leading-snug">
                      {lap.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-indigo-400 rounded-full" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#f0f9ff]/70 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 text-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-blue-950">Sponsored & Guaranteed by Lenovo Authorized OEM Program</p>
              <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">
                Vince Investments maintains full service support contracts. Hardware deliveries are dispatched directly with sealed warranty certs matching original factory lines.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: DYNAMIC ADVISOR QUIZ */}
      {activeSection === 'advisor' && (
        <section id="advisor-quiz-sec" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quiz Column */}
          <div className="lg:col-span-7 bg-white border border-slate-250/90 p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <span>Quiz Algorithm Ready</span>
              </div>
              <h3 className="text-lg font-display font-extrabold text-slate-900">Configure Your Interactive Workspace Solution</h3>
              <p className="text-xs text-slate-400">Specify operational inputs and we will instantly recommend the optimal configuration block.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Question 1: Business Size */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 block">Company Operational Scale</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 'smb', label: 'SMB (1-20)' },
                    { val: 'mid', label: 'Mid (21-100)' },
                    { val: 'enterprise', label: 'Enterprise' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setQuizAnswers(p => ({ ...p, businessSize: opt.val }))}
                      className={`py-2 px-1 rounded-lg border text-[10px] font-mono leading-tight cursor-pointer text-center ${
                        quizAnswers.businessSize === opt.val
                          ? 'bg-slate-900 border-slate-900 text-white font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Primary Goal */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 block">Corporate Primary Metric</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 'hybrid-workforce', label: 'Hybrid Teams' },
                    { val: 'edge-computing', label: 'AI Edge Tech' },
                    { val: 'zero-downtime', label: 'Downtime SLA' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setQuizAnswers(p => ({ ...p, primaryGoal: opt.val }))}
                      className={`py-2 px-1 rounded-lg border text-[10px] font-mono leading-tight cursor-pointer text-center ${
                        quizAnswers.primaryGoal === opt.val
                          ? 'bg-slate-900 border-slate-900 text-white font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Industry */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 block">Industry Sector Channel</span>
                <select
                  value={quizAnswers.industry}
                  onChange={(e) => setQuizAnswers(p => ({ ...p, industry: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[11px] font-semibold text-slate-600 focus:outline-none focus:border-slate-800 focus:bg-white cursor-pointer"
                >
                  <option value="retail">Retail commerce & Branch</option>
                  <option value="healthcare">Healthcare & Audits</option>
                  <option value="education">Higher Education Schools</option>
                  <option value="government">Government Administrative Block</option>
                  <option value="finance">Banking & Financial Arrays</option>
                  <option value="engineering">Construction & CAD Studio</option>
                </select>
              </div>

              {/* Question 4: SLA Target */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 block">Requested Support Desk SLA</span>
                <select
                  value={quizAnswers.slaNeed}
                  onChange={(e) => setQuizAnswers(p => ({ ...p, slaNeed: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[11px] font-semibold text-slate-600 focus:outline-none focus:border-slate-800 focus:bg-white cursor-pointer"
                >
                  <option value="9-to-5">Standard business hours response</option>
                  <option value="24-7">24/7 Priority support hotline</option>
                  <option value="managed">Fully managed IT agent dispatch</option>
                </select>
              </div>

            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={evaluateAdvisor}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                <Zap className="w-4 h-4" />
                <span>Evaluate Recommendation Blueprint</span>
              </button>
              {showAdvisorResult && (
                <button
                  onClick={resetAdvisor}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 min-h-[300px] flex flex-col justify-between">
            {!showAdvisorResult ? (
              <div className="text-center my-auto space-y-3 p-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                  <HelpCircle className="w-6 h-6 stroke-1" />
                </div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Awaiting Solution Variables</h4>
                <p className="text-[11px] text-slate-400 leading-normal max-w-xs mx-auto">
                  Complete the diagnostic answers panel and evaluate execution matrix to instantly recommend hardware, server pools, and estimated KSh pricing.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in flex flex-col justify-between h-full">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider">CALCULATOR RESULT</span>
                    <span className="text-[9px] font-mono text-indigo-600 bg-indigo-50 font-semibold px-2 py-0.5 rounded-md">98% Fit Rating</span>
                  </div>

                  {/* Recommendation Logic */}
                  {quizAnswers.primaryGoal === 'edge-computing' ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">Recommended: Lenovo AI & Edge Suite</h4>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Your engineering profiles or surveillance targets suggest local analytical edge nodes. We recommend full physical Xeon server array configurations with on-board local LLM and security routing.
                      </p>
                      <div className="text-xs font-bold text-slate-900 border-t border-slate-200/50 pt-2 font-mono">
                        Estimates: KSh 850,000 + installation
                      </div>
                    </div>
                  ) : quizAnswers.primaryGoal === 'zero-downtime' ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">Recommended: Vince Hybrid Cloud Continuity Suite</h4>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        To guarantee continuity, we replicate physical server environments instantly to server pools. Prevents blackout disruption losses across office blocks.
                      </p>
                      <div className="text-xs font-bold text-slate-900 border-t border-slate-200/50 pt-2 font-mono">
                        Estimates: KSh 1,200,000 / configuration setup
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">Recommended: Digital Workplace Endpoint Suite</h4>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        To support your remote staff workload, we pre-configure 10 elite business enterprise notebook lines. Includes remote bios-protection, central active-vpn routing, and workspace sync.
                      </p>
                      <div className="text-xs font-bold text-slate-900 border-t border-slate-200/50 pt-2 font-mono">
                        Estimates: KSh 600,000 / 10 workstations bundle
                      </div>
                    </div>
                  )}

                  {/* Key Highlights */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200/60 text-[10px] text-slate-600 space-y-1 inline-block w-full">
                    <span className="text-[8px] font-mono uppercase font-bold text-slate-400 block mb-1">RECOMMENDED WORKSPACE SPEC_MATRIX</span>
                    <div className="grid grid-cols-2 gap-1.5 leading-snug">
                      <div>● Certified KRA OEM lines</div>
                      <div>● Free Kampala Street transport</div>
                      <div>● BIOS-level defensive keys</div>
                      <div>● {quizAnswers.slaNeed === '24-7' ? '24/7 Emergency response' : 'High warranty cover'}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/50 space-y-2">
                  <button
                    onClick={() => {
                      // Instantly populate form with quiz result notes and scroll down
                      const targetSuite = quizAnswers.primaryGoal === 'edge-computing' ? LENOVO_SUITES[0] : quizAnswers.primaryGoal === 'zero-downtime' ? LENOVO_SUITES[2] : LENOVO_SUITES[1];
                      addToCartHelper(targetSuite);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm duration-150 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Suggested Suite to Cart Vault</span>
                  </button>
                  <a
                    href="#consult-form"
                    onClick={() => {
                      const recName = quizAnswers.primaryGoal === 'edge-computing' ? 'Lenovo AI & Edge Suite' : quizAnswers.primaryGoal === 'zero-downtime' ? 'Hybrid Cloud Continuity' : 'Digital Workplace Endpoint Suite';
                      setInquiryForm(prev => ({
                        ...prev,
                        notes: `Interactive Quiz Recommendation request. Goal: ${quizAnswers.primaryGoal}, Industry: ${quizAnswers.industry}, Recommend: ${recName}. Please dispatch consultation quote.`
                      }));
                    }}
                    className="block text-center text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer py-1"
                  >
                    Lock Choice Blueprint and Open Quotation →
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* TAB 4: ENHANCED DIRECTORY ACCORDIONS FILTER */}
      {activeSection === 'directory' && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-display font-extrabold text-slate-900">Explore Unified Directory Catalog</h3>
              <p className="text-xs text-slate-400">Search over 25+ integrated sector classifications, backup schemes, and strategic alliance modules.</p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search directory modules..."
                value={dirSearch}
                onChange={(e) => setDirSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-600 focus:outline-none focus:border-slate-800 focus:bg-white font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {/* Column 1: Solutions by Industry */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-indigo-50">
                <Building className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-black uppercase text-indigo-950 tracking-wider">Solutions By Industry</h4>
              </div>

              {filteredIndustries.length === 0 ? (
                <span className="text-[10px] text-slate-400 block italic">No matching industries</span>
              ) : (
                <ul className="space-y-2 text-[11px] text-slate-600">
                  {filteredIndustries.map((ind, i) => (
                    <li key={i} className="flex items-center gap-2 bg-white/70 hover:bg-white p-2.5 rounded-xl border border-slate-200/50 transition-all font-medium hover:translate-x-1 duration-150">
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Column 2: Other Enterprise Solutions */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-emerald-50">
                <HardDrive className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black uppercase text-emerald-950 tracking-wider">Other Enterprise Solutions</h4>
              </div>

              {filteredOther.length === 0 ? (
                <span className="text-[10px] text-slate-400 block italic">No matching solutions</span>
              ) : (
                <ul className="space-y-2 text-[11px] text-slate-600">
                  {filteredOther.map((oth, i) => (
                    <li key={i} className="flex items-center gap-2 bg-white/70 hover:bg-white p-2.5 rounded-xl border border-slate-200/50 transition-all font-medium hover:translate-x-1 duration-150">
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                      <span>{oth}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Column 3: Strategic Alliance Partners Hub */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-amber-50">
                <Award className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-black uppercase text-amber-940 tracking-wider">OEM License Alliances</h4>
              </div>

              {filteredPartners.length === 0 ? (
                <span className="text-[10px] text-slate-400 block italic">No matching partners</span>
              ) : (
                <ul className="space-y-2 text-[11px] text-slate-600">
                  {filteredPartners.map((part, i) => (
                    <li key={i} className="flex items-center gap-2 bg-white/70 hover:bg-white p-2.5 rounded-xl border border-slate-200/50 transition-all font-medium hover:translate-x-1 duration-150">
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                      <span className="font-semibold text-slate-800">{part}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </section>
      )}

      {/* INTERACTIVE ROI / CAPITAL DEPRECIATION ESTIMATOR */}
      <section className="bg-gradient-to-tr from-slate-50 to-indigo-50/20 border border-indigo-100/40 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-4 space-y-3">
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-indigo-600 block">IT AUDITING CORE</span>
          <h3 className="text-lg font-display font-extrabold text-slate-900 leading-snug">Continuous ROI / Downtime Calculator</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Specify matching workplace endpoint quantities & support packages. Dynamically calculate estimated financial savings and hourly gains.
          </p>
        </div>

        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
          <div className="space-y-4">
            {/* Slider for endpoints */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-bold text-[11px] text-slate-600">
                <span>Active Office Endpoints</span>
                <span className="font-mono text-indigo-600 bg-white/80 border border-slate-100 px-2 py-0.5 rounded shadow-xs">{endpoints} Units</span>
              </div>
              <input
                type="range"
                min={5}
                max={250}
                step={5}
                value={endpoints}
                onChange={(e) => setEndpoints(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Toggle support level */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 block">Support Tier Priority Level</span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'standard', label: 'Std Response' },
                  { id: 'premium', label: 'Premium 24/7' },
                  { id: 'ultimate', label: 'Managed Dedicated' }
                ].map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setSupportLevel(tier.id as any)}
                    className={`py-2 px-1 rounded-lg border text-[10px] font-medium leading-none cursor-pointer text-center ${
                      supportLevel === tier.id
                        ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="bg-white border border-indigo-150/50 p-5 rounded-2xl grid grid-cols-2 gap-4 text-center shadow-xs">
            <div className="space-y-1">
              <span className="block text-lg font-extrabold text-indigo-600 font-mono">KSh {new Intl.NumberFormat('en-KE').format(calculatedITSavings)}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Est. Annual Value</span>
            </div>
            <div className="space-y-1">
              <span className="block text-lg font-extrabold text-emerald-600 font-mono">-{estimatedDowntimeReduction}%</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">Blackout Downtime</span>
            </div>
            <div className="space-y-1 border-t border-slate-50 pt-3 col-span-2">
              <span className="block text-sm font-bold text-slate-800">
                ⭐ Save {estimatedHoursSavedMonthly.toFixed(1)} Tech Hours/Mo
              </span>
              <span className="text-[9px] text-slate-400 block">estimated engineering capacity unlocked</span>
            </div>
          </div>
        </div>
      </section>

      {/* ACCORDION REINFORCING VALUE DIFFERENCE */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1 pb-2">
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-slate-400 block">DIFFERENTIVE COMPARISONS</span>
          <h3 className="text-lg font-display font-extrabold text-slate-900 leading-tight">Why Corporate Entities Lean on Vince Solutions</h3>
          <p className="text-xs text-slate-500">Unpacking the structural gaps between traditional suppliers vs our premium SLA packages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="border border-slate-150 rounded-2xl p-5 space-y-3 bg-slate-50/30">
            <h4 className="text-sm font-bold text-red-700 flex items-center gap-1.5">
              <span>⚠️ Legacy / Direct Importers</span>
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-1">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Unsealed boxes imported without certified Lenovo original global warantees.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Zero technical staff deployment or physical setup on Kampala Street blocks.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Lack of tax invoices or direct KRA VAT compliance filing certificates.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span>Slow, frustrating response times when hardware registers bios failure.</span>
              </li>
            </ul>
          </div>

          <div className="border border-emerald-150 bg-emerald-50/15 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
              <span>✅ Vince Solutions Enterprise Platform</span>
            </h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-1">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Sealed retail notebooks with direct global warranty coverage certificate.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Dedicated Kisumu certified engineers handling routing, VPNs & office active directories.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Structured automated invoice processing and instant compliance records.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Guaranteed &lt;2 hours local physical dispatch SLA when bugs occur.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* EMBEDDED CONSULTATION BLUEPRINT FORM */}
      <section id="consult-form" className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-amber-500 block">SECURE RESERVATIONS</span>
          <h3 className="text-xl font-display font-extrabold text-slate-900">Request Custom Enterprise Consultation Quote</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fill the fields below to dispatch an automated hardware requirement notification directly to our leadership team. We analyze specs and mail back matching configuration blueprints.
          </p>
        </div>

        {inquirySent ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-3 text-xs leading-normal">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              ✓
            </div>
            <h4 className="font-bold text-emerald-950">Inquiry Saved & Transmitted via Active Pipeline!</h4>
            <p className="text-slate-500 max-w-md mx-auto">
              Your specific solutions request was cached locally and dispatch notifications were routed to <strong>okothden99@gmail.com</strong>.
            </p>
            <p className="text-[10px] text-slate-400 italic">Please allow standard security hours response.</p>
          </div>
        ) : (
          <form onSubmit={handleBookConsultation} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 block">Company / Entity Name *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vince Solutions Ltd"
                  value={inquiryForm.companyName}
                  onChange={(e) => setInquiryForm(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:outline-none rounded-xl text-[11px] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 block">Authorized Contact Person *</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Okoth"
                  value={inquiryForm.contactPerson}
                  onChange={(e) => setInquiryForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:outline-none rounded-xl text-[11px] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 block">Corporate Email Address *</span>
                <input
                  type="email"
                  required
                  placeholder="e.g. client@vincesupport.com"
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:outline-none rounded-xl text-[11px] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 block">Telephone Hotline Support *</span>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +254 796 411804"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:outline-none rounded-xl text-[11px] font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 block">Configuration Blueprint Details / Notes</span>
              <textarea
                rows={3}
                required
                value={inquiryForm.notes}
                onChange={(e) => setInquiryForm(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:outline-none rounded-xl text-[11px] font-medium resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all hover:shadow text-xs flex items-center justify-center gap-2 cursor-pointer duration-150 active:scale-98"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Submit Blueprint Inquiry to okothden99@gmail.com</span>
              </button>
              
              <a
                href={`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=okothden99@gmail.com&su=${encodeURIComponent(`[Consultation Inquiry] Vince Solutions - ${inquiryForm.companyName || 'Corporate Client'}`)}&body=${encodeURIComponent(
                  `Hello okothden99,\n\nI want to submit an enterprise consultation inquiry feedback:\n\nCompany Name: ${inquiryForm.companyName}\nContact Person: ${inquiryForm.contactPerson}\nEmail: ${inquiryForm.email}\nPhone: ${inquiryForm.phone}\n\nNotes / Requirements:\n"${inquiryForm.notes}"`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#ea4335]/20 bg-[#ea4335]/5 hover:bg-[#ea4335]/10 text-[#ea4335] font-bold px-4 py-3 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#ea4335]/20 inline-block shrink-0 ring-4 ring-[#ea4335]/10" />
                <span>Open in Gmail Desktop</span>
              </a>
            </div>
          </form>
        )}
      </section>

    </div>
  );
};

// Simple cloud proxy icon replacement
const CloudIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.78-3.5-4-3.5a5.5 5.5 0 0 0-4.38 8.8A3.5 3.5 0 0 0 6.5 19z" />
  </svg>
);
