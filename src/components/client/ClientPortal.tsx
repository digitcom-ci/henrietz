import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PackageCheck, MessageSquare, Send, FileCheck, User as UserIcon, LogIn, 
  LayoutDashboard, Settings, MapPin, Phone, Mail, Clock, CheckCircle2, 
  ChevronRight, Sparkles, Truck, ShieldCheck, CreditCard, Edit3, Save, ArrowRight,
  Lock, KeyRound, Eye, EyeOff
} from 'lucide-react';

export const ClientPortal: React.FC = () => {
  const { 
    quotes, 
    orders, 
    contacts, 
    addContactMessage, 
    currentUser, 
    login,
    setIsAuthModalOpen, 
    setAuthModalMode,
    updateUserPassword,
    updateUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'quotes' | 'messages' | 'settings'>('dashboard');
  const [newMessageText, setNewMessageText] = useState('');

  // Editable Profile Settings State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Synchronize profile state when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
      setProfilePhone(currentUser.phone || '');
    } else {
      setProfileName('');
      setProfileEmail('');
      setProfilePhone('');
      setProfileAddress('');
      setProfileCity('');
    }
  }, [currentUser]);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (newPassword !== confirmPassword) {
      setPassError('Les deux nouveaux mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 4) {
      setPassError('Le mot de passe doit contenir au moins 4 caractères.');
      return;
    }

    const res = updateUserPassword(oldPassword, newPassword);
    if (!res.success) {
      setPassError(res.message);
    } else {
      setPassSuccess(res.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(null), 3000);
    }
  };

  // Filter user specific quotes and orders STRICTLY for logged in user
  const displayQuotes = currentUser 
    ? quotes.filter(q => q.clientEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  const displayOrders = currentUser
    ? orders.filter(o => o.clientEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  // Match contact for current logged in user
  const userContact = currentUser
    ? contacts.find(c => c.email.toLowerCase() === currentUser.email.toLowerCase())
    : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !currentUser) return;
    const targetContactId = userContact ? userContact.id : 'CRM-' + Date.now();
    addContactMessage(targetContactId, newMessageText, 'Client');
    setNewMessageText('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSaved(false);

    if (!currentUser) return;
    const res = updateUser(currentUser.id, {
      name: profileName.trim(),
      email: profileEmail.trim().toLowerCase(),
      phone: profilePhone.trim()
    });

    if (!res.success) {
      setProfileError(res.message);
    } else {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  const handleQuickDemoLogin = () => {
    login('client@henrietz.ci', 'client123');
  };

  return (
    <section id="client-portal" className="py-12 sm:py-16 bg-ivoire relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-6 text-center max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-widest text-terracotta font-bold block mb-0.5">
            MEUBLES & DÉCO • ESPACE SUIVI EXCLUSIF
          </span>
          <h2 className="font-title text-lg sm:text-xl lg:text-2xl font-bold text-cacao">
            Espace Personnel Client & Suivi Atelier
          </h2>
          <p className="text-charbon/80 text-[11px] sm:text-xs mt-1 font-light tracking-wider leading-relaxed">
            Gérez vos commandes, consultez vos devis d'ébénisterie sur-mesure et échangez en direct avec notre bureau d'études à Abidjan.
          </p>
        </div>

        {/* Non-Authenticated Invitation View */}
        {!currentUser ? (
          <div className="max-w-3xl mx-auto artistic-card rounded-3xl p-8 sm:p-12 text-center bg-cacao text-ivoire border border-cognac/30 shadow-2xl">
            <div className="w-16 h-16 bg-terracotta/20 border border-terracotta/40 rounded-full flex items-center justify-center mx-auto mb-4 text-sable">
              <UserIcon className="w-8 h-8 text-cognac" />
            </div>

            <span className="text-xs uppercase tracking-widest text-sable font-bold">
              ACCÈS COMPTE CLIENT PRIVILÉGIÉ
            </span>

            <h3 className="font-title text-2xl sm:text-3xl font-bold text-ivoire mt-2">
              Connectez-vous pour suivre vos devis & commandes
            </h3>

            <p className="text-sable/90 text-xs sm:text-sm mt-3 max-w-xl mx-auto font-light leading-relaxed tracking-wider">
              Accédez à votre historique d'achats de mobilier noble, téléchargez vos fiches techniques et communiquez directement avec nos maîtres ébénistes.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-terracotta to-cognac hover:from-cognac hover:to-terracotta text-ivoire font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-ivoire" />
                Se Connecter / S'inscrire
              </button>

              <button
                onClick={handleQuickDemoLogin}
                className="w-full sm:w-auto px-6 py-3 bg-charbon/80 hover:bg-charbon border border-sable/40 text-sable hover:text-ivoire font-semibold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cognac" />
                Accès Démo Client (Jean Kouassi)
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Client Dashboard */
          <div className="space-y-6">
            
            {/* Top User Welcome Banner */}
            <div className="bg-cacao text-ivoire p-6 sm:p-8 rounded-3xl border border-cognac/30 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-terracotta to-cognac text-ivoire font-title font-bold text-2xl flex items-center justify-center border border-sable/30 shadow-inner">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-title text-xl sm:text-2xl font-bold text-ivoire">{currentUser.name}</h3>
                    <span className="px-2.5 py-0.5 bg-terracotta/30 text-sable border border-terracotta/50 text-[10px] font-bold uppercase rounded-full tracking-wider">
                      Client Privilégié
                    </span>
                  </div>
                  <p className="text-xs text-sable/80 font-light mt-0.5 tracking-wider flex items-center gap-3">
                    <span>{currentUser.email}</span>
                    {currentUser.phone && <span>• {currentUser.phone}</span>}
                  </p>
                </div>
              </div>

              {/* Quick Summary Pill Stats */}
              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <div className="px-4 py-2.5 bg-charbon/60 border border-sable/20 rounded-2xl text-center shrink-0">
                  <span className="text-[10px] uppercase text-sable/60 tracking-wider block">Devis Actifs</span>
                  <span className="font-title font-bold text-base text-sable">{displayQuotes.length}</span>
                </div>
                <div className="px-4 py-2.5 bg-charbon/60 border border-sable/20 rounded-2xl text-center shrink-0">
                  <span className="text-[10px] uppercase text-sable/60 tracking-wider block">Commandes</span>
                  <span className="font-title font-bold text-base text-sable">{displayOrders.length}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-cognac/20">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-2 ${
                  activeTab === 'dashboard'
                    ? 'bg-terracotta text-ivoire shadow-md font-bold'
                    : 'bg-ivoire text-cacao hover:bg-sable/30 border border-cognac/20'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Tableau de Bord
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-2 ${
                  activeTab === 'orders'
                    ? 'bg-terracotta text-ivoire shadow-md font-bold'
                    : 'bg-ivoire text-cacao hover:bg-sable/30 border border-cognac/20'
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                Commandes & Achats ({displayOrders.length})
              </button>

              <button
                onClick={() => setActiveTab('quotes')}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-2 ${
                  activeTab === 'quotes'
                    ? 'bg-terracotta text-ivoire shadow-md font-bold'
                    : 'bg-ivoire text-cacao hover:bg-sable/30 border border-cognac/20'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                Devis Sur-Mesure ({displayQuotes.length})
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-2 ${
                  activeTab === 'messages'
                    ? 'bg-terracotta text-ivoire shadow-md font-bold'
                    : 'bg-ivoire text-cacao hover:bg-sable/30 border border-cognac/20'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Messagerie Atelier
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'bg-terracotta text-ivoire shadow-md font-bold'
                    : 'bg-ivoire text-cacao hover:bg-sable/30 border border-cognac/20'
                }`}
              >
                <Settings className="w-4 h-4" />
                Profil & Paramètres
              </button>
            </div>

            {/* TAB CONTENT 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Project Highlight */}
                <div className="lg:col-span-2 artistic-card rounded-3xl p-6 border border-cognac/30 bg-ivoire">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-title font-bold text-base text-cacao flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-terracotta" />
                      Dernier Devis d'Aménagement Soumis
                    </h4>
                    <button 
                      onClick={() => setActiveTab('quotes')}
                      className="text-xs text-terracotta font-bold hover:underline flex items-center gap-1"
                    >
                      Voir tous →
                    </button>
                  </div>

                  {displayQuotes[0] ? (
                    <div className="p-4 bg-cacao text-ivoire rounded-2xl border border-sable/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-xs text-sable font-bold">{displayQuotes[0].id}</span>
                          <h5 className="font-bold text-base text-ivoire mt-0.5">{displayQuotes[0].projectType}</h5>
                          <p className="text-xs text-sable/80 font-light mt-1">
                            Essence : <strong className="text-sable">{displayQuotes[0].woodType}</strong> ({displayQuotes[0].dimensions.length} x {displayQuotes[0].dimensions.width} x {displayQuotes[0].dimensions.height} cm)
                          </p>
                        </div>

                        <span className="px-3 py-1 bg-terracotta/90 text-ivoire text-[10px] font-bold uppercase rounded-full">
                          {displayQuotes[0].status}
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-sable/15 flex justify-between items-center text-xs">
                        <span className="text-sable/70">Estimation : <strong className="text-sable font-title font-bold text-base">{displayQuotes[0].estimatedPrice.toLocaleString('fr-FR')} FCFA</strong></span>
                        <span className="text-sable/50 font-mono text-[11px]">{displayQuotes[0].date}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-charbon/70 py-6 text-center">Aucun devis soumis pour le moment.</p>
                  )}

                  {/* Quick Shortcut Buttons */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href="#devis-builder"
                      className="p-3.5 bg-ivoire border border-cognac/30 rounded-2xl hover:border-terracotta transition flex items-center gap-3 group"
                    >
                      <div className="p-2 bg-terracotta/15 text-terracotta rounded-xl group-hover:bg-terracotta group-hover:text-ivoire transition">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-title font-bold text-xs text-cacao">Nouveau Devis Sur-Mesure</h5>
                        <p className="text-[10px] text-charbon/70 font-light">Calculateur de dimensions FCFA</p>
                      </div>
                    </a>

                    <a
                      href="#catalogue"
                      className="p-3.5 bg-ivoire border border-cognac/30 rounded-2xl hover:border-terracotta transition flex items-center gap-3 group"
                    >
                      <div className="p-2 bg-cognac/15 text-cognac rounded-xl group-hover:bg-cognac group-hover:text-ivoire transition">
                        <PackageCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-title font-bold text-xs text-cacao">Explorer la Collection</h5>
                        <p className="text-[10px] text-charbon/70 font-light">Mobilier d'art contemporain</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Delivery & Account Summary Card */}
                <div className="space-y-6">
                  <div className="artistic-card rounded-3xl p-6 border border-cognac/30 bg-ivoire">
                    <h4 className="font-title font-bold text-base text-cacao mb-3 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-terracotta" />
                      Adresse de Livraison Définie
                    </h4>
                    <p className="text-xs text-charbon/80 font-light leading-relaxed">
                      {profileAddress ? `${profileAddress}${profileCity ? `, ${profileCity}` : ''}` : 'Aucune adresse renseignée pour le moment. Vous pouvez ajouter votre adresse dans l\'onglet Profil & Paramètres.'}
                    </p>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="mt-3 text-xs text-terracotta font-bold hover:underline flex items-center gap-1"
                    >
                      Modifier mon profil →
                    </button>
                  </div>

                  <div className="artistic-card rounded-3xl p-6 border border-cognac/30 bg-charbon text-ivoire">
                    <h4 className="font-title font-bold text-sm text-sable mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-terracotta" />
                      Garantie & Engagement HENRIETZ
                    </h4>
                    <p className="text-xs text-sable/80 font-light leading-relaxed">
                      Chaque meuble est garanti 20 ans. Assistance directe avec notre ébéniste référent.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: ORDERS & PURCHASES */}
            {activeTab === 'orders' && (
              <div className="artistic-card rounded-3xl p-6 border border-cognac/30 bg-ivoire space-y-6">
                <div className="flex justify-between items-center border-b border-cognac/20 pb-4">
                  <h3 className="font-title font-bold text-lg text-cacao flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-terracotta" />
                    Historique des Commandes Boutique
                  </h3>
                  <span className="text-xs bg-terracotta/15 text-terracotta px-3 py-1 rounded-full font-bold">
                    {displayOrders.length} commande(s)
                  </span>
                </div>

                <div className="space-y-4">
                  {displayOrders.length > 0 ? (
                    displayOrders.map(order => (
                      <div key={order.id} className="p-5 rounded-2xl border border-cognac/25 bg-ivoire/80 hover:border-cognac transition shadow-xs">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-cognac/15">
                          <div>
                            <span className="font-mono text-xs text-terracotta font-bold">{order.id}</span>
                            <span className="text-xs text-cognac font-mono ml-3">Date : {order.date}</span>
                          </div>
                          <span className="px-3 py-1 bg-emerald-900/20 text-emerald-800 border border-emerald-600/30 text-[10px] font-bold uppercase rounded-full">
                            {order.orderStatus}
                          </span>
                        </div>

                        {/* Order Timeline Progress Stepper */}
                        <div className="py-4 my-2 border-b border-cognac/15">
                          <span className="text-[10px] uppercase text-cognac font-bold block mb-2 tracking-wider">Étape de Livraison :</span>
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                            <div className={`p-2 rounded-lg border ${order.orderStatus === 'Nouvelle' ? 'bg-terracotta text-ivoire font-bold' : 'bg-sable/20 text-charbon'}`}>
                              1. Confirmée
                            </div>
                            <div className={`p-2 rounded-lg border ${order.orderStatus === 'En production' ? 'bg-terracotta text-ivoire font-bold' : 'bg-sable/20 text-charbon'}`}>
                              2. Fabrication
                            </div>
                            <div className={`p-2 rounded-lg border ${order.orderStatus === 'Prêt à livrer' ? 'bg-terracotta text-ivoire font-bold' : 'bg-sable/20 text-charbon'}`}>
                              3. Prêt Livrer
                            </div>
                            <div className={`p-2 rounded-lg border ${order.orderStatus === 'Livrée' ? 'bg-emerald-800 text-ivoire font-bold' : 'bg-sable/20 text-charbon'}`}>
                              4. Livré Abidjan
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2 pt-2">
                          {order.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-xs">
                              <span className="text-cacao font-medium">• {item.name} (x{item.quantity})</span>
                              <span className="font-title font-bold text-terracotta">{(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-cognac/15 flex justify-between items-center text-xs font-bold text-cacao">
                          <span>Total de la commande :</span>
                          <span className="font-title text-base text-terracotta">{order.totalAmount.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-ivoire/60 rounded-2xl border border-cognac/20">
                      <PackageCheck className="w-10 h-10 text-terracotta/40 mx-auto mb-2" />
                      <p className="font-title font-bold text-sm text-cacao">Aucune commande effectuée</p>
                      <p className="text-xs text-charbon/70 font-light mt-1 max-w-sm mx-auto">
                        Vous n'avez pas encore passé de commande sur notre boutique en ligne. Parcourez notre catalogue d'artisanat d'art pour effectuer votre premier achat.
                      </p>
                      <a href="#catalogue" className="mt-4 inline-block px-4 py-2 bg-terracotta text-ivoire font-bold text-xs rounded-xl hover:bg-cognac transition shadow uppercase tracking-wider">
                        Découvrir le Catalogue
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: QUOTES & CUSTOM PROJECTS */}
            {activeTab === 'quotes' && (
              <div className="artistic-card rounded-3xl p-6 border border-cognac/30 bg-ivoire space-y-6">
                <div className="flex justify-between items-center border-b border-cognac/20 pb-4">
                  <h3 className="font-title font-bold text-lg text-cacao flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-terracotta" />
                    Projets & Devis d'Agencement Sur-Mesure
                  </h3>
                  <a 
                    href="#devis-builder" 
                    className="px-4 py-1.5 bg-terracotta text-ivoire font-bold text-xs rounded-xl hover:bg-cognac transition shadow"
                  >
                    + Nouveau Devis
                  </a>
                </div>

                <div className="space-y-4">
                  {displayQuotes.length > 0 ? (
                    displayQuotes.map(quote => (
                      <div key={quote.id} className="p-5 rounded-2xl border border-cognac/25 bg-ivoire/80 shadow-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs text-terracotta font-bold">{quote.id}</span>
                            <h4 className="font-title font-bold text-base text-cacao">{quote.projectType}</h4>
                            <p className="text-xs text-charbon/80 font-light mt-1">
                              Boisserie / Essence : <strong className="text-cacao font-semibold">{quote.woodType}</strong>
                            </p>
                            <p className="text-xs text-charbon/70 font-mono mt-0.5">
                              Dimensions : {quote.dimensions.length}cm (L) x {quote.dimensions.width}cm (P) x {quote.dimensions.height}cm (H)
                            </p>
                          </div>

                          <span className="px-3 py-1 bg-terracotta/90 text-ivoire text-[10px] font-bold uppercase rounded-full">
                            {quote.status}
                          </span>
                        </div>

                        {quote.notes && (
                          <div className="mt-3 p-3 bg-sable/20 rounded-xl text-xs text-cacao font-light border border-sable/30">
                            <strong>Note de votre projet :</strong> {quote.notes}
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-cognac/15 flex justify-between items-center text-xs">
                          <span className="text-charbon/80">Estimation indicative : <strong className="text-cacao font-title font-bold text-base">{quote.estimatedPrice.toLocaleString('fr-FR')} FCFA</strong></span>
                          <span className="text-cognac font-mono text-[11px]">{quote.date}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-ivoire/60 rounded-2xl border border-cognac/20">
                      <FileCheck className="w-10 h-10 text-terracotta/40 mx-auto mb-2" />
                      <p className="font-title font-bold text-sm text-cacao">Aucune demande de devis enregistrée</p>
                      <p className="text-xs text-charbon/70 font-light mt-1 max-w-sm mx-auto">
                        Vous n'avez soumis aucun projet d'agencement sur-mesure pour le moment. Utilisez notre configurateur en ligne pour obtenir une estimation instantanée.
                      </p>
                      <a href="#devis-builder" className="mt-4 inline-block px-4 py-2 bg-terracotta text-ivoire font-bold text-xs rounded-xl hover:bg-cognac transition shadow uppercase tracking-wider">
                        Créer un Devis Sur-Mesure
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: ATELIER MESSAGING */}
            {activeTab === 'messages' && (
              <div className="bg-charbon text-ivoire rounded-3xl p-6 shadow-xl border border-cognac/40 flex flex-col h-[560px]">
                <div className="pb-4 border-b border-sable/20 flex justify-between items-center">
                  <div>
                    <h3 className="font-title font-bold text-lg text-ivoire flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-terracotta" />
                      Messagerie Directe Atelier HENRIETZ
                    </h3>
                    <p className="text-xs text-sable/80 font-light tracking-wider">
                      Échangez avec nos ébénistes et dessinateurs d'intérieur à Abidjan
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[11px] text-emerald-400 font-semibold">Bureau d'études en ligne</span>
                  </div>
                </div>

                {/* Chat Messages List */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3 font-sans">
                  {userContact && userContact.messages.length > 0 ? (
                    userContact.messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${
                          msg.sender === 'Client' ? 'ml-auto items-end' : 'mr-auto items-start'
                        }`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed tracking-wider ${
                            msg.sender === 'Client'
                              ? 'bg-terracotta text-ivoire rounded-br-none shadow'
                              : 'bg-cacao text-sable border border-sable/30 rounded-bl-none'
                          }`}
                        >
                          <p className="font-semibold mb-1 text-[10px] opacity-80">
                            {msg.sender === 'Client' ? 'Vous' : 'Maison HENRIETZ'}
                          </p>
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-sable/50 mt-1 font-mono">{msg.date}</span>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-sable/60">
                      <MessageSquare className="w-10 h-10 text-terracotta/40 mb-2" />
                      <p className="text-xs font-semibold text-ivoire">Aucun message pour le moment</p>
                      <p className="text-[11px] font-light max-w-xs mt-1 text-sable/70">
                        Posez votre première question à notre bureau d'études ci-dessous pour discuter de vos projets d'ébénisterie.
                      </p>
                    </div>
                  )}
                </div>

                {/* Send Input */}
                <form onSubmit={handleSendMessage} className="pt-3 border-t border-sable/20 flex gap-2">
                  <input
                    type="text"
                    placeholder="Posez votre question à l'ébéniste..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-cacao/70 border border-sable/30 rounded-xl text-xs text-ivoire placeholder-sable/50 focus:outline-none focus:ring-2 focus:ring-terracotta tracking-wider"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-terracotta text-ivoire hover:bg-cognac font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5 uppercase"
                  >
                    <span>Envoyer</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT 5: PROFILE & SETTINGS */}
            {activeTab === 'settings' && (
              <div className="artistic-card rounded-3xl p-6 sm:p-8 border border-cognac/30 bg-ivoire max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cognac/20">
                  <div className="p-3 bg-terracotta/15 text-terracotta rounded-2xl">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-title font-bold text-lg text-cacao">Paramètres du Compte Client</h3>
                    <p className="text-xs text-charbon/70 font-light">Mettez à jour vos coordonnées et adresses à Abidjan</p>
                  </div>
                </div>

                {profileError && (
                  <div className="mb-4 p-3 bg-red-950/20 border border-red-600/40 rounded-xl text-xs text-red-900 font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{profileError}</span>
                  </div>
                )}

                {profileSaved && (
                  <div className="mb-4 p-3 bg-emerald-900/20 border border-emerald-600/40 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Profil mis à jour avec succès !
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-cacao uppercase mb-1 tracking-wider">Nom Complet</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-ivoire border border-cognac/30 rounded-xl text-xs text-charbon focus:outline-none focus:ring-2 focus:ring-terracotta"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-cacao uppercase mb-1 tracking-wider">Email</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-ivoire border border-cognac/30 rounded-xl text-xs text-charbon focus:outline-none focus:ring-2 focus:ring-terracotta"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-cacao uppercase mb-1 tracking-wider">Téléphone</label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-ivoire border border-cognac/30 rounded-xl text-xs text-charbon focus:outline-none focus:ring-2 focus:ring-terracotta"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-cacao uppercase mb-1 tracking-wider">Adresse de Livraison Abidjan</label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-ivoire border border-cognac/30 rounded-xl text-xs text-charbon focus:outline-none focus:ring-2 focus:ring-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-cacao uppercase mb-1 tracking-wider">Ville / Pays</label>
                    <input
                      type="text"
                      value={profileCity}
                      onChange={(e) => setProfileCity(e.target.value)}
                      className="w-full px-4 py-2.5 bg-ivoire border border-cognac/30 rounded-xl text-xs text-charbon focus:outline-none focus:ring-2 focus:ring-terracotta"
                    />
                  </div>

                  <div className="pt-4 border-t border-cognac/20 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-terracotta text-ivoire font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:bg-cognac transition flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>

                {/* Password & Security Card */}
                <div className="mt-10 pt-8 border-t border-cognac/20">
                  <div className="flex items-center gap-3 mb-6 pb-2">
                    <div className="p-2.5 bg-cognac/15 text-cognac rounded-xl">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-title font-bold text-base text-cacao">Sécurité & Mot de Passe</h4>
                      <p className="text-[11px] text-charbon/70 font-light">Modifiez le mot de passe d'accès à votre Espace Client</p>
                    </div>
                  </div>

                  {passError && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/40 rounded-xl text-xs text-red-800 font-semibold">
                      {passError}
                    </div>
                  )}

                  {passSuccess && (
                    <div className="mb-4 p-3 bg-emerald-900/20 border border-emerald-600/40 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {passSuccess}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-cacao uppercase mb-1 tracking-wider">Mot de Passe Actuel</label>
                      <div className="relative">
                        <input
                          type={showOldPass ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full pl-4 pr-10 py-2.5 bg-ivoire border border-cognac/30 rounded-xl text-xs text-charbon focus:outline-none focus:ring-2 focus:ring-terracotta"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPass(!showOldPass)}
                          className="absolute right-3 top-3 text-cacao/50 hover:text-cacao transition"
                          title={showOldPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-cacao uppercase mb-1 tracking-wider">Nouveau Mot de Passe</label>
                        <div className="relative">
                          <input
                            type={showNewPass ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-ivoire border border-cognac/30 rounded-xl text-xs text-charbon focus:outline-none focus:ring-2 focus:ring-terracotta"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-3 top-3 text-cacao/50 hover:text-cacao transition"
                            title={showNewPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                          >
                            {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-cacao uppercase mb-1 tracking-wider">Confirmer le Nouveau Mot de Passe</label>
                        <div className="relative">
                          <input
                            type={showConfirmPass ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-ivoire border border-cognac/30 rounded-xl text-xs text-charbon focus:outline-none focus:ring-2 focus:ring-terracotta"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3 top-3 text-cacao/50 hover:text-cacao transition"
                            title={showConfirmPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                          >
                            {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-charbon hover:bg-cacao text-ivoire font-bold text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center gap-2 border border-sable/30"
                      >
                        <Lock className="w-3.5 h-3.5 text-sable" />
                        Changer mon mot de passe
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
