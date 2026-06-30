import React from 'react';
import { Product } from '../types';
import { Star, ShieldCheck, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onView: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onView, onAddToCart }) => {
  const isAvailable = product.stockStatus !== 'Available for Order';

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-KE').format(p);
  };

  return (
    <div className="group flex flex-col bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/60 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out transform hover:-translate-y-1.5 hover:border-slate-300/60">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden flex items-center justify-center p-6 bg-slate-50/50">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Rating/Category badge container */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-bold text-slate-900 flex items-center gap-1.5 shadow-sm border border-slate-100">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-6">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-2">
          {product.brand}
        </div>
        <h3 className="font-display font-bold text-lg text-slate-950 line-clamp-1 group-hover:text-amber-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
          {product.description}
        </p>

        {/* Technical Specs Summary */}
        <div className="mt-4 py-2.5 px-4 bg-slate-100/60 rounded-xl text-[11px] font-mono text-slate-600 line-clamp-1 border border-slate-200/50">
          {product.specs}
        </div>

        {/* Bottom actions */}
        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Price</span>
            <span className="text-lg font-extrabold text-slate-950 font-mono tracking-tight">
              KSh {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={() => onView(product)}
            className="flex items-center gap-2 text-xs font-bold text-white bg-slate-950 hover:bg-amber-600 px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
            id={`view-${product.id}`}
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
