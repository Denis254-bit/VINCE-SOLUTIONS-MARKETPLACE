import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Printer, FileText, Settings, Award, Layers, Sparkles, Check } from 'lucide-react';
import { PRODUCTS_CATALOG } from '../data';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface PrintersLandingProps {
  onView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const PrintersLanding: React.FC<PrintersLandingProps> = ({ onView, onAddToCart }) => {
  const printers = PRODUCTS_CATALOG.filter(p => p.category === 'printers');
  const featuredPrinter = printers.find(p => p.id === 'pr-laserjet-1020') || printers[0];

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 mt-4 lg:mx-auto max-w-7xl">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-blue-900/10 to-transparent pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 p-8 md:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-cyan-400 font-mono tracking-widest text-[10px] font-bold uppercase mb-4 block">
              Indestructible Office Workhorse
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black leading-tight mb-6 text-white tracking-tight">
              LaserJet 1020. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400">
                Legendary.
              </span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-md leading-relaxed mb-8">
              Reputed globally as the most bulletproof monochrome laser printer ever crafted. Achieve rock-bottom cost per page, 14ppm instantaneous output, and absolute, unmatched structural reliability.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => onView(featuredPrinter)}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 text-sm"
              >
                Inquire & Order <ChevronRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => document.getElementById('printer-catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-slate-700 hover:border-slate-500 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                View Print Fleet
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
              src={featuredPrinter.image} 
              alt={featuredPrinter.name}
              className="w-full max-h-[350px] object-contain transition-all duration-700 ease-out z-0 relative hover:rotate-1"
            />
            
            {/* Floater specs */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Printer className="text-cyan-400 w-4 h-4" />
                  <span className="text-xs font-mono font-bold text-slate-200">Indestructible Model</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="text-teal-400 w-4 h-4" />
                  <span className="text-xs font-mono font-bold text-slate-200">2,000 Pages / Toner</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento */}
      <section className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700" />
          <Layers className="w-8 h-8 text-cyan-600 mb-6" />
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Maximum Page Yield. Minimal Ink Spend.</h3>
          <p className="text-slate-500 text-sm max-w-md">
            From our ultra-resilient cold-press microfluidic printing heads to our high-volume monochrome toner cartridges, Vince Hub ensures your office costs stay predictable and streamlined.
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-950 to-emerald-950 p-8 rounded-3xl border border-emerald-900 text-white shadow-xl flex flex-col justify-between">
          <div>
            <Sparkles className="w-8 h-8 text-cyan-400 mb-6" />
            <h3 className="text-xl font-display font-bold mb-2">True Color Saturated</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              We catalog specialized multi-tank photo inkjets from Canon and Epson delivering precise gamut coordinates for marketing copy.
            </p>
          </div>
          <div className="mt-8 border-t border-emerald-800 pt-4 flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300">CALIBRATED INK SYSTEMS</span>
            <Check className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section id="printer-catalog" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
          <div>
            <span className="text-cyan-600 font-mono text-[10px] uppercase tracking-widest font-bold mb-1 block">Toner & Inkjet Systems</span>
            <h2 className="text-3xl font-display font-black text-slate-900">Laser & LaserJet Printers</h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Discover lightweight home styling inkjets, bulletproof monochrome lasers, and massive 45ppm enterprise-level duplex copy stations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {printers.map(printer => (
            <motion.div
              key={printer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ProductCard 
                product={printer}
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
