import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, isCartOpen, setIsCartOpen, removeFromCart, 
    updateCartQuantity, cartTotal, createOrder, currentUser 
  } = useApp();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name);
      if (!email) setEmail(currentUser.email);
      if (!phone && currentUser.phone) setPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!isCartOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    createOrder(name, email, phone);
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setCheckoutModalOpen(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col font-sans">
          
          {/* Drawer Header */}
          <div className="p-6 bg-cacao text-ivoire flex justify-between items-center border-b border-sable/20">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-terracotta" />
              <h2 className="font-title font-bold text-lg text-ivoire">Votre Panier HENRIETZ</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-sable/70 hover:text-ivoire transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-ivoire">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-cognac/40 mx-auto" />
                <p className="text-cacao/70 text-xs tracking-wider">Votre panier est actuellement vide.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 bg-terracotta text-ivoire text-xs rounded-xl font-bold uppercase tracking-wider shadow"
                >
                  Découvrir la Collection
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 p-3 bg-ivoire rounded-2xl border border-cognac/20 shadow-xs">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-xl object-cover border border-cognac/20 shrink-0" 
                    />
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-title font-bold text-xs text-cacao line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-terracotta hover:text-red-700 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-terracotta font-bold font-title">
                        {item.price.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1 bg-ivoire border border-cognac/30 rounded-md text-cacao hover:bg-sable/20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold w-6 text-center text-charbon">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="p-1 bg-ivoire border border-cognac/30 rounded-md text-cacao hover:bg-sable/20"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-ivoire border-t border-cognac/20 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-charbon/70">
                  <span>Livraison Atelier Abidjan :</span>
                  <span className="font-semibold text-emerald-800">Offerte</span>
                </div>
                <div className="flex justify-between text-base font-bold text-cacao font-title pt-2 border-t border-cognac/20">
                  <span>Total :</span>
                  <span className="text-terracotta">{cartTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-terracotta to-cognac hover:brightness-110 text-ivoire font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                Valider la Commande ({cartTotal.toLocaleString('fr-FR')} FCFA)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-60 bg-charbon/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-charbon text-ivoire rounded-3xl max-w-md w-full p-6 shadow-2xl border border-cognac/40">
            {orderSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="font-title font-bold text-2xl text-ivoire">Commande Confirmée !</h3>
                <p className="text-xs text-sable/90 tracking-wider">
                  Votre commande a bien été enregistrée à Abidjan. Merci de votre confiance envers la Maison HENRIETZ.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-sable/20">
                  <h3 className="font-title font-bold text-lg text-ivoire">Finaliser la Commande</h3>
                  <button 
                    type="button" 
                    onClick={() => setCheckoutModalOpen(false)}
                    className="text-sable/60 hover:text-ivoire"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-sable mb-1">Nom et Prénom *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-cacao/60 border border-sable/30 rounded-xl text-xs text-ivoire placeholder-sable/50 focus:ring-2 focus:ring-terracotta"
                      placeholder="Ex: Jean Martin"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-sable mb-1">Adresse Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-cacao/60 border border-sable/30 rounded-xl text-xs text-ivoire placeholder-sable/50 focus:ring-2 focus:ring-terracotta"
                      placeholder="email@exemple.ci"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-sable mb-1">Numéro Téléphone (+225...) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-cacao/60 border border-sable/30 rounded-xl text-xs text-ivoire placeholder-sable/50 focus:ring-2 focus:ring-terracotta"
                      placeholder="+225 07 00 00 00 00"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-sable/20">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-terracotta to-cognac text-ivoire font-bold text-xs rounded-xl hover:brightness-110 uppercase tracking-widest shadow-md"
                  >
                    Payer {cartTotal.toLocaleString('fr-FR')} FCFA
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
