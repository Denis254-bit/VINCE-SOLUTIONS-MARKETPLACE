import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Cpu, Monitor, Zap, Shield, Server, ArrowRight, HelpCircle } from 'lucide-react';
import { PRODUCTS_CATALOG } from '../data';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface DesktopsLandingProps {
  onView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const DesktopsLanding: React.FC<DesktopsLandingProps> = ({ onView, onAddToCart }) => {
  const desktops = PRODUCTS_CATALOG.filter(p => p.category === 'desktops');
  const featuredDesktop = desktops.find(d => d.id === 'dt-creator-x') || desktops[0];

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 mt-4 lg:mx-auto max-w-7xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-purple-900/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 p-8 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-purple-400 font-mono tracking-widest text-[10px] font-bold uppercase mb-4 block">
              Enterprise Grade AI Desktops
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black leading-tight mb-6 text-white tracking-tight">
              Creator X. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                Ultra Power.
              </span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-md leading-relaxed mb-8">
              Step into the future of spatial workspaces with a stunning 27-inch bezel-less adjustable display, powered by Intel Core Ultra 7 and hardware-level AI Boost NPUs.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => onView(featuredDesktop)}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 text-sm"
              >
                Configure System <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => document.getElementById('desktop-catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-slate-700 hover:border-slate-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Browse All Desktops
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80 z-10 rounded-2xl pointer-events-none" />
            <img 
              src={featuredDesktop.image} 
              alt={featuredDesktop.name}
              className="w-full max-h-[380px] object-contain transition-all duration-700 ease-out z-0 relative hover:scale-105"
            />
            
            {/* Overlay spec pill */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute top-4 right-4 z-20 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-xl"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Cpu className="text-purple-400 w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-bold text-slate-300">Intel Core Ultra 7 (AI Boost)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="text-pink-400 w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-bold text-slate-300">27" 100% sRGB Borderless</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700" />
          <Server className="w-8 h-8 text-purple-600 mb-6" />
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Designed for Relentless Workloads.</h3>
          <p className="text-slate-500 text-sm max-w-md">
            Our custom desktop lineup is tailored with ultra-quiet active ventilation, multiple expansion slots, and high-efficiency power supplies built to withstand continuous 24/7 business database operation.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-indigo-950 p-8 rounded-3xl border border-indigo-900 text-white shadow-xl flex flex-col justify-between">
          <div>
            <Shield className="w-8 h-8 text-purple-400 mb-6" />
            <h3 className="text-xl font-display font-bold mb-2">Wolf Pro Shield</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Standard hardware-enforced protection shields your core database files and point-of-sale logs from external network attacks.
            </p>
          </div>
          <div className="mt-8 border-t border-purple-800 pt-4 flex items-center justify-between">
            <span className="text-xs font-mono text-purple-300">SECURE SHELL HARDWARE</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section id="desktop-catalog" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
          <div>
            <span className="text-indigo-600 font-mono text-[10px] uppercase tracking-widest font-bold mb-1 block">Vince Custom & HP Workstations</span>
            <h2 className="text-3xl font-display font-black text-slate-900">High-Performance Desktops</h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Configure robust micro-towers, secure mini-PCs, or state-of-the-art clear panel gaming & render rigs configured with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {desktops.map(desktop => (
            <motion.div
              key={desktop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ProductCard 
                product={desktop}
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
