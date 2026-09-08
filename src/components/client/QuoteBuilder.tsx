import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Hammer, CheckCircle2, TreePine, Calculator, Ruler, FileText, Send, Sparkles, User as UserIcon } from 'lucide-react';

export const QuoteBuilder: React.FC = () => {
  const { woodSpecies, addQuoteRequest, currentUser, setIsAuthModalOpen, setAuthModalMode } = useApp();

  const [projectType, setProjectType] = useState<'Aménagement Intérieur' | 'Dressing Sur-Mesure' | 'Cuisine & Comptoir' | 'Bibliothèque sur-mesure' | 'Découpe Bois Bruts'>('Dressing Sur-Mesure');
  const [selectedWood, setSelectedWood] = useState(woodSpecies[0]?.name || 'Noyer d\'Amérique (Noce)');
  const [length, setLength] = useState<number>(250); // in cm
  const [width, setWidth] = useState<number>(60); // in cm
  const [height, setHeight] = useState<number>(220); // in cm
  const [notes, setNotes] = useState('');

  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');

  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (!clientName) setClientName(currentUser.name);
      if (!clientEmail) setClientEmail(currentUser.email);
      if (!clientPhone && currentUser.phone) setClientPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Live calculation formula for FCFA
  const currentWoodObj = woodSpecies.find(w => w.name === selectedWood) || woodSpecies[0];
  const woodPriceM2 = currentWoodObj ? currentWoodObj.pricePerM2 : 150000;
  
  // Approximate surface in m2
  const surfaceM2 = Math.max(1, ((length * height * 2) + (length * width * 2)) / 10000);
  
  // Project type complexity coefficient
  const complexityFactor = 
    projectType === 'Cuisine & Comptoir' ? 2.2 :
    projectType === 'Dressing Sur-Mesure' ? 1.8 :
    projectType === 'Bibliothèque sur-mesure' ? 1.9 :
    projectType === 'Aménagement Intérieur' ? 2.5 : 1.2;

  const estimatedPrice = Math.round(surfaceM2 * woodPriceM2 * complexityFactor + 150000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) return;

    addQuoteRequest({
      clientName,
      clientEmail,
      clientPhone,
      projectType,
      woodType: selectedWood,
      dimensions: { length, width, height },
      estimatedPrice,
      notes
    });

    const generatedId = 'DEV-2026-' + Math.floor(100 + Math.random() * 900);
    setSubmittedQuoteId(generatedId);
  };

  return (
    <section id="devis-builder" className="py-12 sm:py-16 bg-cacao text-ivoire relative overflow-hidden border-t border-sable/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta/20 text-sable text-[10px] font-semibold tracking-widest uppercase mb-2 border border-terracotta/40">
            <Calculator className="w-3 h-3 text-cognac" />
            Configurateur Sur-Mesure
          </div>
          <h2 className="font-title text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-ivoire">
            Demande de Devis <span className="terracotta-gradient-text">Aménagement & Bois</span>
          </h2>
          <p className="text-sable/90 text-[11px] sm:text-xs mt-2 font-light tracking-wider leading-relaxed">
            Calculez une estimation instantanée en FCFA pour vos agencements à Abidjan (dressings, cuisines, panneaux d'Iroko et Noyer) et transmettez votre dossier à notre bureau d'études.
          </p>
        </div>

        {submittedQuoteId ? (
          <div className="max-w-2xl mx-auto bg-charbon/90 backdrop-blur-xl border border-cognac/40 p-8 sm:p-12 rounded-3xl text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-900/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs uppercase tracking-widest text-sable font-bold">
              Demande Reçue avec Succès
            </span>
            <h3 className="font-title text-3xl font-bold text-ivoire mt-2">
              Devis N° {submittedQuoteId}
            </h3>
            <p className="text-sable/90 text-xs mt-3 leading-relaxed tracking-wider">
              Merci <strong className="text-ivoire">{clientName}</strong> ! Votre projet d'aménagement <span className="text-sable">{projectType}</span> en <span className="text-sable">{selectedWood}</span> a bien été transmis aux ébénistes HENRIETZ Abidjan.
            </p>

            <div className="my-6 p-5 bg-charbon rounded-2xl border border-sable/15 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-sable/60">Dimensions :</span>
                <span className="font-mono text-ivoire">{length} x {width} x {height} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sable/60">Estimation indicative :</span>
                <span className="font-title font-bold text-sable text-lg">{estimatedPrice.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sable/60">Contact :</span>
                <span className="text-ivoire">{clientEmail} / {clientPhone}</span>
              </div>
            </div>

            <p className="text-xs text-sable/70 mb-6 font-light">
              Un chargé de projet va étudier vos cotes et vous recontacter par téléphone sous 24h.
            </p>

            <button
              onClick={() => {
                setSubmittedQuoteId(null);
                setClientName('');
                setClientEmail('');
                setClientPhone('');
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-terracotta to-cognac text-ivoire font-bold text-xs rounded-2xl shadow-lg uppercase tracking-widest hover:brightness-110 transition"
            >
              Créer une autre demande
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 bg-charbon/90 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-cognac/30 shadow-2xl space-y-8">
              
              {/* Step 1: Project Type */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-sable mb-4 flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-terracotta" />
                  1. Type de Projet d'Aménagement
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(['Aménagement Intérieur', 'Dressing Sur-Mesure', 'Cuisine & Comptoir', 'Bibliothèque sur-mesure', 'Découpe Bois Bruts'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProjectType(type)}
                      className={`p-4 rounded-2xl text-xs font-semibold text-left transition border tracking-wider ${
                        projectType === type 
                          ? 'bg-terracotta text-ivoire border-terracotta font-bold shadow-lg' 
                          : 'bg-cacao/40 text-sable hover:bg-cacao/70 border-sable/20'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Wood Selection */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-sable mb-4 flex items-center gap-2">
                  <TreePine className="w-4 h-4 text-terracotta" />
                  2. Essence de Bois Nobles
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {woodSpecies.map(wood => (
                    <div
                      key={wood.id}
                      onClick={() => setSelectedWood(wood.name)}
                      className={`p-4 rounded-2xl cursor-pointer transition border flex items-center gap-4 ${
                        selectedWood === wood.name
                          ? 'bg-terracotta/30 border-terracotta text-ivoire shadow-lg ring-1 ring-terracotta'
                          : 'bg-cacao/30 border-sable/20 text-sable hover:bg-cacao/60'
                      }`}
                    >
                      <img 
                        src={wood.image} 
                        alt={wood.name} 
                        className="w-14 h-14 rounded-xl object-cover border border-sable/20 shrink-0" 
                      />
                      <div>
                        <h4 className="font-title font-bold text-sm text-ivoire">{wood.name}</h4>
                        <p className="text-[11px] text-sable/70 line-clamp-1 font-light">{wood.description}</p>
                        <span className="text-[10px] text-sable font-mono font-semibold">
                          ~{wood.pricePerM2.toLocaleString('fr-FR')} FCFA / m²
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Dimensions Sliders */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-sable mb-4 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-terracotta" />
                  3. Dimensions du Meuble (cm)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-cacao/40 p-5 rounded-2xl border border-sable/20">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-sable/80">Longueur :</span>
                      <span className="font-mono text-sable font-bold">{length} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min={50} 
                      max={600} 
                      step={10} 
                      value={length} 
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="w-full accent-terracotta cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-sable/80">Profondeur :</span>
                      <span className="font-mono text-sable font-bold">{width} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min={30} 
                      max={200} 
                      step={5} 
                      value={width} 
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full accent-terracotta cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-sable/80">Hauteur :</span>
                      <span className="font-mono text-sable font-bold">{height} cm</span>
                    </div>
                    <input 
                      type="range" 
                      min={40} 
                      max={350} 
                      step={10} 
                      value={height} 
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full accent-terracotta cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Contact details */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-sable mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-terracotta" />
                  4. Coordonnées pour l'envoi du Devis Officiel
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Nom complet / Entreprise *"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="px-4 py-3 bg-cacao/40 border border-sable/20 rounded-xl text-xs text-ivoire placeholder-sable/50 focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email *"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="px-4 py-3 bg-cacao/40 border border-sable/20 rounded-xl text-xs text-ivoire placeholder-sable/50 focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Téléphone (+225...) *"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="px-4 py-3 bg-cacao/40 border border-sable/20 rounded-xl text-xs text-ivoire placeholder-sable/50 focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Quartier (ex: Cocody, Marcory Zone 4, Riviera...) et détails particuliers..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-3 w-full px-4 py-3 bg-cacao/40 border border-sable/20 rounded-xl text-xs text-ivoire placeholder-sable/50 focus:outline-none focus:ring-2 focus:ring-terracotta"
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-terracotta via-cognac to-sable hover:brightness-110 text-ivoire font-bold text-xs rounded-2xl shadow-xl uppercase tracking-widest flex items-center justify-center gap-2 transition glow-terracotta"
              >
                <Send className="w-4 h-4" />
                Valider la demande de devis ({estimatedPrice.toLocaleString('fr-FR')} FCFA)
              </button>
            </form>

            {/* Live Estimator Sidebar */}
            <div className="lg:col-span-4 bg-gradient-to-b from-cacao to-charbon border border-cognac/30 p-8 rounded-3xl shadow-2xl sticky top-24 space-y-6">
              <div className="flex items-center gap-2 text-sable font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-terracotta" />
                Estimation Tarifaire Directe
              </div>

              <div className="p-5 bg-charbon/70 rounded-2xl border border-sable/20 text-center">
                <span className="text-xs text-sable/70 block tracking-wider">Budget Estimatif</span>
                <span className="font-title font-bold text-3xl sm:text-4xl terracotta-gradient-text block mt-1">
                  {estimatedPrice.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="text-[10px] text-sable/60 block mt-2">Fabrication & assemblage atelier inclus</span>
              </div>

              <div className="space-y-3 text-xs divide-y divide-sable/15 font-light">
                <div className="pt-2 flex justify-between">
                  <span className="text-sable/70">Projet :</span>
                  <span className="font-semibold text-ivoire">{projectType}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-sable/70">Essence :</span>
                  <span className="font-semibold text-sable">{selectedWood}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-sable/70">Dimensions :</span>
                  <span className="font-mono text-ivoire">{length} x {width} x {height} cm</span>
                </div>
              </div>

              <div className="p-4 bg-terracotta/15 rounded-2xl border border-terracotta/40 text-xs text-sable space-y-2 font-light">
                <div className="font-bold text-sable flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-terracotta" />
                  Maison HENRIETZ Abidjan
                </div>
                <p className="text-[11px] leading-relaxed text-sable/90">
                  Livraison et installation assurées à Abidjan et partout en Côte d'Ivoire.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};
