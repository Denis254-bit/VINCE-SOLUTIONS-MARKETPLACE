import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Star, CheckCircle, Flame, Server, Monitor, ShieldCheck, ShoppingCart } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedOptions: { [name: string]: string }, extraPrice: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [name: string]: string }>({});
  const [extraPrice, setExtraPrice] = useState(0);

  // Initialize selected defaults
  useEffect(() => {
    if (product.customizableOptions) {
      const initial: { [name: string]: string } = {};
      product.customizableOptions.forEach(opt => {
        if (opt.choices.length > 0) {
          initial[opt.name] = opt.choices[0].value;
        }
      });
      setSelectedOptions(initial);
    } else {
      setSelectedOptions({});
    }
    setQuantity(1);
  }, [product]);

  // Recalculate extra price modifier based on selected customizable choices
  useEffect(() => {
    if (!product.customizableOptions) {
      setExtraPrice(0);
      return;
    }

    let extra = 0;
    product.customizableOptions.forEach(opt => {
      const selectedVal = selectedOptions[opt.name];
      const match = opt.choices.find(c => c.value === selectedVal);
      if (match) {
        extra += match.priceModifier;
      }
    });
    setExtraPrice(extra);
  }, [selectedOptions, product]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedOptions, extraPrice);
    onClose();
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-KE').format(p);
  };

  const basePriceWithExtras = product.price + extraPrice;
  const totalPriceCalculated = basePriceWithExtras * quantity;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full shadow-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Media & Core Highlights */}
        <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col justify-between border-r border-slate-100 overflow-y-auto">
          <div className="flex-1 flex items-center justify-center py-6 min-h-[220px]">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[280px] max-w-full object-contain drop-shadow"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200/60">
            <h4 className="text-xs font-display font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              <span>Core Highlights</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-2">
              {product.features.map((feat, index) => (
                <li key={index} className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Information & Option Selectors */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                {product.brand} Warranty Certified
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                product.stockStatus === 'In Stock'
                  ? 'text-emerald-700 bg-emerald-50'
                  : product.stockStatus === 'Low Stock'
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-blue-700 bg-blue-50'
              }`}>
                {product.stockStatus}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 leading-snug">
              {product.name}
            </h2>

            {/* Ratings Summary */}
            <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-slate-800">{product.rating}</span>
              <span>•</span>
              <span>{product.reviewsCount} enterprise reviews</span>
            </div>

            {/* Price Box */}
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Unit Price</span>
                <span className="text-xl font-bold text-slate-900 font-mono">
                  KSh {formatPrice(basePriceWithExtras)}
                </span>
                {extraPrice > 0 && (
                  <span className="text-[10px] text-emerald-600 font-medium">
                    (Includes customizations: +KSh {formatPrice(extraPrice)})
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Estimate</span>
                <div className="text-xs text-slate-500 font-medium font-mono">Duty & KRA Inclusive</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-4">
              {product.description}
            </p>

            {/* Customizable Options selectors */}
            {product.customizableOptions && product.customizableOptions.length > 0 && (
              <div className="mt-6 space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Configure Custom System Speeds</h4>
                {product.customizableOptions.map((opt) => (
                  <div key={opt.name} className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-500">{opt.name}</label>
                    <div className="grid grid-cols-1 gap-2">
                      {opt.choices.map((choice) => (
                        <button
                          key={choice.value}
                          onClick={() => handleOptionChange(opt.name, choice.value)}
                          className={`flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                            selectedOptions[opt.name] === choice.value
                              ? 'border-amber-600 bg-amber-50/40 text-amber-900'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <span>{choice.value}</span>
                          {choice.priceModifier > 0 && (
                            <span className="text-[11px] font-mono font-bold text-emerald-600">
                              +KSh {formatPrice(choice.priceModifier)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between gap-4">
              {/* Quantity selector */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quantity</span>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/50">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(q => q - 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-all font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-semibold text-slate-800 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 bg-white rounded-lg hover:bg-slate-50 transition-all font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total calculations & Add button */}
              <div className="flex-1 flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Total Price</span>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  KSh {formatPrice(totalPriceCalculated)}
                </span>
                <button
                  onClick={handleAdd}
                  className="mt-2 w-full max-w-[200px] bg-slate-900 hover:bg-amber-600 hover:scale-[1.02] active:scale-[0.98] text-white font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Secure Order Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
