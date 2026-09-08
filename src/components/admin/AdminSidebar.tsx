import React, { useState } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import { 
  LayoutDashboard, Package, FileCheck, ShoppingCart, 
  Users, DollarSign, UserCheck, Compass, Menu, X, Settings, Shield 
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { activeAdminTab, setActiveAdminTab, setViewMode } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Tableau de Bord Exécutif', icon: LayoutDashboard },
    { id: 'products', label: 'Produits, Bois & Stocks', icon: Package },
    { id: 'quotes', label: 'Devis Client & Aménagement', icon: FileCheck },
    { id: 'pos', label: 'Caisse POS (Vente Directe)', icon: ShoppingCart },
    { id: 'finance', label: 'Finance & Comptabilité', icon: DollarSign },
    { id: 'crm', label: 'CRM & Messagerie Client', icon: Users },
    { id: 'hr', label: 'Gestion Employés (RH)', icon: UserCheck },
    { id: 'users', label: 'Gestion Utilisateurs (Accès)', icon: Shield },
    { id: 'settings', label: 'Paramètres & Fermeture Site', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-3 bg-henrietz-walnut text-henrietz-gold rounded-full border border-henrietz-gold/40 shadow-2xl flex items-center justify-center"
          aria-label="Toggle Sidebar"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay Backdrop for Mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" 
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-henrietz-walnut text-white border-r border-henrietz-gold/20 flex flex-col shrink-0 h-screen shadow-2xl transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Header Logo & ERP Badge */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-henrietz-dark shrink-0">
          <div className="flex items-center">
            <img 
              src="/logo-henrietz-light.png" 
              alt="Maison HENRIETZ ERP" 
              className="h-8 object-contain"
            />
          </div>
          <span className="text-[8px] uppercase px-2 py-0.5 rounded-full bg-henrietz-gold/20 text-henrietz-gold font-mono font-bold border border-henrietz-gold/30">
            v2.4
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <span className="text-[9px] uppercase font-bold tracking-widest text-henrietz-gold/70 px-3 block mb-2">
            Menu ERP
          </span>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeAdminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveAdminTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-henrietz-gold via-[#D4AF37] to-henrietz-oak text-henrietz-dark font-bold shadow-md transform translate-x-1'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-henrietz-dark' : 'text-henrietz-gold'}`} />
                <span className="text-left truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Switch Button */}
        <div className="p-3 border-t border-white/10 bg-henrietz-dark shrink-0">
          <button
            onClick={() => setViewMode('client')}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] font-semibold rounded-xl flex items-center justify-center gap-2 transition border border-white/15 shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-henrietz-gold" />
            Voir Site Client
          </button>
        </div>
      </aside>
    </>
  );
};
