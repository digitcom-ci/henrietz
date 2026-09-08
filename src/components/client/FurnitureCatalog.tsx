import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product, ProductVariant } from '../../types';
import { Search, ShoppingBag, Eye, Check, SlidersHorizontal, Info, Sparkles, Layers } from 'lucide-react';

const CATEGORIES: (ProductCategory | 'Tous')[] = [
  'Tous', 'Salon', 'Chambre', 'Salle à Manger', 'Bureau', 'Bois & Matériaux', 'Décoration'
];

export const FurnitureCatalog: React.FC = () => {
  const { products, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'Tous'>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Product Detail Modal state
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [selectedModalVariant, setSelectedModalVariant] = useState<ProductVariant | null>(null);

  // Selected variant per product card in catalog grid
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});
  const [addedAnimation, setAddedAnimation] = useState<string | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Tous' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.woodType && p.woodType.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenModal = (product: Product) => {
    setSelectedProductModal(product);
    setSelectedModalVariant(selectedVariants[product.id] || null);
  };

  const handleAddToCart = (product: Product, variant?: ProductVariant) => {
    if (product.variants && product.variants.length > 0 && !variant) {
      handleOpenModal(product);
      return;
    }
    addToCart(product, 1, variant);
    setAddedAnimation(product.id);
    setTimeout(() => setAddedAnimation(null), 1500);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80';
  };

  return (
    <section id="catalogue" className="py-12 sm:py-16 bg-ivoire relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-terracotta font-bold block mb-0.5">
              COLLECTION D'ARTISANAT EXCLUSIF • ABIDJAN
            </span>
            <h2 className="font-title text-lg sm:text-xl lg:text-2xl font-bold text-cacao">
              Mobilier Contemporain & Essences d'Art
            </h2>
            <p className="text-charbon/80 text-[11px] sm:text-xs mt-1.5 max-w-xl font-light tracking-wider leading-relaxed">
              Des créations authentiques façonnées à Abidjan mariant Noyer noble, Chêne et Iroko massif pour sublimer vos espaces intérieurs.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cognac" />
            <input
              type="text"
              placeholder="Rechercher meuble, essence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-ivoire border border-cognac/30 rounded-lg text-[11px] text-charbon placeholder-charbon/50 focus:outline-none focus:ring-2 focus:ring-terracotta shadow-xs font-sans tracking-wider"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-6 no-scrollbar border-b border-cognac/15">
          <div className="flex items-center gap-1 text-[10px] text-cognac mr-2 shrink-0 font-semibold tracking-wider uppercase">
            <SlidersHorizontal className="w-3 h-3 text-terracotta" />
            Catégories :
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-terracotta text-ivoire shadow-xs border border-terracotta font-bold'
                  : 'bg-ivoire text-cacao hover:bg-sable/30 border border-cognac/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-14 bg-ivoire rounded-2xl border border-dashed border-cognac/30">
            <Info className="w-8 h-8 text-terracotta mx-auto mb-2" />
            <p className="text-cacao font-medium text-xs tracking-wider">Aucun meuble ne correspond à votre recherche.</p>
            <button
              onClick={() => { setSelectedCategory('Tous'); setSearchQuery(''); }}
              className="mt-2 text-xs text-terracotta underline font-bold tracking-wider"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map(product => {
              const activeVariant = selectedVariants[product.id] || null;
              const displayImage = activeVariant ? activeVariant.image : product.image;
              const displayPrice = activeVariant?.price || product.price;
              const displayStatus = activeVariant?.status || product.status;
              const displayStock = activeVariant?.stock !== undefined ? activeVariant.stock : product.stock;

              return (
                <div 
                  key={product.id}
                  className="group artistic-card rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all border border-cognac/20"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative aspect-[16/11] overflow-hidden bg-cacao/5 cursor-pointer" onClick={() => handleOpenModal(product)}>
                      <img
                        src={displayImage}
                        alt={product.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-bold tracking-widest uppercase shadow-xs whitespace-nowrap ${
                          displayStatus === 'En stock' 
                            ? 'bg-emerald-900/90 backdrop-blur-md text-emerald-200 border border-emerald-500/40' 
                            : displayStatus === 'Rupture'
                            ? 'bg-red-950/90 backdrop-blur-md text-red-200 border border-red-500/40'
                            : 'bg-terracotta/95 backdrop-blur-md text-ivoire border border-sable/30'
                        }`}>
                          {displayStatus === 'En stock' 
                            ? 'EN STOCK' 
                            : displayStatus === 'Rupture'
                            ? 'RUPTURE'
                            : 'SUR COMMANDE'}
                        </span>
                      </div>

                      {/* Wood Badge */}
                      {product.woodType && (
                        <div className="absolute bottom-3 left-3 bg-charbon/90 backdrop-blur-md text-sable px-2.5 py-0.5 rounded-lg text-[9px] font-medium tracking-wider border border-cognac/30 whitespace-nowrap">
                          {product.woodType}
                        </div>
                      )}

                      {/* Quick View Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(product);
                        }}
                        className="absolute top-3 right-3 p-2 bg-ivoire/90 hover:bg-ivoire text-cacao rounded-full shadow-md transition hover:scale-110 border border-cognac/20 shrink-0"
                        title="Aperçu rapide et variantes"
                      >
                        <Eye className="w-3.5 h-3.5 text-terracotta" />
                      </button>
                    </div>

                    {/* Variant Thumbnails Row (under main image) */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="px-3 py-2 bg-[#FAF6F0] border-b border-cognac/10 flex items-center justify-between gap-1.5 whitespace-nowrap">
                        <span className="text-[9px] text-cognac font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-terracotta" />
                          Modèles :
                        </span>
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                          {/* Main Product Thumbnail Button */}
                          <button
                            onClick={() => setSelectedVariants(prev => {
                              const next = { ...prev };
                              delete next[product.id];
                              return next;
                            })}
                            className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                              !activeVariant 
                                ? 'border-terracotta ring-2 ring-terracotta/40 scale-110 shadow-xs' 
                                : 'border-cognac/20 opacity-60 hover:opacity-100'
                            }`}
                            title={`Produit Principal (${product.price.toLocaleString('fr-FR')} FCFA)`}
                          >
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </button>

                          {/* Variant Thumbnails */}
                          {product.variants.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariants(prev => ({ ...prev, [product.id]: v }))}
                              className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                                activeVariant?.id === v.id 
                                  ? 'border-terracotta ring-2 ring-terracotta/40 scale-110 shadow-xs' 
                                  : 'border-cognac/20 opacity-60 hover:opacity-100'
                              }`}
                              title={`${v.name} (${(v.price || product.price).toLocaleString('fr-FR')} FCFA)`}
                            >
                              <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Info Container */}
                    <div className="p-3.5">
                      <span className="text-[8.5px] text-terracotta font-bold uppercase tracking-widest block whitespace-nowrap truncate">
                        {product.category}
                      </span>
                      <h3 
                        onClick={() => handleOpenModal(product)}
                        className="font-title font-bold text-[13px] sm:text-sm text-cacao mt-0.5 group-hover:text-terracotta transition line-clamp-1 cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      {activeVariant && (
                        <span className="text-[9.5px] text-cognac font-semibold block mt-0.5 font-sans truncate">
                          Variante : <span className="text-cacao font-bold">{activeVariant.name}</span>
                        </span>
                      )}

                      <p className="text-charbon/75 text-[10.5px] mt-1 line-clamp-2 leading-relaxed font-light tracking-wider">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Price & Add Button */}
                  <div className="p-3.5 pt-0">
                    <div className="pt-2.5 border-t border-cognac/15 flex items-center justify-between gap-2">
                      <div className="shrink-0 whitespace-nowrap">
                        <span className="text-[8px] text-cognac uppercase tracking-wider block font-semibold">Prix FCFA</span>
                        <span className="font-title font-bold text-xs sm:text-sm text-cacao whitespace-nowrap">
                          {displayPrice.toLocaleString('fr-FR')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product, activeVariant)}
                        disabled={displayStatus === 'Rupture' || (displayStatus === 'En stock' && displayStock <= 0)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] sm:text-[10.5px] flex items-center gap-1.5 transition-all shadow-xs uppercase tracking-wider whitespace-nowrap shrink-0 ${
                          addedAnimation === product.id
                            ? 'bg-emerald-800 text-ivoire'
                            : 'bg-terracotta hover:bg-cacao text-ivoire active:scale-95'
                        }`}
                      >
                        {addedAnimation === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ajouté</span>
                          </>
                        ) : product.variants && product.variants.length > 0 && !activeVariant ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-sable" />
                            <span>Choisir Modèle</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-sable" />
                            <span>+ Panier</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Product Details & Variant Modal */}
        {selectedProductModal && (
          <div className="fixed inset-0 z-50 bg-charbon/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-charbon text-ivoire rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-cognac/40 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                
                {/* Main Modal Image */}
                <div className="aspect-square bg-cacao relative">
                  <img 
                    src={selectedModalVariant?.image || selectedProductModal.image} 
                    alt={selectedProductModal.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <span className="absolute top-4 left-4 bg-terracotta text-ivoire text-xs px-3 py-1 rounded-full font-semibold">
                    {selectedProductModal.woodType || selectedProductModal.category}
                  </span>
                </div>

                {/* Modal Info & Variants Selection */}
                <div className="p-5 sm:p-6 flex flex-col justify-between font-sans">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-sable uppercase tracking-widest">
                        {selectedProductModal.category}
                      </span>
                      <button 
                        onClick={() => setSelectedProductModal(null)}
                        className="text-sable/60 hover:text-sable font-bold text-base leading-none p-1"
                      >
                        ✕
                      </button>
                    </div>

                    <h3 className="font-title font-bold text-base sm:text-lg text-ivoire mt-0.5 leading-snug">
                      {selectedProductModal.name}
                    </h3>
                    
                    <p className="font-title text-sm sm:text-base font-bold text-sable mt-1">
                      {(selectedModalVariant?.price || selectedProductModal.price).toLocaleString('fr-FR')} FCFA
                    </p>

                    <p className="text-sable/80 text-[11px] mt-2.5 leading-relaxed font-light tracking-wider">
                      {selectedProductModal.description}
                    </p>

                    {/* Interactive Variants Selector inside Modal */}
                    {selectedProductModal.variants && selectedProductModal.variants.length > 0 && (
                      <div className="mt-3.5 pt-2.5 border-t border-sable/15 space-y-1.5">
                        <span className="text-[9.5px] font-bold text-sable uppercase tracking-wider block flex items-center gap-1">
                          <Layers className="w-3 h-3 text-cognac" />
                          Choisissez votre Finition / Variante :
                        </span>
                        
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 no-scrollbar">
                          {/* Main Product Option */}
                          <button
                            type="button"
                            onClick={() => setSelectedModalVariant(null)}
                            className={`w-full p-2 rounded-xl border flex items-center justify-between transition text-left ${
                              !selectedModalVariant
                                ? 'bg-cacao border-terracotta text-ivoire shadow-sm ring-1 ring-terracotta'
                                : 'bg-charbon/50 border-sable/20 text-sable/80 hover:bg-cacao/40'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <img src={selectedProductModal.image} alt={selectedProductModal.name} className="w-8 h-8 rounded-lg object-cover border border-sable/20 shrink-0" />
                              <div>
                                <span className="text-[11px] font-bold block leading-tight">Modèle Principal</span>
                                <span className="text-[9px] text-sable/60 font-mono block">Design d'origine</span>
                              </div>
                            </div>
                            <span className="font-mono text-[11px] font-bold text-sable whitespace-nowrap">
                              {selectedProductModal.price.toLocaleString('fr-FR')} FCFA
                            </span>
                          </button>

                          {/* Variants Options */}
                          {selectedProductModal.variants.map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedModalVariant(v)}
                              className={`w-full p-2 rounded-xl border flex items-center justify-between transition text-left ${
                                selectedModalVariant?.id === v.id
                                  ? 'bg-cacao border-terracotta text-ivoire shadow-sm ring-1 ring-terracotta'
                                  : 'bg-charbon/50 border-sable/20 text-sable/80 hover:bg-cacao/40'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <img src={v.image} alt={v.name} className="w-8 h-8 rounded-lg object-cover border border-sable/20 shrink-0" />
                                <div>
                                  <span className="text-[11px] font-bold block leading-tight">{v.name}</span>
                                  {v.size && <span className="text-[9px] text-sable/60 font-mono block">{v.size}</span>}
                                </div>
                              </div>
                              <span className="font-mono text-[11px] font-bold text-sable whitespace-nowrap">
                                {(v.price || selectedProductModal.price).toLocaleString('fr-FR')} FCFA
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3.5 pt-2.5 border-t border-sable/15 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-sable/60">Dimensions :</span>
                        <span className="font-mono text-ivoire">{selectedModalVariant?.size || selectedProductModal.dimensions || 'Sur demande'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sable/60">Disponibilité :</span>
                        {(() => {
                          const modalStatus = selectedModalVariant?.status || selectedProductModal.status;
                          const modalStock = selectedModalVariant?.stock !== undefined ? selectedModalVariant.stock : selectedProductModal.stock;
                          return (
                            <span className={`font-semibold ${
                              modalStatus === 'En stock' ? 'text-emerald-400' : modalStatus === 'Rupture' ? 'text-red-400' : 'text-cognac'
                            }`}>
                              {modalStatus === 'En stock' 
                                ? `En Stock Atelier (${modalStock} dispo)` 
                                : modalStatus === 'Rupture'
                                ? `Rupture de Stock`
                                : `Confection Sur-Mesure sous Commande`}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-sable/15 space-y-2 mt-3">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProductModal, selectedModalVariant || undefined);
                        setSelectedProductModal(null);
                      }}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-terracotta to-cognac hover:from-cognac hover:to-terracotta text-ivoire font-bold text-[11px] rounded-xl shadow-md flex items-center justify-center gap-2 transition uppercase tracking-wider whitespace-nowrap active:scale-[0.99]"
                    >
                      <ShoppingBag className="w-4 h-4 text-sable" />
                      <span>Ajouter au Panier • {(selectedModalVariant?.price || selectedProductModal.price).toLocaleString('fr-FR')} FCFA</span>
                    </button>
                    
                    <a
                      href="#devis-builder"
                      onClick={() => setSelectedProductModal(null)}
                      className="w-full py-2 px-3 bg-cacao hover:bg-cacao/80 text-sable font-semibold text-[10.5px] rounded-xl flex items-center justify-center gap-1.5 transition text-center tracking-wider border border-sable/30 whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cognac" />
                      <span>Demander une confection sur-mesure</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

