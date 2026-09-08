import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteRequest } from '../../types';
import { FileCheck, Printer, Mail, Send, Edit3 } from 'lucide-react';

export const QuotesManagement: React.FC = () => {
  const { quotes, updateQuoteStatus } = useApp();
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(quotes[0] || null);
  const [adjustedPrice, setAdjustedPrice] = useState<number>(quotes[0]?.estimatedPrice || 0);
  const [adminNote, setAdminNote] = useState<string>('');
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);

  const handleStatusChange = (status: QuoteRequest['status']) => {
    if (!selectedQuote) return;
    updateQuoteStatus(selectedQuote.id, status, adminNote);
    setSelectedQuote({ ...selectedQuote, status, notes: adminNote || selectedQuote.notes });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-title text-lg font-bold text-henrietz-walnut flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-henrietz-gold" />
            Gestion des Devis Client & Aménagement (FCFA)
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5 font-normal tracking-wide">
            Traitez les demandes de sur-mesure pour Abidjan, ajustez les prix et éditez des devis officiels en FCFA.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quotes List Table */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200 p-4 shadow-sm space-y-3">
          <h3 className="font-title font-bold text-sm text-henrietz-walnut px-2 mb-2">
            Liste des Demandes ({quotes.length})
          </h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {quotes.map(quote => (
              <div
                key={quote.id}
                onClick={() => {
                  setSelectedQuote(quote);
                  setAdjustedPrice(quote.estimatedPrice);
                  setAdminNote(quote.notes || '');
                }}
                className={`p-4 rounded-2xl cursor-pointer transition border ${
                  selectedQuote?.id === quote.id
                    ? 'bg-henrietz-walnut text-white border-henrietz-gold shadow-lg'
                    : 'bg-[#FAF6F0] hover:bg-gray-100 text-gray-800 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`font-mono text-xs font-bold ${
                      selectedQuote?.id === quote.id ? 'text-henrietz-gold' : 'text-henrietz-oak'
                    }`}>
                      {quote.id}
                    </span>
                    <h4 className="font-bold text-sm mt-0.5 tracking-wider">{quote.clientName}</h4>
                    <p className="text-xs opacity-80 mt-0.5 tracking-wider font-light">
                      {quote.projectType} • <span className="font-semibold">{quote.woodType}</span>
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    quote.status === 'Validé' ? 'bg-emerald-100 text-emerald-800' :
                    quote.status === 'Devis Transmis' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {quote.status}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-xs opacity-90">
                  <span>Cotes : {quote.dimensions.length}x{quote.dimensions.width}x{quote.dimensions.height} cm</span>
                  <span className="font-title font-bold">{quote.estimatedPrice.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Detail & Actions */}
        {selectedQuote ? (
          <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                <div>
                  <span className="font-mono text-xs text-henrietz-oak font-bold">{selectedQuote.id}</span>
                  <h3 className="font-title font-bold text-2xl text-henrietz-walnut mt-0.5">
                    {selectedQuote.projectType}
                  </h3>
                  <p className="text-xs text-gray-500 tracking-wider">Client : <strong>{selectedQuote.clientName}</strong> ({selectedQuote.clientEmail})</p>
                </div>

                <button
                  onClick={() => setPrintPreviewOpen(true)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition tracking-wider uppercase"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer / PDF
                </button>
              </div>

              {/* Specs Box */}
              <div className="my-4 p-4 bg-[#FAF6F0] rounded-2xl border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Essence de Bois :</span>
                  <span className="font-semibold text-henrietz-walnut">{selectedQuote.woodType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dimensions Totales :</span>
                  <span className="font-mono text-gray-800">{selectedQuote.dimensions.length} L x {selectedQuote.dimensions.width} P x {selectedQuote.dimensions.height} H cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Téléphone Client :</span>
                  <span className="font-mono text-gray-800">{selectedQuote.clientPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date de dépôt :</span>
                  <span className="font-mono">{selectedQuote.date}</span>
                </div>
              </div>

              {/* Note / Adjustment */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Ajuster le Prix du Devis (FCFA)</label>
                  <input
                    type="number"
                    value={adjustedPrice}
                    onChange={(e) => setAdjustedPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold text-henrietz-oak text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Notes Internes / Réponse Client</label>
                  <textarea
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Précisez les délais d'installation à Abidjan, acomptes..."
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs tracking-wider"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Changer l'état du dossier :
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleStatusChange('Étude en cours')}
                  className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[11px] rounded-xl transition uppercase tracking-wider"
                >
                  Étude en cours
                </button>
                <button
                  onClick={() => handleStatusChange('Devis Transmis')}
                  className="py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] rounded-xl transition uppercase tracking-wider"
                >
                  Envoyer Devis
                </button>
                <button
                  onClick={() => handleStatusChange('Validé')}
                  className="py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-xl transition shadow uppercase tracking-wider"
                >
                  Valider (Acompte)
                </button>
                <button
                  onClick={() => handleStatusChange('En Fabrication')}
                  className="py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[11px] rounded-xl transition uppercase tracking-wider"
                >
                  En Fabrication
                </button>
                <button
                  onClick={() => handleStatusChange('Terminé')}
                  className="py-2 bg-gray-800 hover:bg-black text-white font-bold text-[11px] rounded-xl transition uppercase tracking-wider"
                >
                  Terminé
                </button>
                <button
                  onClick={() => handleStatusChange('Refusé')}
                  className="py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] rounded-xl transition uppercase tracking-wider"
                >
                  Refuser
                </button>
              </div>
            </div>

          </div>
        ) : null}

      </div>

      {/* Printable Devis Modal Abidjan */}
      {printPreviewOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-henrietz-gold/40 text-gray-900 space-y-6 animate-in zoom-in-95">
            {/* Document Header */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <h2 className="font-title text-3xl font-bold text-henrietz-walnut">MAISON HENRIETZ</h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Ébénisterie d'Art & MEUBLES • ABIDJAN</p>
                <p className="text-[11px] text-gray-400 font-mono">RCCM : CI-ABJ-03-2026-B12-00449 • NCC : 2104889 A</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-henrietz-oak">DEVIS N° {selectedQuote.id}</span>
                <p className="text-xs text-gray-500 font-mono">Date : {selectedQuote.date}</p>
                <p className="text-xs font-bold text-emerald-700 mt-1 uppercase tracking-wider">Statut : {selectedQuote.status}</p>
              </div>
            </div>

            {/* Client info */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div>
                <span className="font-bold text-gray-500 uppercase tracking-wider block">Émetteur</span>
                <p className="font-bold text-henrietz-walnut">Atelier HENRIETZ Abidjan</p>
                <p className="text-gray-600">Marcory Zone 4, Bd de Marseille</p>
                <p className="text-gray-600">contact@henrietz.ci / +225 27 21 00 00 00</p>
              </div>
              <div>
                <span className="font-bold text-gray-500 uppercase tracking-wider block">Destinataire</span>
                <p className="font-bold text-henrietz-walnut">{selectedQuote.clientName}</p>
                <p className="text-gray-600">{selectedQuote.clientEmail}</p>
                <p className="text-gray-600">{selectedQuote.clientPhone}</p>
              </div>
            </div>

            {/* Items table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-gray-500 uppercase tracking-wider">
                  <th className="py-2">Prestation & Agencement</th>
                  <th className="py-2">Cotes / Bois</th>
                  <th className="py-2 text-right">Montant (FCFA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium">
                <tr>
                  <td className="py-3">
                    <strong className="text-henrietz-walnut font-title">{selectedQuote.projectType}</strong>
                    <p className="text-[11px] text-gray-500 font-light">{selectedQuote.notes || 'Fourniture bois noble, découpe de précision atelier Abidjan & installation.'}</p>
                  </td>
                  <td className="py-3">
                    {selectedQuote.woodType}<br />
                    <span className="font-mono text-gray-500">{selectedQuote.dimensions.length}x{selectedQuote.dimensions.width}x{selectedQuote.dimensions.height} cm</span>
                  </td>
                  <td className="py-3 text-right font-title font-bold text-sm">
                    {adjustedPrice.toLocaleString('fr-FR')} FCFA
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total box */}
            <div className="flex justify-end pt-4 border-t border-gray-200 text-xs">
              <div className="w-64 space-y-1">
                <div className="flex justify-between text-base font-bold text-henrietz-walnut font-title border-t border-gray-300 pt-2">
                  <span>TOTAL ESTIMÉ :</span>
                  <span className="text-henrietz-oak">{adjustedPrice.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setPrintPreviewOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-bold text-xs rounded-xl tracking-wider"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl flex items-center gap-2 tracking-wider uppercase"
              >
                <Printer className="w-4 h-4" />
                Imprimer le Devis
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
