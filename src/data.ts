import { Product } from './types';

export const PRODUCTS_CATALOG: Product[] = [
  // LAPTOPS
  {
    id: 'lap-megabook-t14',
    name: 'Megabook T14 Air',
    category: 'laptops',
    price: 68000,
    brand: 'Megabook',
    specs: 'Intel Core i5 · 8GB LPDDR5 · 512GB NVMe SSD · 14" IPS FHD Display · 1.1kg',
    image: 'https://d13pvy8xd75yde.cloudfront.net/global/phones/70906196550152dc2064bae98a5fe037.png',
    description: 'Ultra-lightweight premium laptop engineered for students and remote executives who demand elite speed and pristine screen clarity on the go.',
    features: [
      'Stellar 34-hour battery life capability',
      'Featherlight magnesium-aluminum chassis',
      'Eye-care flicker-free screen certified by TÜV Rheinland',
      'Instant-on fingerprint biometric login security'
    ],
    rating: 4.5,
    reviewsCount: 18,
    stockStatus: 'In Stock',
    customizableOptions: [
      {
        name: 'RAM Upgrade',
        choices: [
          { value: '8GB LPDDR5 (Default)', priceModifier: 0 },
          { value: '16GB LPDDR5 Premium', priceModifier: 6500 }
        ]
      },
      {
        name: 'Storage Upgrade',
        choices: [
          { value: '512GB Gen4 NVMe SSD', priceModifier: 0 },
          { value: '1TB Extreme Performance SSD', priceModifier: 9000 }
        ]
      }
    ]
  },
  {
    id: 'lap-megabook-t1',
    name: 'Megabook T1 15.6',
    category: 'laptops',
    price: 75000,
    brand: 'Megabook',
    specs: 'Intel Core i5-12450H · 16GB RAM · 512GB PCIe SSD · 15.6" IPS 100% sRGB',
    image: 'https://d13pvy8xd75yde.cloudfront.net/global/phones/e149fbbc04c0dcda2e602d2ed6fcb865.webp',
    description: 'The definitive daily-driver workstation built with robust H-series Intel processing power and full-sized numpad for seamless enterprise spreadsheet accounting.',
    features: [
      'H-Series high-voltage processor architecture',
      'Dual active cooling fans to prevent throttling',
      'Premium metal top shell designed to withstand drops',
      'High capacity 70Wh long lifecycle battery pack'
    ],
    rating: 4.7,
    reviewsCount: 24,
    stockStatus: 'In Stock',
    customizableOptions: [
      {
        name: 'Storage Upgrade',
        choices: [
          { value: '512GB NVMe M.2 SSD', priceModifier: 0 },
          { value: '1TB Pro Speed SSD', priceModifier: 8500 }
        ]
      }
    ]
  },
  {
    id: 'lap-megabook-16pro',
    name: 'Megabook 16 Pro',
    category: 'laptops',
    price: 95000,
    brand: 'Megabook',
    specs: 'Intel Core i7-13620H · 16GB RAM · 1TB Gen4 SSD · 16" 2.5K 120Hz Display',
    image: 'https://d13pvy8xd75yde.cloudfront.net/global/phones/8fd2a31d21921f4d0d0a493995a3eaeb.png',
    description: 'Professional-grade powerhouse styled in sleek executive obsidian colorway. Flaunts a stunning 2.5K high-refresh panel for absolute CAD, coding and video-editing workflow optimization.',
    features: [
      'Ultra-crisp 120Hz smooth scrolling refresh rate',
      'Dual USB4 Type-C ports supporting 100W PD charging',
      'Four-speaker surround sound acoustic setup',
      'Premium backlit tactical keyboard'
    ],
    rating: 4.9,
    reviewsCount: 12,
    stockStatus: 'Low Stock',
    customizableOptions: [
      {
        name: 'RAM Upgrade',
        choices: [
          { value: '16GB LPDDR5 Quad-Channel', priceModifier: 0 },
          { value: '32GB Mega-Speed RAM Upgrade', priceModifier: 12000 }
        ]
      }
    ]
  },
  {
    id: 'lap-megabook-t1amd',
    name: 'Megabook T1 14 AMD',
    category: 'laptops',
    price: 62000,
    brand: 'Megabook',
    specs: 'AMD Ryzen 5-5625U · 8GB LPDDR4X · 512GB SSD · Radeon Vega Graphics · Slate Symmetrical',
    image: 'https://d13pvy8xd75yde.cloudfront.net/global/phones/23e057cc51d384abad47d215b5021f6c.png',
    description: 'Energy-conscious Ryzen-powered notebook serving responsive multitasking with superior thermal dissipation. The perfect budget companion for Kisumu small businesses.',
    features: [
      'Whisper-silent fan acoustics in balanced mode',
      'Integrated AMD Radeon graphics for visual rendering',
      'Full function USB-C display and power delivery',
      'Robust metal hinge tested up to 25,000 open/close cycles'
    ],
    rating: 4.4,
    reviewsCount: 31,
    stockStatus: 'In Stock',
    customizableOptions: [
      {
        name: 'RAM Upgrade',
        choices: [
          { value: '8GB Dual Channel', priceModifier: 0 },
          { value: '16GB Performance RAM Upgrade', priceModifier: 5800 }
        ]
      }
    ]
  },
  {
    id: 'lap-megabook-k15',
    name: 'Megabook K15 AMD 7000',
    category: 'laptops',
    price: 82000,
    brand: 'Megabook',
    specs: 'AMD Ryzen 7-7730U · 16GB DDR4 · 512GB PCIe M.2 SSD · 15.6" Anti-Glare FHD Screen',
    image: 'https://d13pvy8xd75yde.cloudfront.net/global/phones/0ff1e3db28d2f9f96079fa26ef4c7d96.webp',
    description: 'Next-generation octa-core processor handling heavy database applications and virtualization with absolute headroom. Finished with tactile ergonomic keys.',
    features: [
      '8 processor cores and 16 compute threads',
      'Military-grade durability certification tests',
      'Advanced Wi-Fi 6E high-speed web card',
      'Webcam physical privacy slider toggle'
    ],
    rating: 4.6,
    reviewsCount: 9,
    stockStatus: 'In Stock'
  },
  {
    id: 'lap-megabook-k15s',
    name: 'Megabook K15S AMD 7000',
    category: 'laptops',
    price: 70000,
    brand: 'Megabook',
    specs: 'AMD Ryzen 5-7520U · 8GB DDR5 · 512GB SSD · 15.6" Borderless NanoEdge Display',
    image: 'https://d13pvy8xd75yde.cloudfront.net/global/phones/708b09ab2041d7113a90f0a80c18e719.png',
    description: 'Streamlined laptop clad in platinum silver styling with ultra-thin screen bezels. Provides pristine media playback and reliable multi-app offices tasks.',
    features: [
      'Latest energy-saving DDR5 system memory',
      'NanoEdge screen delivering 88% visual screen-to-body ratio',
      'Fast charge support (60% battery power in 49 minutes)',
      'Precision precision multi-touch trackpad'
    ],
    rating: 4.5,
    reviewsCount: 22,
    stockStatus: 'Available for Order'
  },

  // DESKTOPS
  {
    id: 'dt-aegis-pro',
    name: 'Aegis Pro — Gaming & Render Tower',
    category: 'desktops',
    price: 120000,
    brand: 'Vince Custom',
    specs: 'Intel Core i7-9700 · 16GB DDR4 · 512GB NVMe SSD · NVIDIA GTX 1660 6GB · High Airflow Case',
    image: 'https://hp.widen.net/content/8xq4kbk4i9/webp/8xq4kbk4i9.png?dpi=72&color=ffffff00&w=270',
    description: 'Engineered for architectural rendering, heavy structural 3D designs, and high-framerate gaming. Built using heavy-duty copper cooling tubes and tempered protective side glasses.',
    features: [
      'RGB liquid cooling unit for optimized thermal headrooms',
      'Certified Intel Core i7 processor capability',
      'Discrete GTX 1660 graphics with dedicated 6GB VRAM',
      'Fully modular 650W Bronze power supply unit'
    ],
    rating: 4.8,
    reviewsCount: 15,
    stockStatus: 'In Stock',
    customizableOptions: [
      {
        name: 'Graphics Upgrade',
        choices: [
          { value: 'NVIDIA GTX 1660 6GB (Default)', priceModifier: 0 },
          { value: 'NVIDIA RTX 3060 12GB Upgrade', priceModifier: 24000 }
        ]
      }
    ]
  },
  {
    id: 'dt-officemax-240',
    name: 'OfficeMax 240 — Business Workstation',
    category: 'desktops',
    price: 45000,
    brand: 'HP',
    specs: 'Intel Core i5-10400 · 8GB DDR4 · 256GB SSD · High Efficiency PSU · Windows 11 Pro',
    image: 'https://hp.widen.net/content/tc3sjy32fc/webp/tc3sjy32fc.png?dpi=72&color=ffffff00&w=270',
    description: 'The ultra-quiet, energy-frugal desk tower built primarily to supply reliable billing, inventory management, and database server operations in fast-paced retail shops.',
    features: [
      'Space-saving microturbine chassis structure',
      'Low energy footprint certified by EnergyStar',
      'Dedicated enterprise gigabit ethernet support',
      'Legacy ports support for point-of-sale receipt thermal printers'
    ],
    rating: 4.5,
    reviewsCount: 63,
    stockStatus: 'In Stock',
    customizableOptions: [
      {
        name: 'Enterprise Package (Intel Active Management)',
        choices: [
          { value: 'Standard Office Spec', priceModifier: 0 },
          { value: 'vPro Bundle (Adds Intel Active Management + extra 8GB RAM)', priceModifier: 7500 }
        ]
      }
    ]
  },
  {
    id: 'dt-creator-x',
    name: 'Creator X — Premium All-in-One PC',
    category: 'desktops',
    price: 180000,
    brand: 'HP OmniStudio',
    specs: '27" FHD Display · Intel Core Ultra 7 · 16GB DDR5 · 1TB SSD · Meteor Silver Stylist',
    image: 'https://hp.widen.net/content/uaozmrtodg/webp/uaozmrtodg.png?dpi=72&color=ffffff00&w=270',
    description: 'Next-generation AI desktop merging PC internals inside a breathtaking borderless 27-inch adjustable stand. Ideal for software agencies, executive suites and visual studios.',
    features: [
      'Breathtaking 27" display with 99% sRGB color gamut',
      'Integrated Intel AI Boost NPU for accelerated AI processing',
      '5MP retractable camera with AI tracking and premium dual array mics',
      'Stunning Dark Wood / Meteor Silver premium executive finish'
    ],
    rating: 4.9,
    reviewsCount: 8,
    stockStatus: 'Available for Order'
  },
  {
    id: 'dt-minipro-s',
    name: 'HP Elite Mini 800 G9 Bundle',
    category: 'desktops',
    price: 65000,
    brand: 'HP',
    specs: 'Intel Core i5 · 16GB RAM · 512GB NVMe SSD · HP Series 3 Pro 23.8" FHD Monitor Included',
    image: 'https://www.hp.com/wcsstore/hpusstore/Banners/bundles/A1VE5UA_Monitor_Kit_573x430.png?imwidth=270&imdensity=1',
    description: 'An immense workstation in a footprint smaller than a book. Clamps cleanly to the back of the included Pro monitor to clear up desk clutter entirely.',
    features: [
      'Miniature physical design perfect for tight counter desks',
      'Crisp 23.8" HP Series 3 Monitor included in bundle box',
      'Active hardware-enforced Wolf Pro Security shielding',
      'Multiple DisplayPort and USB-C display outputs'
    ],
    rating: 4.7,
    reviewsCount: 19,
    stockStatus: 'In Stock'
  },
  {
    id: 'dt-ecowork-500',
    name: 'HP All-in-One 27-cr0015m PC',
    category: 'desktops',
    price: 38000,
    brand: 'HP',
    specs: '27" FHD screen · AMD Ryzen 3 · 8GB DDR4 RAM · 256GB SSD · Jet Black Symmetrical',
    image: 'https://hp.widen.net/content/0d17ksgqlj/webp/0d17ksgqlj.png?dpi=72&color=ffffff00&w=270',
    description: 'Breathtakingly affordable all-in-one desktop workstation, engineered from recycled marine-bound plastics. Built to serve home study and front-desk clinic operations.',
    features: [
      'Immersive micro-edge display stand design',
      'Premium integrated stereo soundbars pointing forward',
      'Pre-installed Windows 11 Home license included',
      'Ergonomic mouse and full keyboard keyboard set'
    ],
    rating: 4.3,
    reviewsCount: 42,
    stockStatus: 'In Stock'
  },
  {
    id: 'dt-workhorse-z',
    name: 'Premium Workhorse Dual-Display PC',
    category: 'desktops',
    price: 95000,
    brand: 'HP',
    specs: 'Intel Core i7 · 16GB RAM · 1TB HDD + 256GB SSD · HP Series 7 Pro 27" QHD Monitor',
    image: 'https://hp.widen.net/content/mr6rxb8teq/webp/mr6rxb8teq.png?dpi=72&color=ffffff00&w=270',
    description: 'Engineered specifically for heavy legal drafting, financial stock tables, and medical diagnostic charting. Features double storage drives and a beautiful QHD screen.',
    features: [
      'Immense Intel Core i7 processor standard power',
      'Vast 1.25TB total combined storage capability',
      'Stunning 27" Studio QHD high density pixel monitor',
      'Factory factory color-calibrated display out'
    ],
    rating: 4.8,
    reviewsCount: 14,
    stockStatus: 'Low Stock'
  },

  // PRINTERS
  {
    id: 'pr-laserjet-1020',
    name: 'HP LaserJet 1020 Monochrome Printer',
    category: 'printers',
    price: 45000,
    brand: 'HP',
    specs: 'Laser tech · Black & White · 14 ppm · USB 2.0 Host · Compact foot',
    image: 'https://hp.widen.net/content/g2nnqwzp2k/webp/g2nnqwzp2k.png?dpi=72&color=ffffff00&w=270',
    description: 'The legendary indestructible monochrome office workhorse. Highly prized for its absolute bulletproof reliability, low cost per page, and long cartridge lifecycle.',
    features: [
      'Famous structural casing resisting high temperatures',
      'High capacity toner cartridge printing up to 2,000 pages',
      'Zero-second warm-up time from energy saving standbys',
      'Compact size fitting snuggly inside drawer structures'
    ],
    rating: 4.9,
    reviewsCount: 104,
    stockStatus: 'In Stock'
  },
  {
    id: 'pr-canon-s520',
    name: 'Canon S520 Professional Photo Inkjet',
    category: 'printers',
    price: 65000,
    brand: 'Canon',
    specs: 'Thermal Inkjet · 4 Individual Ink Tanks · Fine Photo Print · Borderless',
    image: 'https://hp.widen.net/content/dneq9pnrk8/webp/dneq9pnrk8.png?dpi=72&color=ffffff00&w=270',
    description: 'High-fidelity photo and document printer featuring separate color ink tanks to eliminate toner waste. Delivers studio-grade saturated colors and crisp visual charts.',
    features: [
      'Dedicated individual individual ink tanks for cyan, magenta, yellow & black',
      'Fine droplet technology rendering beautiful high density graphics',
      'Dual-tray front sheet feed system',
      'Quiet acoustic-suppression print mechanics'
    ],
    rating: 4.6,
    reviewsCount: 22,
    stockStatus: 'In Stock'
  },
  {
    id: 'pr-epson-c45',
    name: 'Epson Stylus C45 Desktop Printer',
    category: 'printers',
    price: 32000,
    brand: 'Epson',
    specs: 'MicroPiezo Inkjet · 4-Color system · Compact layout · Easy fill',
    image: 'https://hp.widen.net/content/gwhriw4dyn/webp/gwhriw4dyn.png?dpi=72&color=ffffff00&w=270',
    description: 'Highly affordable, space-saving color document and homework printer. Ideal for school study desks, pharmacy receipt prints, and home budget tracking.',
    features: [
      'MicroPiezo cold-press printhead mechanism for permanent lifecycles',
      'Resistant pigment inks protecting text lines from water splatters',
      'USB high-speed interface connectivity',
      'Featherweight minimalist build (2.1kg)'
    ],
    rating: 4.3,
    reviewsCount: 57,
    stockStatus: 'In Stock'
  },
  {
    id: 'pr-laserjet-m558',
    name: 'HP Enterprise M558 Color LaserJet',
    category: 'printers',
    price: 520000,
    brand: 'HP Enterprise',
    specs: 'Color Laser · 45 ppm · Duplex print · Network/Wi-Fi Secure · 650-sheet tray',
    image: 'https://hp.widen.net/content/dplcronj1i/webp/dplcronj1i.png?dpi=72&color=ffffff00&w=270',
    description: 'Enterprise-grade color laser built for massive corporate print queues, high security auditing, and lightning fast double-sided document outputs.',
    features: [
      'Blazing fast speeds printing up to 45 pages per minute in full color',
      'Advanced hardware cybersecurity shielding against network intrusions',
      'Convenient color touch LCD panel for queue controls',
      'High-capacity dual tray holding up to 650 standard cardstocks'
    ],
    rating: 4.8,
    reviewsCount: 7,
    stockStatus: 'In Stock'
  },

  // ENTERPRISE SOLUTIONS (TREAT AS SPECIAL HIGH-VALUE PRODUCTS/SERVICES THAT CAN BE ORDERED OR ADDED TO CART)
  {
    id: 'sol-ai-edge',
    name: 'Lenovo AI & Edge System Suite',
    category: 'solutions',
    price: 850000,
    brand: 'Lenovo / Vince',
    specs: 'Edge-to-Cloud System Hardware Bundle · AI Analytics Software Stack · Installation included',
    image: 'https://p2-ofp.static.pub/ShareResource/ww/img/solutions/solutions-landing-page/solution-ai-edge.jpg',
    description: 'Brings high-speed server intelligence directly to your on-site retail surveillance cameras, factory production rows, or warehouse sensors without cloud latencies.',
    features: [
      'Complete physical edge computer rack unit with Xeon processing',
      'On-device local computer vision and NLP model setup assistance',
      'Secure encrypted routing gateway with zero external leaks',
      'Full physical engineer deployment and installation on Kampala Street Kisumu office command'
    ],
    rating: 4.9,
    reviewsCount: 3,
    stockStatus: 'Available for Order'
  },
  {
    id: 'sol-digitalwork',
    name: 'Digital Workplace Endpoint Suite',
    category: 'solutions',
    price: 600000,
    brand: 'Vince Integrated',
    specs: '10 Secure Hybrid Workstations · Unified Cloud Management Dashboard · 1 Year Endpoint Support',
    image: 'https://p4-ofp.static.pub/ShareResource/ww/img/solutions/solutions-landing-page/solution-digital-workplace.jpg',
    description: 'Deploy a completely pre-configured high-security digital environment for your office team. Includes hardware setups, endpoint antivirus setups, and cloud communication routing.',
    features: [
      '10 customized professional employee laptops preconfigured on delivery',
      'Enterprise Active Directory and unified login accounts setup support',
      'Advanced central VPN routing defending company files from home Wi-Fis',
      '24/7 dedicated IT support hotline managed from Kampala Kampala'
    ],
    rating: 4.7,
    reviewsCount: 5,
    stockStatus: 'In Stock'
  },
  {
    id: 'sol-hybridcloud',
    name: 'Vince Enterprise Hybrid Cloud Continuity',
    category: 'solutions',
    price: 1200000,
    brand: 'Vince Hybrid',
    specs: 'Hybrid server arrays · High speed fiber integration · Automated backup systems',
    image: 'https://p2-ofp.static.pub/ShareResource/ww/img/solutions/solutions-landing-page/solution-hybrid-cloud.jpg',
    description: 'Ensure 99.99% operational continuity. Replicates physical server environments instantly to virtual clouds to dodge any business downtime caused by power blackouts.',
    features: [
      'Local server array configuration + seamless synchronization to cloud instances',
      'Zero-loss disaster recovery protocols tested dynamically',
      'Highly resistant hardware shielding protecting financial databases',
      'Weekly compliance audits delivered directly to leadership emails'
    ],
    rating: 5.0,
    reviewsCount: 4,
    stockStatus: 'Available for Order'
  }
];

export const KENYAN_COUNTIES = [
  'Kisumu (Kampala Street Delivery)',
  'Nairobi',
  'Mombasa',
  'Nakuru',
  'Eldoret',
  'Kakamega',
  'Kisii',
  'Kericho',
  'Homa Bay',
  'Siaya'
];

export const COUPONS: { [code: string]: number } = {
  'WELCOMEV10': 0.10, // 10% off
  'VINCE20': 0.20,     // 20% off
  'MEGACOUNT5': 0.05   // 5% off
};
