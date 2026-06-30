import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Tag, Ticket, Plus, Minus, ArrowRight, CornerDownRight } from 'lucide-react';
import { COUPONS } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  couponCode: string;
  onApplyCoupon: (code: string) => void;
  onStartCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  couponCode,
  onApplyCoupon,
  onStartCheckout
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponErr, setCouponErr] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-KE').format(p);
  };

  // Math totals
  const subtotal = cartItems.reduce((acc, item) => {
    // base product price + chosen option sum
    let price = item.product.price;
    if (item.product.customizableOptions) {
      item.product.customizableOptions.forEach(opt => {
        const val = item.selectedOptions[opt.name];
        const match = opt.choices.find(c => c.value === val);
        if (match) price += match.priceModifier;
      });
    }
    return acc + (price * item.quantity);
  }, 0);

  const discountRate = COUPONS[couponCode.toUpperCase()] || 0;
  const discountAmount = subtotal * discountRate;
  const taxableAmount = subtotal - discountAmount;
  const vatAmount = taxableAmount * 0.16;
  const finalTotal = taxableAmount + vatAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponErr('');
    setCouponSuccess('');
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponErr('Please input a valid coupon code.');
      return;
    }

    if (COUPONS[code] !== undefined) {
      onApplyCoupon(code);
      setCouponSuccess(`Success! Code ${code} applied representing ${(COUPONS[code] * 100)}% off.`);
    } else {
      setCouponErr('Invalid promo code. Try standard code WELCOMEV10 or VINCE20!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white flex flex-col justify-between shadow-2xl overflow-hidden animate-slide-in">
          {/* Header */}
          <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold font-display uppercase tracking-widest text-amber-500">Secure Vault Cart</span>
              <span className="bg-slate-800 text-xs text-amber-400 font-bold px-2 py-0.5 rounded-full font-mono">
                {cartItems.reduce((acc, h) => acc + h.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1"
            >
              <span>Keep Browsing</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Ticket className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  No products added yet. Head to Laptops, Desktops or Printers to choose system hardware!
                </p>
                <button
                  onClick={onClose}
                  className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors"
                >
                  Browse Hardware Now
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => {
                let itemUnitPrice = item.product.price;
                if (item.product.customizableOptions) {
                  item.product.customizableOptions.forEach(opt => {
                    const chosen = item.selectedOptions[opt.name];
                    const match = opt.choices.find(c => c.value === chosen);
                    if (match) itemUnitPrice += match.priceModifier;
                  });
                }
                const itemTotalPrice = itemUnitPrice * item.quantity;

                return (
                  <div key={index} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 relative group transition-all hover:bg-slate-50/80">
                    <div className="w-20 h-16 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-2 shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.product.name}</h4>
                        {/* Selected customizations */}
                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                            <CornerDownRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            <span className="font-medium">{key}:</span>
                            <span className="text-slate-700 font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/40">
                        {/* Quantity adjustor */}
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                          <button
                            disabled={item.quantity <= 1}
                            onClick={() => onUpdateQty(index, item.quantity - 1)}
                            className="p-1 px-1.5 bg-slate-50 border border-slate-100 rounded hover:bg-slate-100 text-[10px] font-bold disabled:opacity-40"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-bold font-mono px-1.5 text-slate-700">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(index, item.quantity + 1)}
                            className="p-1 px-1.5 bg-slate-50 border border-slate-100 rounded hover:bg-slate-100 text-[10px] font-bold"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <span className="text-xs font-bold font-mono text-slate-800">
                          KSh {formatPrice(itemTotalPrice)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(index)}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Subtotals & Checkout */}
          {cartItems.length > 0 && (
            <div className="bg-slate-50 p-6 border-t border-slate-200 shadow-[0_-8px_24px_rgba(0,0,0,0.03)] space-y-4">
              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="PROMO CODE (e.g. WELCOMEV10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-white pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold uppercase tracking-wider placeholder-slate-400 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
                >
                  Apply
                </button>
              </form>

              {couponErr && <p className="text-[10px] font-semibold text-red-600">{couponErr}</p>}
              {couponSuccess && <p className="text-[10px] font-semibold text-emerald-600">{couponSuccess}</p>}

              {/* Subtotal structure */}
              <div className="space-y-2 border-b border-slate-200/60 pb-3 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Hardware Subtotal</span>
                  <span className="font-semibold font-mono text-slate-800">KSh {formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount ({couponCode})</span>
                    <span className="font-mono">-KSh {formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>KRA Value Added Tax (VAT 16%)</span>
                  <span className="font-semibold font-mono text-slate-800">KSh {formatPrice(vatAmount)}</span>
                </div>
                <div className="text-[9px] text-slate-400 leading-none">
                  * Shipping fees computed securely at checkout validation.
                </div>
              </div>

              {/* Secure checkout buttons */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-800">Estimate Total Due</span>
                  <span className="text-lg font-bold font-mono text-slate-950">KSh {formatPrice(finalTotal)}</span>
                </div>

                <button
                  onClick={onStartCheckout}
                  className="w-full bg-slate-950 hover:bg-amber-600 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.01] transition-all"
                >
                  <span>Verify Shipping & Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
