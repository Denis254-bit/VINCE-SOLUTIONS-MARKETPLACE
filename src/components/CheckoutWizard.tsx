import React, { useState, useEffect } from 'react';
import { CartItem, CheckoutInfo } from '../types';
import { X, ArrowLeft, ArrowRight, CheckCircle, MapPin, Truck, ShieldCheck, Ticket, Landmark, QrCode, CreditCard, Lock, RefreshCw, Sparkles } from 'lucide-react';
import { KENYAN_COUNTIES } from '../data';

interface CheckoutWizardProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  couponCode: string;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  onCompleteOrder: (info: CheckoutInfo, shippingPrice: number) => void;
  googleUser: any;
  onGoogleSignIn: () => Promise<void>;
}

export const CheckoutWizard: React.FC<CheckoutWizardProps> = ({
  isOpen,
  onClose,
  cartItems,
  couponCode,
  subtotal,
  discountAmount,
  vatAmount,
  onCompleteOrder,
  googleUser,
  onGoogleSignIn
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CheckoutInfo>({
    name: '',
    email: '',
    phone: '',
    county: KENYAN_COUNTIES[0],
    address: '',
    shippingMethod: 'standard',
    paymentMethod: 'mpesa',
    mpesaCode: ''
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Stripe Credit Card payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardPostal, setCardPostal] = useState('');
  
  // Real-time payment gateway simulation stages
  const [stripeLoading, setStripeLoading] = useState(false);
  const [stripeStep, setStripeStep] = useState(0);
  const [stripeStepText, setStripeStepText] = useState('');

  // Stripe Link Secure Account simulation states
  const [stripeLinkEmail, setStripeLinkEmail] = useState('');
  const [stripeLinkOtpSent, setStripeLinkOtpSent] = useState(false);
  const [stripeLinkOtpCode, setStripeLinkOtpCode] = useState('');
  const [isStripeLinkLoggedIn, setIsStripeLinkLoggedIn] = useState(false);
  const [isStripeLinkLoggingIn, setIsStripeLinkLoggingIn] = useState(false);
  const [stripeLinkError, setStripeLinkError] = useState('');
  const [stripeLinkUserEmail, setStripeLinkUserEmail] = useState('');

  // Pre-populate user details from active Google session
  useEffect(() => {
    if (googleUser) {
      setForm(f => ({
        ...f,
        name: f.name || googleUser.displayName || '',
        email: f.email || googleUser.email || ''
      }));
    }
  }, [googleUser]);

  const handleSendStripeLinkOtp = () => {
    if (!stripeLinkEmail || !stripeLinkEmail.includes('@')) {
      setStripeLinkError('Please enter a valid email address.');
      return;
    }
    setStripeLinkError('');
    setIsStripeLinkLoggingIn(true);
    setTimeout(() => {
      setIsStripeLinkLoggingIn(false);
      setStripeLinkOtpSent(true);
    }, 1200);
  };

  const handleVerifyStripeLinkOtp = () => {
    const cleanOtp = stripeLinkOtpCode.replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      setStripeLinkError('Please enter a valid 6-digit verification code.');
      return;
    }
    setStripeLinkError('');
    setIsStripeLinkLoggingIn(true);
    setTimeout(() => {
      setIsStripeLinkLoggingIn(false);
      setIsStripeLinkLoggedIn(true);
      setStripeLinkUserEmail(stripeLinkEmail);
      setForm(f => ({
        ...f,
        name: f.name || stripeLinkEmail.split('@')[0],
        email: f.email || stripeLinkEmail
      }));
    }, 1000);
  };

  const handleStripeLinkDisconnect = () => {
    setIsStripeLinkLoggedIn(false);
    setStripeLinkOtpSent(false);
    setStripeLinkOtpCode('');
    setStripeLinkUserEmail('');
  };

  const validateLuhn = (num: string) => {
    const clean = num.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    for (let i = clean.length - 1; i >= 0; i--) {
      let digit = parseInt(clean.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0 && clean.length >= 15;
  };

  const getCardBrand = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'Amex';
    if (/^6(?:011|5)/.test(clean)) return 'Discover';
    return '';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const limited = value.slice(0, 16);
    const parts = [];
    for (let i = 0; i < limited.length; i += 4) {
      parts.push(limited.slice(i, i + 4));
    }
    setCardNumber(parts.join(' '));
    if (formErrors.stripeCard) {
      setFormErrors(prev => ({ ...prev, stripeCard: '' }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
    if (formErrors.stripeExpiry) {
      setFormErrors(prev => ({ ...prev, stripeExpiry: '' }));
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(value);
    if (formErrors.stripeCvc) {
      setFormErrors(prev => ({ ...prev, stripeCvc: '' }));
    }
  };

  const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardPostal(e.target.value);
    if (formErrors.stripePostal) {
      setFormErrors(prev => ({ ...prev, stripePostal: '' }));
    }
  };

  const handleTestCardAutofill = (number: string) => {
    setCardNumber(number.match(/.{1,4}/g)?.join(' ') || number);
    setCardExpiry('12/29');
    setCardCvc('123');
    setCardPostal('00100');
    setFormErrors(prev => ({
      ...prev,
      stripeCard: '',
      stripeExpiry: '',
      stripeCvc: '',
      stripePostal: ''
    }));
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-KE').format(p);
  };

  const getShippingCost = () => {
    if (form.shippingMethod === 'pickup') return 0;
    if (form.shippingMethod === 'express') return 1200;
    return 400; // standard
  };

  const finalTotal = subtotal - discountAmount + vatAmount + getShippingCost();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name.trim()) errs.name = 'Full Name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid Email Address is required.';
    if (!form.phone.trim() || form.phone.trim().length < 8) errs.phone = 'Valid Phone Number is required.';
    if (!form.address.trim()) errs.address = 'Street / Office address is required.';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: { [key: string]: string } = {};
    if (form.paymentMethod === 'mpesa') {
      if (!form.mpesaCode || form.mpesaCode.trim().length < 8) {
        errs.mpesaCode = 'M-PESA transaction reference code is required (e.g., REQD87H9SF).';
      }
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 3) {
      if (!validateStep3()) return;
    }
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    setStep(s => s - 1);
  };

  const handleSubmit = () => {
    // If Stripe is selected, just use the parent's actual Stripe Checkout redirect logic
    if (form.paymentMethod === 'stripe') {
      onCompleteOrder(form, getShippingCost());
      return;
    } else {
      onCompleteOrder(form, getShippingCost());
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {stripeLoading && (
          <div className="absolute inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-fade-in text-white rounded-2xl">
            <div className="bg-gradient-to-tr from-indigo-500 to-amber-500 p-4 rounded-full animate-spin mb-4 shadow-xl">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-extrabold font-display tracking-tight text-white uppercase flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span>Stripe Secured Payment Gateway</span>
            </h3>
            <p className="text-xs text-indigo-400 mt-2 font-semibold tracking-wide uppercase font-mono animate-pulse">
              {stripeStepText}
            </p>
            
            <div className="w-64 bg-slate-800 h-2 rounded-full overflow-hidden mt-6 border border-slate-700">
              <div 
                className="bg-indigo-500 h-full transition-all duration-500 ease-out" 
                style={{ width: `${stripeStep * 25}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-widest">
              Stage {stripeStep} of 4: Encryption Status Active
            </div>
          </div>
        )}
        
        {/* Left column - order summary panel */}
        <div className="w-full md:w-5/12 bg-slate-50 p-6 border-r border-slate-100 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-1.5 mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Checkout Order Check</span>
            </div>

            <h3 className="font-display font-bold text-slate-800 text-sm border-b border-slate-200/60 pb-2">Hardware Items</h3>
            <div className="space-y-3 mt-4 max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item, index) => {
                let unit = item.product.price;
                if (item.product.customizableOptions) {
                  item.product.customizableOptions.forEach(opt => {
                    const match = opt.choices.find(c => c.value === item.selectedOptions[opt.name]);
                    if (match) unit += match.priceModifier;
                  });
                }
                return (
                  <div key={index} className="flex justify-between items-start text-xs border-b border-dashed border-slate-100 pb-2">
                    <div className="flex-1 pr-2">
                      <span className="font-bold text-slate-700 font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded mr-1">
                        {item.quantity}x
                      </span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{item.product.name}</span>
                      {Object.entries(item.selectedOptions).map(([k, v]) => (
                        <div key={k} className="text-[9px] text-slate-400">{k}: {v}</div>
                      ))}
                    </div>
                    <span className="font-semibold font-mono text-slate-700">KSh {formatPrice(unit * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono text-slate-700">KSh {formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Deduction ({couponCode})</span>
                <span className="font-mono">-KSh {formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>KRA VAT (16%)</span>
              <span className="font-mono text-slate-700">KSh {formatPrice(vatAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping Fee</span>
              <span className="font-mono text-slate-700">KSh {formatPrice(getShippingCost())}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2 shrink-0">
              <span>Total Payable</span>
              <span className="font-mono">KSh {formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

        {/* Right column - Steps form wizard */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          {/* Header & step progress indicators */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-display font-semibold uppercase tracking-widest text-amber-600">
                Step {step} of 4: {step === 1 ? 'Contact Details' : step === 2 ? 'Shipping Method' : step === 3 ? 'Secured Payment' : 'Final Verification'}
              </span>
              <button onClick={onClose} className="p-1 px-2 text-slate-400 hover:text-slate-900 text-xs border border-slate-200 rounded-lg">
                Cancel
              </button>
            </div>

            {/* Stepper bar graphic */}
            <div className="flex gap-1.5 mb-6">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    s <= step ? 'bg-amber-600' : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>

            {/* STEP 1: CONTACT DETAILS */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Delivery Address details</span>
                </h4>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-600">Full Name / Corporate Entity *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Vincent Onyango / Vince Investment Ltd"
                    className="w-full p-2.5 border border-slate-200 focus:border-slate-800 rounded-xl focus:outline-none"
                  />
                  {formErrors.name && <span className="text-[10px] font-bold text-red-600">{formErrors.name}</span>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-600">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="okothden99@gmail.com"
                      className="w-full p-2.5 border border-slate-200 focus:border-slate-800 rounded-xl focus:outline-none"
                    />
                    {formErrors.email && <span className="text-[10px] font-bold text-red-600">{formErrors.email}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-600">Recipient Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="+254 796 411 804"
                      className="w-full p-2.5 border border-slate-200 focus:border-slate-800 rounded-xl focus:outline-none"
                    />
                    {formErrors.phone && <span className="text-[10px] font-bold text-red-600">{formErrors.phone}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-600">Location County (Kenya) *</label>
                    <select
                      name="county"
                      value={form.county}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-slate-200 bg-white focus:border-slate-800 rounded-xl focus:outline-none"
                    >
                      {KENYAN_COUNTIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-slate-600">Street Address / Office Building *</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Kampala Street, Kisumu Office Block B"
                      className="w-full p-2.5 border border-slate-200 focus:border-slate-800 rounded-xl focus:outline-none"
                    />
                    {formErrors.address && <span className="text-[10px] font-bold text-red-600">{formErrors.address}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING CHOICE */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Truck className="w-4 h-4 text-indigo-500" />
                  <span>Choose Your Delivery Priority</span>
                </h4>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setForm(f => ({ ...f, shippingMethod: 'standard' }))}
                    className={`w-full flex items-center justify-between text-left p-3.5 rounded-xl border transition-all ${
                      form.shippingMethod === 'standard'
                        ? 'border-indigo-600 bg-indigo-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs">Standard Moto Delivery</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">Reliable dispatch in 3-5 business days across selected counties.</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900">KSh 400</span>
                  </button>

                  <button
                    onClick={() => setForm(f => ({ ...f, shippingMethod: 'express' }))}
                    className={`w-full flex items-center justify-between text-left p-3.5 rounded-xl border transition-all ${
                      form.shippingMethod === 'express'
                        ? 'border-indigo-600 bg-indigo-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs">Express Next-Day courier</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">Next morning prime delivery with full real-time order status tracking.</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900">KSh 1,200</span>
                  </button>

                  <button
                    onClick={() => setForm(f => ({ ...f, shippingMethod: 'pickup' }))}
                    className={`w-full flex items-center justify-between text-left p-3.5 rounded-xl border transition-all ${
                      form.shippingMethod === 'pickup'
                        ? 'border-indigo-600 bg-indigo-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs">Physical Pickup at Kisumu Office</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">Pick up same-day at Kampala Street, Kisumu office. 8am - 6pm.</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900">FREE</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SECURE PAYMENT */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in text-xs">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Landmark className="w-4 h-4 text-emerald-500" />
                  <span>Choose Secured Secure Payment</span>
                </h4>
 
                {/* Secure Payment Mode Toggles */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, paymentMethod: 'mpesa' }))}
                    className={`py-2 px-1 rounded-xl border font-bold text-[10px] md:text-xs flex flex-col md:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      form.paymentMethod === 'mpesa'
                        ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    <span>Lipa Na M-PESA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, paymentMethod: 'stripe' }))}
                    className={`py-2 px-1 rounded-xl border font-bold text-[10px] md:text-xs flex flex-col md:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      form.paymentMethod === 'stripe'
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                    <span>Secure Stripe Card</span>
                  </button>
 
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, paymentMethod: 'bank' }))}
                    className={`py-2 px-1 rounded-xl border font-bold text-[10px] md:text-xs flex flex-col md:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      form.paymentMethod === 'bank'
                        ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span>Bank Transfer</span>
                  </button>
                </div>
 
                {form.paymentMethod === 'mpesa' && (
                  <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-3">
                    <h5 className="font-bold text-emerald-950">M-PESA Instructions</h5>
                    <ol className="text-[10px] text-emerald-800 list-decimal pl-4 space-y-1 leading-snug">
                      <li>Go to your M-PESA Menu on your phone</li>
                      <li>Select <strong>Lipa Na M-PESA</strong></li>
                      <li>Select Buy Goods - Enter Till Number: <strong>796411</strong> (Vince Investments)</li>
                      <li>Enter Amount representing the calculated total: <strong>KSh {formatPrice(finalTotal)}</strong></li>
                      <li>Enter PIN your phone PIN to confirm. Fill below with the transaction reference ID</li>
                    </ol>
 
                    <div className="flex flex-col gap-1.5 pt-2">
                       <label className="font-semibold text-slate-700">Enter Received M-PESA Code *</label>
                      <input
                        type="text"
                        name="mpesaCode"
                        value={form.mpesaCode}
                        onChange={handleInputChange}
                        maxLength={10}
                        placeholder="e.g. REQD87H9SF"
                        className="w-full p-2 border border-slate-200 focus:border-slate-800 rounded-lg placeholder-slate-400 font-mono text-xs uppercase"
                      />
                      {formErrors.mpesaCode && <span className="text-[10px] font-bold text-red-600">{formErrors.mpesaCode}</span>}
                    </div>
                  </div>
                )}

                 {form.paymentMethod === 'stripe' && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
                    {/* Checkout Sessions note */}
                    <div className="bg-white p-6 border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-sm text-center">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm">Secure Stripe Gateway</h5>
                        <p className="text-[11px] text-slate-500 max-w-sm mt-1">
                          Proceed to safely complete this transaction via Stripe Checkout Sessions. Your encrypted credentials will be handled securely.
                        </p>
                      </div>
                    </div>
                  </div>
                 )}

                {form.paymentMethod === 'bank' && (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                    <h5 className="font-bold text-slate-800">Secure Corporate Bank Wire Details</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Please deposit the order total to the following bank details. Upon submission, an invoice will be dispatched to your email for verification.
                    </p>
                    <div className="bg-white p-2.5 rounded-lg font-mono text-[11px] text-slate-700 space-y-1 border border-slate-200">
                      <div>Bank Name: Standard Chartered Bank Premium</div>
                      <div>Branch name: Kisumu Branch Premium</div>
                      <div>Account Holder: Vince Investments Ltd</div>
                      <div>Account Number: 0102 7964 11804</div>
                    </div>
                    <p className="text-[10px] text-amber-700 font-semibold italic">
                      * System shifts dispatch processing immediately after validation callback!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: FINAL CHECK SUMMARY */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in text-xs leading-normal">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Review & Complete Order dispatch</span>
                </h4>

                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                  <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-200/40">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Contact Recipient</span>
                      <strong className="text-slate-800">{form.name}</strong>
                      <div className="text-slate-500">{form.phone}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Target Address</span>
                      <strong className="text-slate-800">{form.county}</strong>
                      <div className="text-slate-500 line-clamp-1">{form.address}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Shipping Priority</span>
                      <strong className="text-slate-800">
                        {form.shippingMethod === 'pickup'
                          ? 'Office Pickup Kisumu'
                          : form.shippingMethod === 'express'
                          ? 'Express Next-Day Courier'
                          : 'Standard Moto Delivery'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Method of Payment</span>
                      <strong className="text-slate-800 uppercase text-[11px]">
                        {form.paymentMethod === 'mpesa' 
                          ? `M-PESA Code: ${form.mpesaCode}` 
                          : form.paymentMethod === 'stripe'
                          ? `Stripe Secure Checkout`
                          : 'Bank Wire Transfer info'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/40 border border-amber-200/50 text-amber-900 rounded-xl">
                  <p className="text-[10px] leading-relaxed">
                    By confirming this order, you authorize Vince Solutions to process delivery. A receipt invoice breakdown is automatically stored in local caches with active Order Trackers!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Wizard Controls */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all"
              >
                <span>Authorize & Complete order</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
