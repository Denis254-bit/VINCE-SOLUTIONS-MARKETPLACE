import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Cpu, Battery, Monitor, ArrowRight, Zap, Target, Laptop } from 'lucide-react';
import { PRODUCTS_CATALOG } from '../data';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface LaptopsLandingProps {
  onView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const LaptopsLanding: React.FC<LaptopsLandingProps> = ({ onView, onAddToCart }) => {
  const laptops = PRODUCTS_CATALOG.filter(p => p.category === 'laptops');
  const featuredLaptop = laptops.find(l => l.id === 'lap-megabook-16pro') || laptops[0];

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 mt-4 lg:mx-auto max-w-7xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 p-8 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-400 font-mono tracking-widest text-[10px] font-bold uppercase mb-4 block">
              Flagship Processing Power
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black leading-tight mb-6">
              Megabook 16 Pro. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Limitless.
              </span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-md leading-relaxed mb-8">
              Professional-grade powerhouse styled in sleek executive obsidian colorway. Featuring a stunning 2.5K high-refresh panel for absolute CAD, coding and video-editing workflow optimization.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => onView(featuredLaptop)}
                className="bg-white text-slate-950 hover:bg-slate-100 font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 text-sm"
              >
                Configure <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-slate-700 hover:border-slate-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                View All Models
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10 rounded-2xl pointer-events-none" />
            <img 
              src={featuredLaptop.image} 
              alt={featuredLaptop.name}
              className="w-full h-auto object-contain transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out z-0 relative"
            />
            
            {/* Floating Specs */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-8 right-8 z-20 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Cpu className="text-emerald-400 w-4 h-4" />
                  <span className="text-xs font-mono font-bold text-slate-200">i7-13620H</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="text-indigo-400 w-4 h-4" />
                  <span className="text-xs font-mono font-bold text-slate-200">2.5K 120Hz</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento */}
      <section className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700" />
          <Battery className="w-8 h-8 text-amber-500 mb-6" />
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Unplugged Freedom.</h3>
          <p className="text-slate-500 text-sm max-w-sm">
            Experience up to 34 hours of continuous workflow on a single charge with the advanced lithium-polymer architecture of our Megabook series.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-white shadow-xl flex flex-col justify-between">
          <div>
            <Zap className="w-8 h-8 text-cyan-400 mb-6" />
            <h3 className="text-xl font-display font-bold mb-2">Thermal Velocity</h3>
            <p className="text-slate-400 text-xs">
              Dual symmetrical cooling fans keep core temperatures optimal under heavy virtualization.
            </p>
          </div>
          <div className="mt-8 border-t border-slate-800 pt-4 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">ICE COOL PRO</span>
            <Target className="w-4 h-4 text-cyan-500" />
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-indigo-600 font-mono text-[10px] uppercase tracking-widest font-bold mb-1 block">Certified Hardware</span>
            <h2 className="text-3xl font-display font-black text-slate-900">Explore Laptops</h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-200">
            <Laptop className="w-4 h-4" /> {laptops.length} Models Available
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {laptops.map(laptop => (
            <motion.div
              key={laptop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ProductCard 
                product={laptop}
                onView={onView}
                onAddToCart={onAddToCart}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
