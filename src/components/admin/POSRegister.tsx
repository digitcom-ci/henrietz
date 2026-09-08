import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, OrderItem, POSTransaction } from '../../types';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, Printer, Search } from 'lucide-react';

export const POSRegister: React.FC = () => {
  const { products, processPOSSale, employees } = useApp();

  const [posCart, setPosCart] = useState<OrderItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<POSTransaction['paymentMethod']>('Carte Bancaire');
  const [cashierName, setCashierName] = useState('Kouadio Jean (Vendeur Caisse)');
  const [searchQuery, setSearchQuery] = useState('');
  const [receiptModal, setReceiptModal] = useState<POSTransaction | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToPOS = (product: Product) => {
    setPosCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: 'pos-item-' + Date.now() + Math.random(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }];
    });
  };

  const updatePOSQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setPosCart(prev => prev.filter(i => i.productId !== productId));
      return;
    }
    setPosCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const subtotal = posCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);

  const handleCompleteSale = () => {
    if (posCart.length === 0) return;
    
    processPOSSale(posCart, discount, paymentMethod, cashierName);

    const generatedReceipt: POSTransaction = {
      id: 'POS-' + Date.now(),
      ticketNo: 'TK-ABJ-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
      items: [...posCart],
      subtotal,
      discount,
      total,
      paymentMethod,
      cashierName,
      timestamp: new Date().toLocaleString('fr-FR')
    };

    setReceiptModal(generatedReceipt);
    setPosCart([]);
    setDiscount(0);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-title text-lg font-bold text-henrietz-walnut flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-henrietz-gold" />
            Interface Caisse POS Showroom Abidjan (FCFA)
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5 font-normal tracking-wide">
            Encaissez vos ventes en magasin Zone 4, appliquez des remises FCFA et éditez des reçus instantanés.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-1.5 px-3 rounded-xl border border-gray-200 text-xs">
          <span className="text-gray-500 font-semibold tracking-wider">Caissier :</span>
          <select
            value={cashierName}
            onChange={(e) => setCashierName(e.target.value)}
            className="bg-transparent font-bold text-henrietz-walnut focus:outline-none tracking-wider"
          >
            {employees.map(emp => (
              <option key={emp.id} value={`${emp.name} (${emp.role})`}>
                {emp.name} ({emp.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Available Items Selector Grid */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Recherche rapide d'article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-henrietz-gold tracking-wider"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => addToPOS(p)}
                className="p-3 bg-[#FAF6F0] rounded-2xl border border-gray-200 hover:border-henrietz-gold cursor-pointer transition flex flex-col justify-between"
              >
                <div>
                  <img src={p.image} alt={p.name} className="w-full h-20 object-cover rounded-xl mb-2" />
                  <span className="text-[10px] text-henrietz-oak font-semibold block uppercase tracking-wider">{p.category}</span>
                  <h4 className="font-title font-bold text-xs text-henrietz-walnut line-clamp-1">{p.name}</h4>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-title font-bold text-xs text-henrietz-oak">{p.price.toLocaleString('fr-FR')} FCFA</span>
                  <span className="text-[10px] text-gray-500 font-mono">Stk: {p.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Cash Register Cart & Payment */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="font-title font-bold text-lg text-henrietz-walnut">Ticket de Caisse en Cours</h3>
              <span className="text-xs bg-henrietz-gold/20 text-henrietz-walnut font-bold px-2.5 py-1 rounded-full tracking-wider">
                {posCart.length} articles
              </span>
            </div>

            {/* Cart Items list */}
            <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
              {posCart.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8 tracking-wider font-light">Cliquez sur des articles à gauche pour les ajouter au ticket.</p>
              ) : (
                posCart.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                    <div className="flex-1 pr-2">
                      <span className="font-title font-bold text-gray-800 block line-clamp-1">{item.name}</span>
                      <span className="text-gray-500 font-mono">{item.price.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => updatePOSQty(item.productId, item.quantity - 1)} className="p-1 bg-white border rounded">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updatePOSQty(item.productId, item.quantity + 1)} className="p-1 bg-white border rounded">
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="font-title font-bold text-henrietz-walnut w-24 text-right">
                        {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total FCFA :</span>
                <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Remise FCFA :</span>
                <input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-28 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-right font-mono font-bold text-xs"
                />
              </div>
              <div className="flex justify-between text-lg font-title font-bold text-henrietz-walnut pt-2 border-t border-gray-200">
                <span>TOTAL À ENCAISSER :</span>
                <span className="text-henrietz-oak">{total.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Mode de Règlement</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['Carte Bancaire', 'Espèces', 'Virement', 'Chèque'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setPaymentMethod(mode)}
                    className={`py-2 px-3 rounded-xl font-bold transition text-left flex items-center gap-2 border ${
                      paymentMethod === mode
                        ? 'bg-henrietz-walnut text-henrietz-gold border-henrietz-gold shadow'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    {mode === 'Carte Bancaire' ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Encaissement Button */}
            <button
              onClick={handleCompleteSale}
              disabled={posCart.length === 0}
              className="w-full py-4 bg-gradient-to-r from-henrietz-gold via-[#D4AF37] to-henrietz-oak hover:brightness-110 text-henrietz-dark font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl transition disabled:opacity-50"
            >
              Encaisser ({total.toLocaleString('fr-FR')} FCFA)
            </button>
          </div>

        </div>

      </div>

      {/* Printable Receipt Modal */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-henrietz-gold/40 text-gray-800 space-y-4 font-mono text-xs">
            <div className="text-center border-b border-dashed border-gray-300 pb-3">
              <h3 className="font-title font-bold text-xl text-henrietz-walnut">MAISON HENRIETZ</h3>
              <p className="text-[10px] text-gray-500">Showroom Marcory Zone 4, Abidjan</p>
              <p className="text-[10px] font-bold text-henrietz-oak mt-1">Ticket N° {receiptModal.ticketNo}</p>
              <p className="text-[10px] text-gray-400">{receiptModal.timestamp}</p>
            </div>

            <div className="space-y-1 divide-y divide-gray-100">
              {receiptModal.items.map(item => (
                <div key={item.id} className="pt-1 flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-bold">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-dashed border-gray-300 space-y-1">
              <div className="flex justify-between">
                <span>Sous-total :</span>
                <span>{receiptModal.subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              {receiptModal.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Remise :</span>
                  <span>-{receiptModal.discount.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-henrietz-walnut pt-1 border-t border-gray-300">
                <span>TOTAL PAYÉ :</span>
                <span>{receiptModal.total.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 pt-1">
                <span>Règlement :</span>
                <span>{receiptModal.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>Caissier :</span>
                <span>{receiptModal.cashierName}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex gap-2 font-sans">
              <button
                onClick={() => setReceiptModal(null)}
                className="flex-1 py-2 bg-gray-200 font-bold text-xs rounded-xl"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl flex items-center justify-center gap-1 uppercase tracking-wider"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
