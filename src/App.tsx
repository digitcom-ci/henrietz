import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeaderHero } from './components/client/HeaderHero';
import { FurnitureCatalog } from './components/client/FurnitureCatalog';
import { QuoteBuilder } from './components/client/QuoteBuilder';
import { ClientPortal } from './components/client/ClientPortal';
import { CartDrawer } from './components/client/CartDrawer';
import { AuthModal } from './components/AuthModal';

import { AdminSidebar } from './components/admin/AdminSidebar';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { ProductManagement } from './components/admin/ProductManagement';
import { QuotesManagement } from './components/admin/QuotesManagement';
import { POSRegister } from './components/admin/POSRegister';
import { FinanceAccounting } from './components/admin/FinanceAccounting';
import { CRMContacts } from './components/admin/CRMContacts';
import { HRManagement } from './components/admin/HRManagement';
import { UserManagement } from './components/admin/UserManagement';
import { SiteSettingsComponent } from './components/admin/SiteSettings';
import { Phone, Mail, MapPin, Heart, Compass, ShieldCheck, Sparkles, AlertTriangle, ShieldAlert } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    activeAdminTab, 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthModalMode,
    siteSettings
  } = useApp();

  useEffect(() => {
    if (viewMode === 'admin' && (!currentUser || currentUser.role !== 'admin')) {
      setViewMode('client');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  }, [viewMode, currentUser]);

  return (
    <div className="min-h-screen bg-ivoire font-sans tracking-wider">
      
      {/* Site Closure Notification Banner for Visitors */}
      {viewMode !== 'admin' && siteSettings.siteStatus !== 'Ouvert' && (
        <div className={`px-4 py-3 border-b text-center font-sans text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md ${
          siteSettings.siteStatus === 'Fermeture Temporaire' 
            ? 'bg-amber-950 text-amber-100 border-amber-500/40' 
            : 'bg-red-950 text-red-100 border-red-500/40'
        }`}>
          {siteSettings.siteStatus === 'Fermeture Temporaire' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>
            <strong className="uppercase tracking-wider">
              {siteSettings.siteStatus === 'Fermeture Temporaire' ? 'Fermeture Temporaire Atelier & Boutique :' : 'Fermeture Définitive du Site :'}
            </strong>{' '}
            {siteSettings.closureMessage}
            {siteSettings.siteStatus === 'Fermeture Temporaire' && siteSettings.reopeningDate && (
              <span className="ml-1 text-amber-300 font-mono font-bold">
                • Réouverture prévue : {siteSettings.reopeningDate}
              </span>
            )}
          </span>
        </div>
      )}

      {viewMode === 'client' ? (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <HeaderHero />
            <FurnitureCatalog />
            <QuoteBuilder />

            {/* Footer Abidjan */}
            <footer id="contact" className="bg-cacao text-ivoire border-t border-sable/20 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <img 
                        src="/logo-henrietz-light.png" 
                        alt="Maison HENRIETZ" 
                        className="h-12 object-contain"
                      />
                    </div>
                    <p className="text-xs text-sable/80 font-light leading-relaxed tracking-wider">
                      Atelier d'ébénisterie d'art & agencement sur-mesure à Abidjan. Vente de mobilier contemporain et essences de bois nobles.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-title font-bold text-sm text-sable mb-4 tracking-wider">Showroom & Atelier Abidjan</h4>
                    <div className="space-y-2.5 text-xs text-sable/80 font-light tracking-wider">
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-terracotta shrink-0" /> {siteSettings.address}</p>
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-terracotta shrink-0" /> {siteSettings.phone} {siteSettings.phoneAlt && `/ ${siteSettings.phoneAlt}`}</p>
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-terracotta shrink-0" /> {siteSettings.email}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-title font-bold text-sm text-sable mb-4 tracking-wider">Savoir-Faire & Essences</h4>
                    <ul className="space-y-2 text-xs text-sable/80 font-light tracking-wider">
                      <li>• Noyer Noble, Iroko & Chêne sélection</li>
                      <li>• Dressings & Cuisines sur-mesure</li>
                      <li>• Découpe de panneaux à cotes exactes</li>
                      <li>• Traitement aux huiles naturelles bio</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-title font-bold text-sm text-sable mb-4 tracking-wider">Horaires Showroom</h4>
                    <p className="text-xs text-sable/80 font-light tracking-wider">Lundi - Vendredi : 08h00 - 18h30</p>
                    <p className="text-xs text-sable/80 font-light tracking-wider">Samedi : 09h00 - 17h00</p>
                    <div className="mt-4 pt-4 border-t border-sable/15 text-[11px] text-sable/60 font-light">
                      Livraison et installation dans tout Abidjan et intérieur de la Côte d'Ivoire.
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-sable/15 flex flex-col sm:flex-row justify-between items-center text-xs text-sable/60 gap-4 font-light">
                  <p>© 2026 {siteSettings.companyName}. Tous droits réservés.</p>
                  <div className="flex items-center gap-1">
                    <span>Façonné avec passion à Abidjan, Côte d'Ivoire</span>
                    <Heart className="w-3.5 h-3.5 text-terracotta fill-terracotta" />
                  </div>
                </div>
              </div>
            </footer>

            <CartDrawer />
          </main>
        </div>
      ) : viewMode === 'client-portal' ? (
        /* Dedicated Private Client Portal View */
        <div className="flex flex-col min-h-screen bg-ivoire">
          <Navbar />
          <main className="flex-1">
            <ClientPortal />

            {/* Footer Abidjan */}
            <footer id="contact" className="bg-cacao text-ivoire border-t border-sable/20 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <img 
                        src="/logo-henrietz-light.png" 
                        alt="Maison HENRIETZ" 
                        className="h-12 object-contain"
                      />
                    </div>
                    <p className="text-xs text-sable/80 font-light leading-relaxed tracking-wider">
                      Atelier d'ébénisterie d'art & agencement sur-mesure à Abidjan. Vente de mobilier contemporain et essences de bois nobles.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-title font-bold text-sm text-sable mb-4 tracking-wider">Showroom & Atelier Abidjan</h4>
                    <div className="space-y-2.5 text-xs text-sable/80 font-light tracking-wider">
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-terracotta shrink-0" /> {siteSettings.address}</p>
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-terracotta shrink-0" /> {siteSettings.phone}</p>
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-terracotta shrink-0" /> {siteSettings.email}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-title font-bold text-sm text-sable mb-4 tracking-wider">Savoir-Faire & Essences</h4>
                    <ul className="space-y-2 text-xs text-sable/80 font-light tracking-wider">
                      <li>• Noyer Noble, Iroko & Chêne sélection</li>
                      <li>• Dressings & Cuisines sur-mesure</li>
                      <li>• Découpe de panneaux à cotes exactes</li>
                      <li>• Traitement aux huiles naturelles bio</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-title font-bold text-sm text-sable mb-4 tracking-wider">Horaires Showroom</h4>
                    <p className="text-xs text-sable/80 font-light tracking-wider">Lundi - Vendredi : 08h00 - 18h30</p>
                    <p className="text-xs text-sable/80 font-light tracking-wider">Samedi : 09h00 - 17h00</p>
                    <div className="mt-4 pt-4 border-t border-sable/15 text-[11px] text-sable/60 font-light">
                      Livraison et installation dans tout Abidjan et intérieur de la Côte d'Ivoire.
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-sable/15 flex flex-col sm:flex-row justify-between items-center text-xs text-sable/60 gap-4 font-light">
                  <p>© 2026 {siteSettings.companyName}. Tous droits réservés.</p>
                  <div className="flex items-center gap-1">
                    <span>Façonné avec passion à Abidjan, Côte d'Ivoire</span>
                    <Heart className="w-3.5 h-3.5 text-terracotta fill-terracotta" />
                  </div>
                </div>
              </div>
            </footer>

            <CartDrawer />
          </main>
        </div>
      ) : (
        /* Admin ERP Interface Layout */
        <div className="flex h-screen overflow-hidden bg-gray-100/80">
          
          <AdminSidebar />

          <div className="flex-1 flex flex-col h-screen overflow-y-auto">
            
            {/* Admin Active Tab Content */}
            <main className="flex-1 p-6 md:p-8">
              {activeAdminTab === 'dashboard' && <DashboardOverview />}
              {activeAdminTab === 'products' && <ProductManagement />}
              {activeAdminTab === 'quotes' && <QuotesManagement />}
              {activeAdminTab === 'pos' && <POSRegister />}
              {activeAdminTab === 'finance' && <FinanceAccounting />}
              {activeAdminTab === 'crm' && <CRMContacts />}
              {activeAdminTab === 'hr' && <HRManagement />}
              {activeAdminTab === 'users' && <UserManagement />}
              {activeAdminTab === 'settings' && <SiteSettingsComponent />}
            </main>
          </div>

        </div>
      )}
      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;

