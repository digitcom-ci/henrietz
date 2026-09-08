import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, FileCheck, ShoppingBag, AlertTriangle, 
  ArrowUpRight 
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { quotes, products, financialRecords, posTransactions, setActiveAdminTab } = useApp();

  // Metrics calculations
  const totalRevenue = financialRecords
    .filter(r => r.type === 'Recette')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpenses = financialRecords
    .filter(r => r.type === 'Dépense')
    .reduce((sum, r) => sum + r.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  const pendingQuotesCount = quotes.filter(q => q.status === 'En attente' || q.status === 'Étude en cours').length;
  const lowStockProducts = products.filter(p => p.stock <= 2);
  const posSalesTodayTotal = posTransactions.reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-henrietz-walnut text-white p-4 sm:p-5 rounded-2xl border border-henrietz-gold/30 shadow-lg">
        <div>
          <span className="text-[10px] text-henrietz-gold font-mono uppercase tracking-widest block mb-0.5">
            Maison HENRIETZ • Abidjan Côte d'Ivoire
          </span>
          <h2 className="font-title text-lg sm:text-xl font-bold">
            Tableau de Bord Exécutif (FCFA)
          </h2>
          <p className="text-[11px] text-gray-300 mt-0.5 font-normal tracking-wide">
            Vue synthétique des activités e-commerce, devis aménagement, caisse showroom Abidjan et comptabilité.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveAdminTab('pos')}
            className="px-3.5 py-2 bg-gradient-to-r from-henrietz-gold to-henrietz-oak text-henrietz-dark font-bold text-[11px] rounded-lg shadow hover:brightness-110 transition uppercase tracking-wide"
          >
            Caisse POS Abidjan
          </button>
          <button
            onClick={() => setActiveAdminTab('quotes')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] border border-white/20 rounded-lg transition tracking-wide uppercase"
          >
            Devis ({pendingQuotesCount})
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Chiffre d'Affaires */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Chiffre d'Affaires Total</span>
            <div className="p-2.5 bg-amber-50 text-henrietz-oak rounded-2xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-title font-bold text-2xl text-henrietz-walnut">
              {totalRevenue.toLocaleString('fr-FR')} FCFA
            </h3>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-4 h-4" />
              <span>Résultat net : +{netProfit.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Devis Aménagement */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Devis en Attente</span>
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-title font-bold text-3xl text-henrietz-walnut">
              {pendingQuotesCount}
            </h3>
            <p className="text-xs text-gray-500 mt-1 tracking-wider">
              Sur {quotes.length} dossiers au total
            </p>
          </div>
        </div>

        {/* KPI 3: Ventes Caisse POS */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Ventes Caisse Showroom</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-title font-bold text-2xl text-henrietz-walnut">
              {posSalesTodayTotal.toLocaleString('fr-FR')} FCFA
            </h3>
            <p className="text-xs text-gray-500 mt-1 tracking-wider">
              {posTransactions.length} reçus émis
            </p>
          </div>
        </div>

        {/* KPI 4: Stocks & Alerte */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Alertes Stock Bois/Meubles</span>
            <div className="p-2.5 bg-red-50 text-red-600 rounded-2xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-title font-bold text-3xl text-henrietz-walnut">
              {lowStockProducts.length}
            </h3>
            <p className="text-xs text-red-600 font-semibold mt-1 tracking-wider">
              {lowStockProducts.length > 0 ? 'Réapprovisionnement atelier' : 'Stocks OK'}
            </p>
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Quotes List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 className="font-title font-bold text-base text-henrietz-walnut flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-henrietz-gold" />
              Dernières Demandes de Devis (Abidjan)
            </h3>
            <button
              onClick={() => setActiveAdminTab('quotes')}
              className="text-xs text-henrietz-oak font-bold hover:underline uppercase tracking-wider"
            >
              Voir Tout
            </button>
          </div>

          <div className="space-y-3">
            {quotes.slice(0, 4).map(quote => (
              <div key={quote.id} className="p-4 rounded-2xl border border-gray-100 bg-[#FAF6F0] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-henrietz-oak font-bold">{quote.id}</span>
                    <span className="text-xs font-bold text-henrietz-walnut">{quote.clientName}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 tracking-wider font-light">
                    {quote.projectType} • <span className="text-henrietz-oak font-medium">{quote.woodType}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-title font-bold text-sm text-henrietz-walnut block">
                    {quote.estimatedPrice.toLocaleString('fr-FR')} FCFA
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    quote.status === 'Validé' ? 'bg-emerald-100 text-emerald-800' :
                    quote.status === 'Devis Transmis' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {quote.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent POS / Orders Widget */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 className="font-title font-bold text-base text-henrietz-walnut flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-henrietz-oak" />
              Dernières Ventes Showroom & Web
            </h3>
            <button
              onClick={() => setActiveAdminTab('pos')}
              className="text-xs text-henrietz-oak font-bold hover:underline uppercase tracking-wider"
            >
              Caisse
            </button>
          </div>

          <div className="space-y-3">
            {posTransactions.slice(0, 3).map(tx => (
              <div key={tx.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-bold text-gray-700">{tx.ticketNo}</span>
                  <p className="text-[11px] text-gray-500 mt-0.5 tracking-wider">
                    {tx.items.length} articles • <strong className="text-gray-700">{tx.paymentMethod}</strong>
                  </p>
                </div>
                <span className="font-title font-bold text-sm text-emerald-700">
                  +{tx.total.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 text-center">
            <button
              onClick={() => setActiveAdminTab('finance')}
              className="w-full py-3 bg-henrietz-walnut text-henrietz-gold text-xs rounded-xl font-bold hover:bg-henrietz-oak transition uppercase tracking-wider"
            >
              Consulter le Bilan Financier Détaillé
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
