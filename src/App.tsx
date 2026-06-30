import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem, CheckoutInfo, OrderState, Enquiry } from './types';
import { PRODUCTS_CATALOG } from './data';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutWizard } from './components/CheckoutWizard';
import { OrderTracker } from './components/OrderTracker';
import { AIChat } from './components/AIChat';
import WorkspaceHub from './components/WorkspaceHub';
import { BusinessSolutions } from './components/BusinessSolutions';
import { AboutUs } from './components/AboutUs';
import { LaptopsLanding } from './components/LaptopsLanding';
import { DesktopsLanding } from './components/DesktopsLanding';
import { PrintersLanding } from './components/PrintersLanding';
import { initAuth, googleSignIn } from './lib/firebase';
import {
  ShoppingCart,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Laptop,
  Monitor,
  Printer,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  X,
  CreditCard,
  Briefcase,
  Trash2,
  Send,
  Loader,
  Sun,
  Moon,
  Network,
  Mic
} from 'lucide-react';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('vince_theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  // State
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'laptops' | 'desktops' | 'printers' | 'solutions' | 'about' | 'workspace'>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating-desc'>('featured');
  const [priceRange, setPriceRange] = useState<number>(1500000); // 1.5M max constraint

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [activeViewProduct, setActiveViewProduct] = useState<Product | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState<OrderState[]>([]);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [formSent, setFormSent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmClearLogs, setConfirmClearLogs] = useState(false);

  // Voice Search / Web Speech API State
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setSpeechSupported(!!SpeechRecognition);
    } catch (e) {
      console.warn("Speech recognition is not supported in this environment.", e);
    }
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'en-US';
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          const query = transcript.trim().replace(/\.$/, '');
          setSearchQuery(query);
          setToastMessage(`Voice search: "${query}"`);
          setTimeout(() => setToastMessage(null), 3500);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    }
  };

  // Google OAuth states for automatically dispatching invoices
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, cachedToken) => {
        setGoogleUser(currentUser);
        setGoogleToken(cachedToken);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Synchronize Theme class with document head/root and save to local storage
  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('vince_theme', theme);
    } catch (e) {
      console.warn('Unable to persist theme preference', e);
    }
  }, [theme]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('vince_ecommerce_cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedOrders = localStorage.getItem('vince_ecommerce_orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedCoupon = localStorage.getItem('vince_ecommerce_coupon');
      if (storedCoupon) setCouponCode(storedCoupon);

      const storedEnquiries = localStorage.getItem('vince_ecommerce_enquiries');
      if (storedEnquiries) setEnquiries(JSON.parse(storedEnquiries));

      // Parse URL parameters for view setting
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'solutions') {
        setSelectedCategory('solutions');
      } else if (params.get('view') === 'about') {
        setSelectedCategory('about');
      }

      // Check payment status
      if (params.get('payment') === 'success') {
        setTimeout(() => showToast('Payment successful! Your order has been placed securely via Stripe.'), 1000);
        // clean url
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (params.get('payment') === 'cancel') {
        setTimeout(() => showToast('Payment was cancelled. Your recent order is saved locally to try again.'), 1000);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.warn('Unable to load from localStorage cache or parse query params', e);
    }
  }, []);

  // Save to local storage on modifications
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('vince_ecommerce_cart', JSON.stringify(newCart));
    } catch (e) {}
  };

  const saveOrders = (newOrders: OrderState[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('vince_ecommerce_orders', JSON.stringify(newOrders));
    } catch (e) {}
  };

  const saveEnquiries = (newEnquiries: Enquiry[]) => {
    setEnquiries(newEnquiries);
    try {
      localStorage.setItem('vince_ecommerce_enquiries', JSON.stringify(newEnquiries));
    } catch (e) {}
  };

  // Toast dispatch helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Cart Management
  const handleAddToCart = (product: Product, quantity: number, selectedOptions: { [name: string]: string }, extraPrice: number) => {
    const existingIndex = cart.findIndex(item => {
      if (item.product.id !== product.id) return false;
      // Check if selected options are an exact match
      const k1 = Object.keys(item.selectedOptions);
      const k2 = Object.keys(selectedOptions);
      if (k1.length !== k2.length) return false;
      return k1.every(key => item.selectedOptions[key] === selectedOptions[key]);
    });

    const newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        product,
        quantity,
        selectedOptions
      });
    }

    saveCart(newCart);
    showToast(`Added ${quantity}x ${product.name} to security checkout cart!`);
  };

  const handleUpdateQty = (index: number, quantity: number) => {
    const newCart = [...cart];
    newCart[index].quantity = quantity;
    saveCart(newCart);
  };

  const handleRemoveItem = (index: number) => {
    const removedName = cart[index].product.name;
    const newCart = cart.filter((_, i) => i !== index);
    saveCart(newCart);
    showToast(`Removed ${removedName} from cart.`);
  };

  const handleApplyCoupon = (code: string) => {
    setCouponCode(code);
    try {
      localStorage.setItem('vince_ecommerce_coupon', code);
    } catch (e) {}
  };
  
  // Send invoice email notification to the owner & CC client
  const sendInvoiceEmail = async (order: OrderState, authToken: string) => {
    const itemsText = order.items.map(item => {
      let unit = item.product.price;
      if (item.product.customizableOptions) {
        item.product.customizableOptions.forEach(opt => {
          const match = opt.choices.find(c => c.value === item.selectedOptions[opt.name]);
          if (match) unit += match.priceModifier;
        });
      }
      const optionsStr = Object.entries(item.selectedOptions)
        .map(([k, v]) => `  - ${k}: ${v}`)
        .join('\n');
      return `${item.quantity}x ${item.product.name} @ KSh ${new Intl.NumberFormat('en-KE').format(unit)}\n${optionsStr}`;
    }).join('\n\n');

    const paymentDetails = order.info.paymentMethod === 'mpesa' 
      ? `Lipa Na M-PESA\nM-PESA Transaction Code: ${order.info.mpesaCode}`
      : order.info.paymentMethod === 'stripe'
      ? `Stripe Card Payment\nStripe Payment Reference: ${order.info.stripePaymentId || 'Completed via Web Elements'}`
      : `Corporate Bank Wire Transfer\nDetails: Vince Investments Standard Chartered wire`;

    const emailBody = `Dear Vince Investments Team,

An invoice has been filled and is currently being processed.

=== INVOICE DETAILS ===
Invoice/Order Reference: ${order.orderId}
Creation Date: ${order.date}
Status: INVOICE PROCESSING & VERIFICATION

=== CLIENT INFORMATION ===
Full Name / Company: ${order.info.name}
Email Address: ${order.info.email}
Phone Number: ${order.info.phone}
County Location: ${order.info.county}
Street / Office Address: ${order.info.address}

=== ORDERED ITEMS ===
${itemsText}

=== FINANCIAL SUMMARY ===
Subtotal: KSh ${new Intl.NumberFormat('en-KE').format(order.subtotal)}
Discount/Coupon Used: -KSh ${new Intl.NumberFormat('en-KE').format(order.discount)} ${order.couponUsed ? `(${order.couponUsed})` : ''}
KRA VAT (16%): KSh ${new Intl.NumberFormat('en-KE').format(order.vat)}
Shipping / Courier Fee: KSh ${new Intl.NumberFormat('en-KE').format(order.shippingPrice)}
---------------------------------------------
TOTAL PAYABLE: KSh ${new Intl.NumberFormat('en-KE').format(order.total)}

=== PAYMENT VERIFICATION ===
Payment Option: ${paymentDetails}

This invoice notification has been automatically processed and dispatched on behalf of Vince Solutions E-Commerce Core.`;

    const headers = [
      `To: okothden99@gmail.com`,
      `Subject: [Invoice Processing] Vince Solutions - Order ${order.orderId} from ${order.info.name}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
    ];
    if (order.info.email && order.info.email !== 'okothden99@gmail.com') {
      headers.push(`Cc: ${order.info.email}`);
    }

    const emailMimeContent = [
      ...headers,
      '',
      emailBody
    ].join('\r\n');

    const encodedMime = btoa(unescape(encodeURIComponent(emailMimeContent)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: encodedMime })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gmail API failure: ${errText}`);
    }
  };

  // Checkout Google Authentication bridge
  const handleCheckoutGoogleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        showToast(`Authenticated secure session as ${res.user.email}`);
      }
    } catch (err: any) {
      console.error('Google Sign-In failed', err);
      showToast(`Google Authentication failed: ${err.message || err}`);
    }
  };

  // Checkout submission
  const handleCompleteOrder = async (info: CheckoutInfo, shippingPrice: number) => {
    // Math break
    const subtotal = cart.reduce((acc, item) => {
      let price = item.product.price;
      if (item.product.customizableOptions) {
        item.product.customizableOptions.forEach(opt => {
          const match = opt.choices.find(c => c.value === item.selectedOptions[opt.name]);
          if (match) price += match.priceModifier;
        });
      }
      return acc + (price * item.quantity);
    }, 0);

    const discountRate = couponCode === 'WELCOMEV10' ? 0.10 : couponCode === 'VINCE20' ? 0.20 : couponCode === 'MEGACOUNT5' ? 0.05 : 0;
    const discount = subtotal * discountRate;
    const taxable = subtotal - discount;
    const vat = taxable * 0.16;
    const total = taxable + vat + shippingPrice;

    const orderId = `VNC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: OrderState = {
      items: [...cart],
      info,
      orderId,
      subtotal,
      vat,
      discount,
      shippingPrice,
      total,
      status: 'processing_payment',
      couponUsed: couponCode || undefined,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    saveOrders([newOrder, ...orders]);
    saveCart([]); // clear cart
    setCouponCode('');
    try {
      localStorage.removeItem('vince_ecommerce_coupon');
    } catch (e) {}

    setIsCheckoutOpen(false);
    
    // Create Stripe Checkout Session
    try {
      showToast(`Redirecting to secure Stripe Checkout...`);
      const stripeItems = newOrder.items.map(item => ({
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity
      }));
      // Add shipping & VAT as separate items if needed 
      if (shippingPrice > 0) {
        stripeItems.push({
          name: 'Shipping & Fulfillment',
          price: shippingPrice,
          image: '',
          quantity: 1
        });
      }
      
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: stripeItems,
          success_url: window.location.origin + '?payment=success',
          cancel_url: window.location.origin + '?payment=cancel'
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      } else {
        throw new Error(data.error || 'Failed to create Stripe checkout');
      }
    } catch (err: any) {
      console.error('Stripe redirect failed:', err);
      showToast(`Stripe Checkout Error: ${err.message}. Saving order locally.`);
    }

    // Auto-notifications to owner (okothden99@gmail.com)
    if (googleToken) {
      showToast(`Order ${orderId} saved locally. Autodispatching invoice notification...`);
      try {
        await sendInvoiceEmail(newOrder, googleToken);
        showToast(`Invoice metadata for Order ${orderId} dispatched to okothden99@gmail.com via Active Session!`);
      } catch (err: any) {
        console.error('Invoice transmission failed: ', err);
        showToast(`Stored order ${orderId}. Automatic email distribution failed: ${err.message || err}`);
      }
    } else {
      showToast(`Order ${orderId} finalized! Opening invoice receipt secure compose link...`);
      
      const emailSubject = `[Invoice Notification] Vince Solutions - Order ${orderId} from ${info.name}`;
      const itemsText = newOrder.items.map(item => `- ${item.quantity}x ${item.product.name}`).join('\n');
      const emailQueryBody = `Dear Vince Investments Team,\n\nI have filled an invoice that is being processed:\n\nOrder Code: ${orderId}\nCustomer: ${info.name}\nTelephone: ${info.phone}\nCounty: ${info.county}\nStreet Address: ${info.address}\n\nInvoice Total: KSh ${new Intl.NumberFormat('en-KE').format(total)}\nItems Ordered:\n${itemsText}\n\nSent via Vince E-Commerce platform.`;
      
      const gmailComposerUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=okothden99@gmail.com&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailQueryBody)}`;
      
      try {
        window.open(gmailComposerUrl, '_blank');
      } catch (e) {
        console.warn('Popup window blocked by sandbox environment iframe policy', e);
      }
    }
    
    // Auto scroll down to tracker line
    setTimeout(() => {
      const el = document.getElementById('tracking-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 450);
  };

  // Simulated state upgrades (Processing -> Shipped -> Out for delivery -> Delivered)
  const handleProgressSimulation = (orderId: string) => {
    const updated = orders.map(or => {
      if (or.orderId !== orderId) return or;

      let nextStatus: OrderState['status'] = or.status;
      if (or.status === 'processing_payment') nextStatus = 'processing';
      else if (or.status === 'processing') nextStatus = 'shipped';
      else if (or.status === 'shipped') nextStatus = 'out_for_delivery';
      else if (or.status === 'out_for_delivery') nextStatus = 'delivered';

      return {
        ...or,
        status: nextStatus
      };
    });

    saveOrders(updated);
    showToast(`Simulating logisitic dispatch workflow updates for ${orderId}!`);
  };

  const handleClearOrders = () => {
    saveOrders([]);
    showToast('Cleared order history cached data.');
  };

  // Filter Catalog
  const filteredCatalog = PRODUCTS_CATALOG.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.specs.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= priceRange;

    return matchesCategory && matchesQuery && matchesPrice;
  }).sort((a, b) => {
    if (sortOption === 'price-asc') return a.price - b.price;
    if (sortOption === 'price-desc') return b.price - a.price;
    if (sortOption === 'rating-desc') return b.rating - a.rating;
    return 0; // featured
  });

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-KE').format(p);
  };

  // Simple Contact form handling with immediate feedback representation
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill out all fields first!');
      return;
    }

    const newEnquiry: Enquiry = {
      id: `ENQ-${Math.floor(10000 + Math.random() * 90000)}`,
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const newEnquiriesList = [newEnquiry, ...enquiries];
    saveEnquiries(newEnquiriesList);
    setFormSent(true);

    const subject = `Enterprise Consultation Request - ${contactForm.name}`;
    const body = `Hello Vince Investments Team,\n\nI want to submit an enterprise consultation inquiry feedback/message:\n\nName: ${contactForm.name}\nEmail: ${contactForm.email}\nDate: ${newEnquiry.date}\n\nSubmission Details / Feedback:\n"${contactForm.message}"\n\nSent via Vince Investments System (Reseller: okothden99@gmail.com).`;
    const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=okothden99@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Try automatic popup (will gracefully fallback if browser blocks popups)
    try {
      window.open(gmailUrl, '_blank');
    } catch (err) {
      console.warn('Iframe blocked automatic popup, manual action cards available below.');
    }

    showToast(`Inquiry ${newEnquiry.id} Connected! Open Gmail below to send.`);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus('submitting');
    try {
      // Mock an API call to endpoint `/api/newsletter/subscribe`
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Persist subscriber locally
      const subscribers = JSON.parse(localStorage.getItem('vince_newsletter_subscribers') || '[]');
      if (!subscribers.includes(newsletterEmail)) {
        subscribers.push(newsletterEmail);
        localStorage.setItem('vince_newsletter_subscribers', JSON.stringify(subscribers));
      }
      
      setNewsletterStatus('success');
      showToast('Successfully registered to our enterprise bulletin!');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterStatus('error');
      showToast('An error occurred during newsletter registration.');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-[#fafaf9] to-slate-100 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden transition-all">
      
      {/* Aesthetic Architectural Background Grid & Ambient Aurora Blooms */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Subtle high-tech grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_15%,#000_60%,transparent_100%)]" />
        
        {/* Ambient Top Light Beam Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-50" />
        
        {/* Aurora Bloom 1: Deep Indigo Glow on Upper Left */}
        <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-indigo-200/25 to-purple-100/10 blur-[130px] animate-pulse" style={{ animationDuration: '14s' }} />

        {/* Aurora Bloom 2: Warm Amber Accent on Middle Right */}
        <div className="absolute top-[25%] right-[-15%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-bl from-amber-100/30 to-yellow-50/10 blur-[110px]" />

        {/* Aurora Bloom 3: Refreshing Teal/Emerald Accent towards Lower Center/Left */}
        <div className="absolute bottom-[15%] left-[-5%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-tr from-emerald-100/15 to-teal-50/10 blur-[140px] animate-pulse" style={{ animationDuration: '20s' }} />

        {/* Diagonal Soft Laser Lines for Depth */}
        <svg className="absolute top-10 left-0 w-full h-[800px] opacity-[0.035] text-slate-800 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line x1="-10%" y1="10%" x2="110%" y2="90%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 12" />
          <line x1="-10%" y1="30%" x2="110%" y2="110%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 12" />
        </svg>
      </div>

      {/* Dynamic Toast Alert Bubble overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 max-w-sm flex items-center gap-3 animate-slide-in">
          <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0">
            ✓
          </div>
          <p className="text-xs font-semibold leading-snug">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-auto">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar info rail */}
      <div className="bg-slate-950 text-slate-400 text-[11px] py-2 px-margin-desktop border-b border-slate-900">
        <div className="max-w-max-width mx-auto flex flex-col md:flex-row justify-between items-center gap-2 px-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <MapPin className="w-3 h-3 text-amber-500" />
              <span>Kampala Street, Kisumu Office branch</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>Mon - Fri: 8:00 AM - 6:00 PM (EAT)</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-semibold">● Live Support Desk Online</span>
            <a href="tel:+254796411804" className="hover:text-amber-400 transition-colors">
              +254 796 411 804
            </a>
          </div>
        </div>
      </div>

      {/* Primary Header Area */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <nav className="max-w-max-width mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-amber-500 shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-black block leading-none">Vince solutions</span>
              <span className="text-base font-display font-black text-slate-900 tracking-tight">E-Commerce Hub</span>
            </div>
          </div>

          {/* Navigation Links Row */}
          <div className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-50 p-1 rounded-xl border border-slate-200/40">
            <button 
              onClick={() => setSelectedCategory('all')} 
              className={`px-3 py-2 rounded-lg leading-none transition-all text-left font-bold cursor-pointer ${selectedCategory === 'all' ? 'bg-slate-950 text-white shadow-sm' : 'hover:bg-white hover:text-slate-950 hover:shadow-sm'}`}
            >
              Hardware Store
            </button>
            <button 
              onClick={() => setSelectedCategory('laptops')} 
              className={`px-3 py-2 rounded-lg leading-none transition-all text-left font-bold cursor-pointer ${selectedCategory === 'laptops' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-white hover:text-slate-950 hover:shadow-sm'}`}
            >
              Laptops
            </button>
            <button 
              onClick={() => setSelectedCategory('desktops')} 
              className={`px-3 py-2 rounded-lg leading-none transition-all text-left font-bold cursor-pointer ${selectedCategory === 'desktops' ? 'bg-purple-600 text-white shadow-sm' : 'hover:bg-white hover:text-slate-950 hover:shadow-sm'}`}
            >
              Desktops
            </button>
            <button 
              onClick={() => setSelectedCategory('printers')} 
              className={`px-3 py-2 rounded-lg leading-none transition-all text-left font-bold cursor-pointer ${selectedCategory === 'printers' ? 'bg-cyan-600 text-white shadow-sm' : 'hover:bg-white hover:text-slate-950 hover:shadow-sm'}`}
            >
              Printers
            </button>
            <button 
              onClick={() => setSelectedCategory('solutions')} 
              className={`px-3 py-2 rounded-lg leading-none transition-all text-left font-bold cursor-pointer ${selectedCategory === 'solutions' ? 'bg-indigo-650 text-white shadow-sm' : 'hover:bg-white hover:text-slate-950 hover:shadow-sm'}`}
            >
              Business Solutions
            </button>
            <button 
              onClick={() => setSelectedCategory('workspace')} 
              className={`px-3 py-2 rounded-lg leading-none transition-all text-left font-bold cursor-pointer ${selectedCategory === 'workspace' ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-white hover:text-slate-950 hover:shadow-sm'}`}
            >
              Enterprise Console
            </button>
            <button 
              onClick={() => setSelectedCategory('about')} 
              className={`px-3 py-2 rounded-lg leading-none transition-all text-left font-bold cursor-pointer ${selectedCategory === 'about' ? 'bg-indigo-650 text-white shadow-sm' : 'hover:bg-white hover:text-slate-950 hover:shadow-sm'}`}
            >
              About Us
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Elegant Mode Toggle Switch */}
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title={theme === 'light' ? 'Switch to Eye-Safe Space Dark Mode' : 'Switch to Natural Light Mode'}
              id="theme-toggle-btn"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700 hover:text-indigo-600 duration-150" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500 hover:rotate-45 duration-150" />
              )}
            </button>

            {/* Shopping bags shortcut */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              title="View your Shopping Vault"
              id="open-cart-btn"
            >
              <ShoppingCart className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold font-mono">
                {cart.reduce((s, h) => s + h.quantity, 0)}
              </span>
              <span className="hidden sm:inline bg-slate-900 text-white text-[10px] uppercase font-bold py-0.5 px-2 rounded-md">
                KSh {formatPrice(
                  cart.reduce((acc, h) => {
                    let cost = h.product.price;
                    if (h.product.customizableOptions) {
                      h.product.customizableOptions.forEach(op => {
                        const m = op.choices.find(c => c.value === h.selectedOptions[op.name]);
                        if (m) cost += m.priceModifier;
                      });
                    }
                    return acc + (cost * h.quantity);
                  }, 0)
                )}
              </span>
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        
        {/* Mobile-Friendly Sub-Pages Navigation Bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none border-b border-slate-100">
          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest shrink-0 mr-1 bg-slate-100 py-1 px-2 rounded-md">Pages:</span>
          <button 
            onClick={() => setSelectedCategory('all')} 
            className={`px-3.5 py-1.5 text-[11px] font-bold rounded-xl shrink-0 shadow-sm leading-none cursor-pointer ${selectedCategory === 'all' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Store
          </button>
          <button 
            onClick={() => setSelectedCategory('laptops')} 
            className={`px-3.5 py-1.5 text-[11px] font-bold rounded-xl shrink-0 shadow-sm leading-none cursor-pointer ${selectedCategory === 'laptops' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Laptops
          </button>
          <button 
            onClick={() => setSelectedCategory('desktops')} 
            className={`px-3.5 py-1.5 text-[11px] font-bold rounded-xl shrink-0 shadow-sm leading-none cursor-pointer ${selectedCategory === 'desktops' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Desktops
          </button>
          <button 
            onClick={() => setSelectedCategory('printers')} 
            className={`px-3.5 py-1.5 text-[11px] font-bold rounded-xl shrink-0 shadow-sm leading-none cursor-pointer ${selectedCategory === 'printers' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Printers
          </button>
          <button 
            onClick={() => setSelectedCategory('solutions')} 
            className={`px-3.5 py-1.5 text-[11px] font-bold rounded-xl shrink-0 shadow-sm leading-none cursor-pointer ${selectedCategory === 'solutions' ? 'bg-indigo-650 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Solutions
          </button>
          <button 
            onClick={() => setSelectedCategory('workspace')} 
            className={`px-3.5 py-1.5 text-[11px] font-bold rounded-xl shrink-0 shadow-sm leading-none cursor-pointer ${selectedCategory === 'workspace' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Console
          </button>
          <button 
            onClick={() => setSelectedCategory('about')} 
            className={`px-3.5 py-1.5 text-[11px] font-bold rounded-xl shrink-0 shadow-sm leading-none cursor-pointer ${selectedCategory === 'about' ? 'bg-indigo-650 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            About Us
          </button>
        </div>
        
        {/* Master Bento Grid Wrapper */}
        {selectedCategory === 'solutions' ? (
          <BusinessSolutions 
            onAddProductToCart={handleAddToCart}
            onNavigateToInvoice={() => setIsCheckoutOpen(true)}
          />
        ) : selectedCategory === 'laptops' ? (
          <LaptopsLanding 
            onView={(item) => setActiveViewProduct(item)}
            onAddToCart={(item) => handleAddToCart(item, 1, {}, 0)}
          />
        ) : selectedCategory === 'desktops' ? (
          <DesktopsLanding 
            onView={(item) => setActiveViewProduct(item)}
            onAddToCart={(item) => handleAddToCart(item, 1, {}, 0)}
          />
        ) : selectedCategory === 'printers' ? (
          <PrintersLanding 
            onView={(item) => setActiveViewProduct(item)}
            onAddToCart={(item) => handleAddToCart(item, 1, {}, 0)}
          />
        ) : selectedCategory === 'about' ? (
          <AboutUs 
            onContactSubmit={(name, email, message) => {
              const newEnquiry: Enquiry = {
                id: `ENQ-${Math.floor(10000 + Math.random() * 90000)}`,
                name,
                email,
                message,
                date: new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              };
              const newEnquiriesList = [newEnquiry, ...enquiries];
              saveEnquiries(newEnquiriesList);
            }}
            onShowToast={showToast}
            onNavigateToHardware={() => setSelectedCategory('all')}
          />
        ) : selectedCategory === 'workspace' ? (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl">
              <h3 className="text-lg font-display font-extrabold text-slate-900 uppercase tracking-wider">
                Enterprise Cloud Console Hub
              </h3>
              <p className="text-[11px] text-slate-500">Manage corporate appointments, synchronized Google spreadsheets, proposals, email logs, and file structures directly via secure endpoints.</p>
            </div>
            <WorkspaceHub />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          
          {/* Card 1: HERO SHOWCASE (lg:col-span-3 md:col-span-2) */}
          <section className="lg:col-span-3 md:col-span-2 relative rounded-3xl overflow-hidden bg-black text-white p-8 md:p-16 shadow-2xl flex flex-col justify-center min-h-[450px] group">
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-0 z-0 opacity-60 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="relative z-10 space-y-8 max-w-2xl">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white/70 px-4 py-1.5 border border-white/20 rounded-full inline-block">
                Beyond Performance
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-[1] text-white">
                HARDWARE <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">POWERHOUSES</span>
              </h1>
              <p className="text-sm md:text-lg text-slate-300 leading-relaxed max-w-lg font-light tracking-wide">
                Engineered for those who demand uncompromising power and precision. Experience the intersection of enterprise-grade reliability and extreme performance.
              </p>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.1em] hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            </div>
          </section>

          {/* Card 2: ACTIVE PROMO COUPON VAULT (lg:col-span-1 md:col-span-2) */}
          <section className="lg:col-span-1 md:col-span-2 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md flex flex-col justify-between min-h-[300px]">
            <div>
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-amber-500 block mb-1">PROMO DISCOUNTS</span>
              <h3 className="text-lg font-display font-bold text-white tracking-tight">Active Coupon Vault</h3>
              <p className="text-[10px] text-slate-400 mt-1">Click a code below to instantly apply savings to your cart order.</p>
            </div>
            
            <div className="space-y-2 my-4">
              {[
                { code: 'WELCOMEV10', desc: '10% Warehouse Discount', val: '10% OFF' },
                { code: 'VINCE20', desc: '254 Executive Premium', val: '20% OFF' },
                { code: 'MEGACOUNT5', desc: 'Retail Tech Accessory', val: '5% OFF' }
              ].map(coupon => {
                const isActive = couponCode === coupon.code;
                return (
                  <button
                    key={coupon.code}
                    onClick={() => {
                      handleApplyCoupon(coupon.code);
                      showToast(`Savings Coupon ${coupon.code} Applied!`);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs font-mono group cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 scale-[1.01]'
                        : 'bg-slate-950/60 border-slate-850 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="block text-[10px] font-bold text-white tracking-wide">{coupon.code}</span>
                      <span className="block text-[9px] text-slate-500 leading-none mt-0.5">{coupon.desc}</span>
                    </div>
                    <span className="text-amber-500 text-[10px] font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-md group-hover:scale-105 transition-transform shrink-0">
                      {coupon.val}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-[9px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-3">
              <span>Limit: One/Order</span>
              <span className="text-emerald-400 font-semibold">● Verified Secure</span>
            </div>
          </section>

          {/* Card 3: SIDEBAR PRODUCT CLASSIFICATION (lg:col-span-1 md:col-span-1) */}
          <aside className="lg:col-span-1 md:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[350px]">
            <div>
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-indigo-600 block mb-1">CLASSIFICATIONS</span>
              <h3 className="text-lg font-display font-bold text-slate-800 tracking-tight">Hardware Lines</h3>
              <p className="text-[10px] text-slate-400 mt-1">Select an active category slot to filter the catalog stream.</p>
            </div>

            <div className="flex flex-col gap-2 my-4">
              {[
                { id: 'all', label: 'All Catalog', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
                { id: 'laptops', label: 'Laptops', icon: Laptop, color: 'text-blue-600 bg-blue-50' },
                { id: 'desktops', label: 'Desktops', icon: Monitor, color: 'text-emerald-600 bg-emerald-55' },
                { id: 'printers', label: 'Printers & Supplies', icon: Printer, color: 'text-rose-600 bg-rose-50' },
                { id: 'solutions', label: 'IT Solutions', icon: Briefcase, color: 'text-violet-600 bg-violet-50' }
              ].map(tab => {
                const TabIcon = tab.icon;
                const isActive = selectedCategory === tab.id;
                const count = tab.id === 'all' 
                  ? PRODUCTS_CATALOG.length 
                  : PRODUCTS_CATALOG.filter(p => p.category === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id as any)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-[1.01]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg ${isActive ? 'bg-white/15 text-white' : tab.color}`}>
                        <TabIcon className="w-3.5 h-3.5" />
                      </span>
                      <span>{tab.label}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200/50 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-[9px] text-slate-400 font-semibold border-t border-slate-100 pt-3">
              KRA VAT Registered Supplier
            </div>
          </aside>

          {/* Card 4: INTEGRATED CONTROL DECK (lg:col-span-3 md:col-span-1) */}
          <section className="lg:col-span-3 md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between gap-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-4 space-y-1">
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-emerald-600 block">SYSTEM CALIBRATION</span>
                <h3 className="text-base font-display font-bold text-slate-800">Search & Control Deck</h3>
                <p className="text-[10px] text-slate-400 leading-snug">Calibrate structural search keywords, budget limits, and catalog sorting fields.</p>
              </div>

              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end text-xs">
                {/* Search Keywords */}
                <div className="sm:col-span-4 relative">
                  <span className="text-[10px] font-semibold text-slate-500 block mb-1">Search Keywords</span>
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      placeholder="Specs, brands, name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-[11px] focus:outline-none focus:border-slate-800 focus:bg-white transition-all font-medium"
                    />
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`absolute right-2 p-1.5 rounded-lg transition-all flex items-center justify-center outline-none cursor-pointer ${
                          isListening
                            ? 'bg-rose-500 text-white animate-pulse shadow-sm shadow-rose-500/35'
                            : 'hover:bg-slate-200/80 text-slate-400 hover:text-slate-700'
                        }`}
                        title={isListening ? 'Stop listening' : 'Find products by speaking'}
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {isListening && (
                    <div className="absolute -bottom-5 left-0 text-[9px] text-rose-500 font-mono flex items-center gap-1.5 font-bold animate-pulse">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                      Listening... Speak product name/brand
                    </div>
                  )}
                </div>

                {/* Price constraint range slider */}
                <div className="sm:col-span-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 block">Max Unit Budget</span>
                    <span className="font-mono font-bold text-slate-700 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                      KSh {formatPrice(priceRange)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={20000}
                      max={1500000}
                      step={10000}
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full accent-slate-900 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Sorting Select Option */}
                <div className="sm:col-span-3">
                  <span className="text-[10px] font-semibold text-slate-500 block mb-1">Sort Hierarchy</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[11px] font-medium focus:outline-none focus:border-slate-800 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="featured">Featured Catalog</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highly Rated Units</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom active filters summaries */}
            <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Selected Filters:</span>
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold">
                  Cat: {selectedCategory}
                </span>
                {searchQuery && (
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold max-w-[120px] truncate">
                    Search: "{searchQuery}"
                  </span>
                )}
                <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold">
                  Price &le; KSh {formatPrice(priceRange)}
                </span>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange(1500000);
                }}
                className="text-amber-600 hover:text-amber-700 font-bold hover:underline py-0.5 px-2 text-[10px]"
              >
                Reset All Filters
              </button>
            </div>
          </section>

          {/* Row 3: 4 SMALL STATS CORE CELLS (lg:col-span-1 md:col-span-1 each) */}
          {/* Stat Cell 1: Stock */}
          <div className="lg:col-span-1 md:col-span-1 p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition-transform">
              <Laptop className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-amber-650 block leading-none font-bold">SYSTEM INVENTORY</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1 leading-none">Certified Stock</h4>
              <span className="text-[9px] text-slate-400 block mt-1">Laptops & Desk Systems</span>
            </div>
          </div>

          {/* Stat Cell 2: Prints */}
          <div className="lg:col-span-1 md:col-span-1 p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
              <Printer className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-indigo-655 block leading-none font-bold">INDESTRUCTIBLE</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1 leading-none">LaserJet Printers</h4>
              <span className="text-[9px] text-slate-400 block mt-1">Authorized Toner Supplies</span>
            </div>
          </div>

          {/* Stat Cell 3: Security */}
          <div className="lg:col-span-1 md:col-span-1 p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-emerald-650 block leading-none font-bold">WOLF SECURITY</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1 leading-none">Endpoint Cover</h4>
              <span className="text-[9px] text-slate-400 block mt-1">1-Year Corporate Shielding</span>
            </div>
          </div>

          {/* Stat Cell 4: Lipa Na M-PESA */}
          <div className="lg:col-span-1 md:col-span-1 p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-blue-650 block leading-none font-bold">INTEGRATED PAYMENT</span>
              <h4 className="text-xs font-bold text-slate-800 mt-1 leading-none">Lipa Na M-PESA</h4>
              <span className="text-[9px] text-slate-400 block mt-1">Instant Settle & Checkout</span>
            </div>
          </div>

          {/* Row 4: THE HARDWARE CATALOG GRID (lg:col-span-4 md:col-span-2) */}
          <section className="lg:col-span-4 md:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-slate-900 rounded-full inline-block"></span>
                <h3 className="text-lg font-display font-black text-slate-900 capitalize">
                  {selectedCategory === 'all' ? 'Hardware Catalog Grid' : `${selectedCategory} catalog slot`}
                </h3>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-full font-bold leading-none">
                  {filteredCatalog.length} active unit{filteredCatalog.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            {filteredCatalog.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Search className="w-6 h-6 stroke-1" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">No items match your filters</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed mx-auto">
                  Try widening your unit max price constraint, choosing alternative classification tags, or resetting keywords query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange(1500000);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Reset Active Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCatalog.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onView={(item) => setActiveViewProduct(item)}
                    onAddToCart={(item) => handleAddToCart(item, 1, {}, 0)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Row 4.5: WORKSPACE GOOGLE CALENDAR & GMAIL CONSULTATION HUB (lg:col-span-4 md:col-span-2) */}
          <div className="lg:col-span-4 md:col-span-2">
            <WorkspaceHub />
          </div>

          {/* Row 5: ORDER TRACKER SECTION (lg:col-span-4 md:col-span-2) */}
          <div id="tracking-anchor" className="lg:col-span-4 md:col-span-2" />
          {orders.length > 0 && (
            <div className="lg:col-span-4 md:col-span-2">
              <OrderTracker
                orders={orders}
                onProgressSimulation={handleProgressSimulation}
                onClearOrders={handleClearOrders}
              />
            </div>
          )}

          {/* Row 6, Cell 1: TESTIMONIALS & TRUST SEGMENT (lg:col-span-2 md:col-span-2) */}
          <section className="lg:col-span-2 md:col-span-2 bg-[#f8fafc] rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-slate-200/85 shadow-sm space-y-6">
            <div className="space-y-3">
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-indigo-600 block">CLIENT TRUST AGENCY</span>
              <h3 className="text-lg font-display font-black text-slate-900 leading-tight">Strategic Regional Partner</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vince Investments and Solutions Limited bridges high-performance hardware supply lines and enterprise-grade tech consultation. Operating out of our physical office on Kampala Street Kisumu, we guide client networks securely.
              </p>
              
              <div className="flex gap-6 pt-2">
                <div>
                  <span className="text-2xl font-bold font-mono text-slate-900">500+</span>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase leading-none mt-1">Active Clients</span>
                </div>
                <div className="border-r border-slate-200" />
                <div>
                  <span className="text-2xl font-bold font-mono text-slate-900">98%</span>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase leading-none mt-1">SLA SLA Delivery</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-slate-450 block border-t border-slate-200/60 pt-4">Direct Client Feedbacks</span>
              
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-1">
                  <p className="text-slate-600 leading-normal text-[11px] italic">
                    "The customized cash checkout laptops and indestructible HP LaserJet systems drastically improved our branch billing pace."
                  </p>
                  <span className="text-[9px] text-slate-400 font-semibold block text-right">— Store Manager, Kisumu Hub</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-1">
                  <p className="text-slate-600 leading-normal text-[11px] italic">
                    "Managed the absolute hybrid VPN deployment for our Kisumu staff members flawlessly. True architectural mastery!"
                  </p>
                  <span className="text-[9px] text-slate-400 font-semibold block text-right">— E-Commerce Director</span>
                </div>
              </div>
            </div>
          </section>

          {/* Row 6, Cell 2: INTERACTIVE INQUIRIES & HUB PROFILE (lg:col-span-2 md:col-span-2) */}
          <section className="lg:col-span-2 md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/85 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-amber-600 block">KAMPALA STREET OFFICE</span>
              <h3 className="font-display font-extrabold text-slate-900 text-lg leading-tight">Vince Office Block</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Visit our Kisumu city branch office to consult with certified infrastructure engineers, inspect terminal units, or settle commercial vendor invoices.
              </p>

              <div className="space-y-3.5 text-xs text-slate-600 font-medium">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 text-[11px] block">Physical Address</span>
                    <span className="text-[11px] text-slate-500">Kampala Street, Kisumu, Nyanza Province, Kenya</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 text-[11px] block">Direct Hotline</span>
                    <span className="text-[11px] text-slate-500">+254 796 411 804</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 text-[11px] block">Email Inbox</span>
                    <span className="text-[11px] text-[#2563eb] font-semibold">okothden99@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive consultation ticker */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 flex flex-col justify-between space-y-4">
              <h4 className="font-bold text-slate-800 text-xs mb-0.5">Enterprise Consultation Ticket</h4>
              
              {formSent ? (
                <div className="flex-1 flex flex-col justify-between space-y-4 animate-fade-in text-xs">
                  <div className="text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                    <h5 className="font-bold text-slate-900 text-xs leading-none">Inquiry Connected!</h5>
                    <p className="text-[10px] text-slate-500 max-w-[210px] leading-relaxed mx-auto mt-1">
                      Your inquiry has been stored. To submit immediately to <strong>okothden99@gmail.com</strong> or view logs, click below:
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <a
                      href={`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=okothden99@gmail.com&su=${encodeURIComponent(
                        `Enterprise Consultation Request - ${enquiries[0]?.name || ''}`
                      )}&body=${encodeURIComponent(
                        `Hello okothden99,\n\nI want to submit an enterprise consultation inquiry feedback/message:\n\nName: ${enquiries[0]?.name || ''}\nEmail: ${enquiries[0]?.email || ''}\n\nClient Message:\n"${enquiries[0]?.message || ''}"\n\nSent via Vince Investments System.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#ea4335] hover:bg-[#d93025] text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98] duration-150 cursor-pointer text-center"
                    >
                      <svg className="w-4 h-4 shrink-0 fill-white" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <span>Compose & Send with Gmail</span>
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setContactForm({ name: '', email: '', message: '' });
                      setFormSent(false);
                    }}
                    className="text-amber-600 hover:text-amber-700 text-[10px] font-bold underline transition-all text-center self-center"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3 text-xs flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Your Name *"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-1/2 p-2 bg-white border border-slate-200 focus:border-slate-800 focus:outline-none rounded-xl text-[11px] font-medium"
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-1/2 p-2 bg-white border border-slate-200 focus:border-slate-800 focus:outline-none rounded-xl text-[11px] font-medium"
                      />
                    </div>
                    <textarea
                      placeholder="Describe your corporate hardware or IT needs..."
                      rows={2}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full p-2 bg-white border border-slate-200 focus:border-slate-800 focus:outline-none rounded-xl text-[11px] font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl transition-all hover:shadow text-[11px] mt-1.5 cursor-pointer"
                  >
                    Submit Inquiry Message
                  </button>
                </form>
              )}
            </div>

            {/* Local Stored Enquiries History */}
            {enquiries.length > 0 && (
              <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl space-y-3 text-xs leading-normal">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-slate-500 block">ENQUIRY TRANSMISSION LOGS ({enquiries.length})</span>
                  <button
                    onClick={() => {
                      if (confirmClearLogs) {
                        saveEnquiries([]);
                        showToast('Cleared stored inquiry feedback list logs.');
                        setConfirmClearLogs(false);
                      } else {
                        setConfirmClearLogs(true);
                        setTimeout(() => setConfirmClearLogs(false), 4000);
                      }
                    }}
                    className={`text-[10px] border font-bold px-2.5 py-1 rounded-lg transition-all transform hover:scale-[1.04] active:scale-[0.96] duration-150 shadow-xs flex items-center gap-1 cursor-pointer ${
                      confirmClearLogs
                        ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                        : 'text-rose-600 bg-rose-50/70 hover:bg-rose-100 border-rose-100/60'
                    }`}
                  >
                    <Trash2 className={`w-3 h-3 shrink-0 ${confirmClearLogs ? 'text-white' : 'text-rose-500'}`} />
                    <span>{confirmClearLogs ? 'Confirm Clear?' : 'Clear Logs'}</span>
                  </button>
                </div>

                <div className="max-h-[140px] overflow-y-auto pr-1 space-y-2">
                  {enquiries.map((enq) => (
                    <div key={enq.id} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-800 truncate max-w-[120px]">{enq.name}</span>
                        <span className="text-[8px] font-mono text-slate-400">{enq.date}</span>
                      </div>
                      <p className="text-slate-500 leading-normal text-[10px] italic">
                        "{enq.message}"
                      </p>
                      
                      <div className="flex items-center justify-between border-t border-slate-50 pt-1.5 mt-1.5 text-[9px]">
                        <span className="text-slate-400 truncate max-w-[90px]">{enq.email}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=okothden99@gmail.com&su=${encodeURIComponent(`Enterprise Consultation Request - ${enq.name}`)}&body=${encodeURIComponent(
                              `Hello okothden99,\n\nRe-submitting enquiry feedback from ${enq.name}:\n\nInquiry ID: ${enq.id}\nEmail: ${enq.email}\nDate: ${enq.date}\n\nClient Message:\n"${enq.message}"`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ea4335] hover:underline font-bold text-[9px]"
                          >
                            Gmail Compose
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

        </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 md:px-8 mt-24 border-t border-slate-900 text-xs leading-normal">
        {/* 'Stay Updated' Newsletter Signup Block */}
        <div className="max-w-max-width mx-auto border-b border-slate-900 pb-10 mb-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-lg">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2 font-display tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Stay Updated with Vince Bulletins</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Register now for hardware restocking schedules, corporate discount allocations, and manufacturers warranty policy releases. Directly simulated through real local state structures database.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2 max-w-md">
            {newsletterStatus === 'success' ? (
              <div className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 py-2.5 px-4 rounded-xl text-[11px] text-center w-full animate-fade-in font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Subscribed! Check local storage for registry verification records.</span>
              </div>
            ) : (
              <div className="relative w-full sm:min-w-[280px]">
                <input
                  type="email"
                  required
                  disabled={newsletterStatus === 'submitting'}
                  placeholder="e.g. administrator@firm.co.ke"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-350 placeholder:text-slate-600 outline-none focus:border-slate-750 focus:bg-slate-900 duration-150 disabled:opacity-60"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            )}

            {newsletterStatus !== 'success' && (
              <button
                type="submit"
                disabled={newsletterStatus === 'submitting'}
                className="w-full sm:w-auto whitespace-nowrap bg-white hover:bg-slate-100 disabled:bg-slate-200 text-slate-950 disabled:text-slate-500 font-extrabold text-xs px-5 py-3 rounded-xl cursor-pointer shadow duration-150 transform hover:scale-102 active:scale-98 flex items-center justify-center gap-2 shrink-0"
              >
                {newsletterStatus === 'submitting' ? (
                  <>
                    <Loader className="w-3.5 h-3.5 animate-spin text-slate-500" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </form>
        </div>

        <div className="max-w-max-width mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-white font-bold leading-none">Vince Investments & Solutions Premium</h3>
            <p className="text-[11px] text-slate-500">
              Corporate systems supply, endpoint licensing operations, remote IT administration setups and hardware leasing options across East Africa.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Product Catalog Categories</h4>
            <ul className="space-y-2 text-[11px] text-slate-500">
              <li><button onClick={() => setSelectedCategory('laptops')} className="hover:text-amber-400 transition-colors">Performance Laptops</button></li>
              <li><button onClick={() => setSelectedCategory('desktops')} className="hover:text-amber-400 transition-colors">Business Desktops</button></li>
              <li><button onClick={() => setSelectedCategory('printers')} className="hover:text-amber-400 transition-colors">Monochrome & LaserJet Prints</button></li>
              <li><button onClick={() => setSelectedCategory('solutions')} className="hover:text-amber-400 transition-colors">Enterprise Solution Racks</button></li>
              <li><button onClick={() => setSelectedCategory('about')} className="text-indigo-400 hover:text-[#fbbf24] transition-colors font-bold">About Vince Hub</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Legal & Compliances</h4>
            <ul className="space-y-2 text-[11px] text-slate-500">
              <li><span className="block">Licensed HP & Lenovo Authorized Reseller</span></li>
              <li><span className="block">KRA VAT Compliance Verified</span></li>
              <li><span className="block">Standard Warranty coverage protected</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Vince Investments</h4>
            <p className="text-[11px] text-slate-500">
              Kampala Street, Kisumu office Block<br />
              Nyanza Province, Kenya<br />
              Email: okothden99@gmail.com<br />
              Tel: +254 796 411 804
            </p>
          </div>
        </div>

        <div className="max-w-max-width mx-auto text-center text-[10px] text-slate-600 border-t border-slate-900 mt-12 pt-6">
          © 2026 Vince Investments and Solutions Limited. All rights reserved. Registered KRA VAT reseller.
        </div>
      </footer>

      {/* INTERACTIVE COMPONENT MODALS DIALOGS */}
      {/* Product Options Modal */}
      <ProductDetailModal
        product={activeViewProduct}
        onClose={() => setActiveViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Slider Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        couponCode={couponCode}
        onApplyCoupon={handleApplyCoupon}
        onStartCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* checkout form multi-step pipeline */}
      <CheckoutWizard
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        couponCode={couponCode}
        subtotal={cart.reduce((acc, item) => {
          let price = item.product.price;
          if (item.product.customizableOptions) {
            item.product.customizableOptions.forEach(opt => {
              const match = opt.choices.find(c => c.value === item.selectedOptions[opt.name]);
              if (match) price += match.priceModifier;
            });
          }
          return acc + (price * item.quantity);
        }, 0)}
        discountAmount={
          cart.reduce((acc, item) => {
            let price = item.product.price;
            if (item.product.customizableOptions) {
              item.product.customizableOptions.forEach(opt => {
                const match = opt.choices.find(c => c.value === item.selectedOptions[opt.name]);
                if (match) price += match.priceModifier;
              });
            }
            return acc + (price * item.quantity);
          }, 0) * (COUPONS[couponCode] || 0)
        }
        vatAmount={
          (cart.reduce((acc, item) => {
            let price = item.product.price;
            if (item.product.customizableOptions) {
              item.product.customizableOptions.forEach(opt => {
                const match = opt.choices.find(c => c.value === item.selectedOptions[opt.name]);
                if (match) price += match.priceModifier;
              });
            }
            return acc + (price * item.quantity);
          }, 0) - (cart.reduce((acc, item) => {
            let price = item.product.price;
            if (item.product.customizableOptions) {
              item.product.customizableOptions.forEach(opt => {
                const match = opt.choices.find(c => c.value === item.selectedOptions[opt.name]);
                if (match) price += match.priceModifier;
              });
            }
            return acc + (price * item.quantity);
          }, 0) * (COUPONS[couponCode] || 0))) * 0.16
        }
        onCompleteOrder={handleCompleteOrder}
        googleUser={googleUser}
        onGoogleSignIn={handleCheckoutGoogleSignIn}
      />
      <AIChat />
    </div>
  );
}

// Simple lookup for promo codes
const COUPONS: { [code: string]: number } = {
  'WELCOMEV10': 0.10,
  'VINCE20': 0.20,
  'MEGACOUNT5': 0.05
};
