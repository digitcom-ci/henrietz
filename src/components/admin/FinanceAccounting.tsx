import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FinancialRecord } from '../../types';
import { DollarSign, ArrowUpRight, ArrowDownRight, Plus, PieChart } from 'lucide-react';

export const FinanceAccounting: React.FC = () => {
  const { financialRecords, addFinancialRecord } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [type, setType] = useState<'Recette' | 'Dépense'>('Dépense');
  const [category, setCategory] = useState<FinancialRecord['category']>('Achat Matières Premières');
  const [amount, setAmount] = useState<number>(350000);
  const [description, setDescription] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

  const totalInflows = financialRecords
    .filter(r => r.type === 'Recette')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalOutflows = financialRecords
    .filter(r => r.type === 'Dépense')
    .reduce((sum, r) => sum + r.amount, 0);

  const netBalance = totalInflows - totalOutflows;

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    addFinancialRecord({
      type,
      category,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      description,
      referenceNo: referenceNo || 'REF-' + Date.now().toString().slice(-4)
    });

    setIsAddModalOpen(false);
    setDescription('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-title text-lg font-bold text-henrietz-walnut flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-henrietz-gold" />
            Module Finance & Comptabilité (FCFA Abidjan)
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5 font-normal tracking-wide">
            Suivi des flux financiers de l'atelier HENRIETZ en FCFA, bilans comptables des ventes de meubles et dépenses en matières premières.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-semibold text-[11px] rounded-lg shadow-sm flex items-center gap-1.5 transition uppercase tracking-wide"
        >
          <Plus className="w-4 h-4" />
          Saisir une Dépense / Recette
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Recettes Totales (Encaissements FCFA)</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-title font-bold text-2xl text-emerald-700 mt-4">
            +{totalInflows.toLocaleString('fr-FR')} FCFA
          </h3>
          <p className="text-xs text-gray-400 mt-1 tracking-wider">Devis aménagement & ventes boutique Abidjan</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Dépenses & Charges (FCFA)</span>
            <div className="p-2 bg-red-50 text-red-700 rounded-xl">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-title font-bold text-2xl text-red-600 mt-4">
            -{totalOutflows.toLocaleString('fr-FR')} FCFA
          </h3>
          <p className="text-xs text-gray-400 mt-1 tracking-wider">Achats bois, salaires et outillage</p>
        </div>

        <div className="bg-henrietz-walnut text-white p-6 rounded-3xl border border-henrietz-gold/40 shadow-xl">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-semibold text-henrietz-gold uppercase tracking-wider">Solde Net Trésorerie</span>
            <div className="p-2 bg-white/10 text-white rounded-xl">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <h3 className="font-title font-bold text-2xl text-white mt-4">
            {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString('fr-FR')} FCFA
          </h3>
          <p className="text-xs text-gray-300 mt-1 tracking-wider font-light">Résultat d'exploitation consolidé</p>
        </div>

      </div>

      {/* Journal Transactions Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-[#FAF6F0] border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-title font-bold text-base text-henrietz-walnut">Journal Comptable des Flux FCFA</h3>
          <span className="text-xs font-mono text-gray-500">{financialRecords.length} écritures</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="p-4">Réf / Date</th>
                <th className="p-4">Type</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Description / Libellé</th>
                <th className="p-4 text-right">Montant (FCFA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {financialRecords.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <span className="font-mono font-bold text-henrietz-oak block">{r.referenceNo}</span>
                    <span className="text-[11px] text-gray-400 font-mono">{r.date}</span>
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      r.type === 'Recette' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {r.type}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-gray-700 uppercase tracking-wider">
                    {r.category}
                  </td>

                  <td className="p-4 text-gray-600 font-light tracking-wider">
                    {r.description}
                  </td>

                  <td className={`p-4 text-right font-title font-bold text-sm ${
                    r.type === 'Recette' ? 'text-emerald-700' : 'text-red-600'
                  }`}>
                    {r.type === 'Recette' ? '+' : '-'}{r.amount.toLocaleString('fr-FR')} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-henrietz-gold/40">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="font-title font-bold text-xl text-henrietz-walnut">Saisie d'une Opération Comptable</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleAddTransaction} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type d'opération</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  >
                    <option value="Dépense">Dépense (-)</option>
                    <option value="Recette">Recette (+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  >
                    <option value="Achat Matières Premières">Achat Matières Premières</option>
                    <option value="Salaires">Salaires & Charges</option>
                    <option value="Charges Atelier">Charges Atelier / Loyer</option>
                    <option value="Outillage">Outillage & Équipement</option>
                    <option value="Vente Boutique">Vente Boutique</option>
                    <option value="Devis Aménagement">Devis Aménagement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Montant FCFA *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Numéro Référence / Facture</label>
                  <input
                    type="text"
                    placeholder="Ex: FAC-SCIERIE-ABJ"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description / Libellé de l'écriture</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Achat de bois d'Iroko auprès de la scierie d'Abidjan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full py-3 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl hover:bg-henrietz-oak uppercase tracking-wider"
                >
                  Enregistrer l'Écriture Comptable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
