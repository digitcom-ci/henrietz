import React from 'react';
import { Hammer, ArrowRight, TreePine, Award, ShieldCheck, Sparkles } from 'lucide-react';

export const HeaderHero: React.FC = () => {
  return (
    <section id="hero" className="relative bg-cacao text-ivoire overflow-hidden py-8 lg:py-10 border-b border-sable/20">
      {/* Background Luxury Wood Image under Brun Cacao Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80" 
          alt="Atelier Ébénisterie HENRIETZ Abidjan" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cacao via-cacao/95 to-cacao/80"></div>
      </div>

      {/* Decorative Subtle Glow Effects */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-terracotta/15 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 right-10 w-80 h-80 rounded-full bg-cognac/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Editorial Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta/20 border border-terracotta/40 text-sable text-[10px] font-semibold tracking-widest uppercase shadow-xs">
              <Sparkles className="w-3 h-3 text-cognac" />
              <span>MAISON D'ÉBÉNISTERIE D'ART • ABIDJAN</span>
            </div>

            <h1 className="font-title text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-snug text-ivoire">
              Créations en <span className="terracotta-gradient-text">Bois Nobles</span> & Agencement Sur-Mesure
            </h1>

            <p className="text-[11px] sm:text-xs text-sable/90 font-light tracking-wider leading-relaxed max-w-xl">
              Artisanat d'art et ébénisterie haut de gamme (Noyer, Iroko, Chêne) façonnés sur-mesure dans notre atelier de Marcory Zone 4 à Abidjan.
            </p>

            {/* Action Buttons */}
            <div className="pt-0.5 flex flex-wrap items-center gap-2.5">
              <a
                href="#devis-builder"
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-gradient-to-r from-terracotta via-cognac to-sable text-ivoire font-bold text-[11px] uppercase tracking-wider shadow-sm hover:brightness-110 transition"
              >
                <Hammer className="w-3 h-3 text-ivoire" />
                Devis Sur-Mesure & Bois
              </a>

              <a
                href="#catalogue"
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-charbon/60 hover:bg-terracotta/30 text-ivoire font-semibold text-[11px] border border-sable/30 backdrop-blur-md transition tracking-wider uppercase hover:border-sable"
              >
                Collection Meubles
                <ArrowRight className="w-3 h-3 text-sable" />
              </a>
            </div>

            {/* Reassurance Grid */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-sable/20 text-[11px] tracking-wider font-light">
              <div className="flex items-center gap-2 text-sable/90">
                <TreePine className="w-3.5 h-3.5 text-cognac shrink-0" />
                <span>Noyer, Chêne & Iroko Sélection</span>
              </div>
              <div className="flex items-center gap-2 text-sable/90">
                <Award className="w-3.5 h-3.5 text-cognac shrink-0" />
                <span>Façonné Main à Abidjan</span>
              </div>
              <div className="flex items-center gap-2 text-sable/90">
                <ShieldCheck className="w-3.5 h-3.5 text-cognac shrink-0" />
                <span>Garantie Structure 20 Ans</span>
              </div>
            </div>
          </div>

          {/* Right Compact Preview Frame */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-terracotta via-cognac to-sable rounded-2xl transform rotate-1 opacity-30 blur-xs"></div>
              
              <div className="relative rounded-2xl overflow-hidden border border-sable/30 shadow-xl bg-charbon">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80"
                    alt="Table Repas Royale Noyer Massif HENRIETZ"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-terracotta/90 backdrop-blur-md text-ivoire px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-sable/30">
                    Création Signature
                  </div>
                </div>

                <div className="p-4 bg-charbon text-ivoire">
                  <h3 className="font-title font-bold text-base text-ivoire">Table Royale Noyer Massif</h3>
                  <p className="text-[11px] text-sable/80 mt-0.5 font-light tracking-wider">Plateau monobloc 240cm avec bords bruts (Live edge).</p>
                  
                  <div className="mt-3 flex justify-between items-center pt-2.5 border-t border-sable/15">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-sable/60 block">Tarif indicatif</span>
                      <span className="font-title font-bold text-base text-sable">2 250 000 FCFA</span>
                    </div>
                    <a 
                      href="#devis-builder" 
                      className="px-3 py-1.5 rounded-lg bg-terracotta/30 hover:bg-terracotta text-ivoire text-[11px] font-semibold border border-terracotta/50 transition tracking-wider"
                    >
                      Sur-mesure →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

