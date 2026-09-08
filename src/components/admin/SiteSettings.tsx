import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SiteSettings as ISiteSettings } from '../../types';
import { 
  Settings, Power, AlertTriangle, ShieldAlert, CheckCircle2, 
  Building2, Phone, Mail, MapPin, DollarSign, Save, Sparkles, Sliders,
  Key, Lock, UserCheck, Shield, Eye, EyeOff
} from 'lucide-react';

export const SiteSettingsComponent: React.FC = () => {
  const { siteSettings, updateSiteSettings, currentUser, updateUser, updateUserPassword } = useApp();

  const [formData, setFormData] = useState<ISiteSettings>({ ...siteSettings });
  const [feedback, setFeedback] = useState<string | null>(null);

  // Admin Profile Credentials State
  const [adminName, setAdminName] = useState(currentUser?.name || 'Direction HENRIETZ');
  const [adminEmail, setAdminEmail] = useState(currentUser?.email || 'admin@henrietz.ci');
  const [adminPhone, setAdminPhone] = useState(currentUser?.phone || '+225 27 21 00 00 00');
  
  // Password modification state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    setFeedback('Les paramètres du site et le statut de fermeture ont été mis à jour avec succès !');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUser(currentUser.id, {
      name: adminName.trim(),
      email: adminEmail.trim().toLowerCase(),
      phone: adminPhone.trim()
    });
    setProfileFeedback({ type: 'success', message: 'Vos identifiants de profil administrateur ont été enregistrés.' });
    setTimeout(() => setProfileFeedback(null), 4000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'La confirmation du mot de passe ne correspond pas.' });
      return;
    }
    const res = updateUserPassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordFeedback({ type: 'success', message: 'Mot de passe mis à jour avec succès !' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setPasswordFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-title text-lg font-bold text-henrietz-walnut flex items-center gap-2">
              <Settings className="w-5 h-5 text-henrietz-gold" />
              Paramètres du Site, Identifiants & Contrôle de Fermeture ERP
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              formData.siteStatus === 'Ouvert' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              formData.siteStatus === 'Fermeture Temporaire' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
              'bg-red-100 text-red-900 border border-red-300'
            }`}>
              Statut : {formData.siteStatus.toUpperCase()}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5 font-normal tracking-wide">
            Gérez vos identifiants administrateur, les coordonnées officielles, la devise, les taux de TVA et activez la fermeture temporaire ou définitive du site.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2.5 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-semibold text-xs rounded-xl shadow-md flex items-center gap-2 transition uppercase tracking-wide shrink-0"
        >
          <Save className="w-4 h-4" />
          Enregistrer Tout
        </button>
      </div>

      {/* Success Notification */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center justify-between text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}

      {/* SECTION: GESTION DES IDENTIFIANTS ADMINISTRATEUR (CREDENTIALS) */}
      <div className="bg-white p-6 rounded-3xl border border-henrietz-gold/40 shadow-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="font-title font-bold text-base text-henrietz-walnut flex items-center gap-2">
            <Shield className="w-5 h-5 text-henrietz-gold" />
            Gestion des Identifiants & Sécurité du Compte Administrateur
          </h3>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold font-mono">
            Compte : {currentUser?.email || 'admin@henrietz.ci'}
          </span>
        </div>

        {/* Admin Profile Form */}
        <form onSubmit={handleUpdateAdminProfile} className="space-y-4">
          <h4 className="font-title font-bold text-xs text-henrietz-walnut uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-henrietz-gold" />
            1. Informations de Profil Administrateur
          </h4>

          {profileFeedback && (
            <div className={`p-3.5 rounded-xl border text-xs font-semibold ${
              profileFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-red-50 text-red-900 border-red-300'
            }`}>
              {profileFeedback.message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nom Administrateur *</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Identifiant Email de Connexion *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Numéro de Téléphone Contact</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-bold text-xs rounded-xl shadow transition uppercase tracking-wide"
            >
              Mettre à Jour le Profil Admin
            </button>
          </div>
        </form>

        <hr className="border-gray-100" />

        {/* Admin Password Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <h4 className="font-title font-bold text-xs text-henrietz-walnut uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-4 h-4 text-henrietz-gold" />
            2. Modification du Mot de Passe de Connexion Admin
          </h4>

          {passwordFeedback && (
            <div className={`p-3.5 rounded-xl border text-xs font-semibold ${
              passwordFeedback.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-red-50 text-red-900 border-red-300'
            }`}>
              {passwordFeedback.message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mot de Passe Actuel *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showOldPassword ? "text" : "password"}
                  required
                  placeholder="Saisissez mot de passe actuel"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  title={showOldPassword ? "Masquer" : "Afficher"}
                >
                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nouveau Mot de Passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  title={showNewPassword ? "Masquer" : "Afficher"}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Confirmation Mot de Passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirmer nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  title={showConfirmPassword ? "Masquer" : "Afficher"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-bold text-xs rounded-xl shadow transition uppercase tracking-wide"
            >
              Changer le Mot de Passe Admin
            </button>
          </div>
        </form>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: CRITICAL CLOSURE & MAINTENANCE CONTROL */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-title font-bold text-base text-henrietz-walnut flex items-center gap-2">
              <Power className="w-5 h-5 text-red-600" />
              Statut de Fonctionnement & Fermeture du Site (Abidjan)
            </h3>
            <span className="text-[10px] text-gray-400 uppercase font-mono">Module Sécurité Direction</span>
          </div>

          {/* Status Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Option 1: Ouvert */}
            <div 
              onClick={() => setFormData({ ...formData, siteStatus: 'Ouvert', enableOrders: true })}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                formData.siteStatus === 'Ouvert'
                  ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-md">
                  Recommandé
                </span>
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">Site Ouvert & Opérationnel</h4>
                <p className="text-[11px] text-emerald-800/80 mt-1 leading-relaxed">
                  Le catalogue est actif, les clients peuvent passer des commandes et faire des demandes de devis sur-mesure normalement.
                </p>
              </div>
            </div>

            {/* Option 2: Fermeture Temporaire */}
            <div 
              onClick={() => setFormData({ ...formData, siteStatus: 'Fermeture Temporaire' })}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                formData.siteStatus === 'Fermeture Temporaire'
                  ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-[9px] font-bold text-amber-900 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded-md">
                  Maintenance / Congés
                </span>
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-sm">Fermeture Temporaire</h4>
                <p className="text-[11px] text-amber-900/80 mt-1 leading-relaxed">
                  Affiche un bandeau d'information sur le site client (inventaire, rénovation, vacances atelier Abidjan).
                </p>
              </div>
            </div>

            {/* Option 3: Fermeture Définitive */}
            <div 
              onClick={() => setFormData({ ...formData, siteStatus: 'Fermeture Définitive', enableOrders: false })}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                formData.siteStatus === 'Fermeture Définitive'
                  ? 'bg-red-50/80 border-red-600 ring-2 ring-red-600/20 shadow-xs'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span className="text-[9px] font-bold text-red-900 uppercase tracking-widest bg-red-100 px-2 py-0.5 rounded-md">
                  Arrêt d'Activité
                </span>
              </div>
              <div>
                <h4 className="font-bold text-red-950 text-sm">Fermeture Définitive</h4>
                <p className="text-[11px] text-red-900/80 mt-1 leading-relaxed">
                  Affiche une annonce officielle de cessation d'activité et conserve le site uniquement en mode consultation d'archives.
                </p>
              </div>
            </div>

          </div>

          {/* Closure Settings Form Controls */}
          {formData.siteStatus !== 'Ouvert' && (
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-amber-300/60 space-y-4 animate-in fade-in duration-300">
              <h4 className="font-title font-bold text-xs text-henrietz-walnut uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-henrietz-gold" />
                Paramètres de l'Annonce de Fermeture ({formData.siteStatus})
              </h4>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Message Officiel pour les Visiteurs du Site *</label>
                <textarea
                  rows={3}
                  value={formData.closureMessage}
                  onChange={(e) => setFormData({ ...formData, closureMessage: e.target.value })}
                  placeholder="Rédigez ici le message d'information destiné aux clients d'Abidjan..."
                  className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs leading-relaxed"
                />
              </div>

              {formData.siteStatus === 'Fermeture Temporaire' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date de Réouverture Estimée</label>
                    <input
                      type="date"
                      value={formData.reopeningDate || ''}
                      onChange={(e) => setFormData({ ...formData, reopeningDate: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                      <input
                        type="checkbox"
                        checked={formData.allowQuotesInMaintenance}
                        onChange={(e) => setFormData({ ...formData, allowQuotesInMaintenance: e.target.checked })}
                        className="w-4 h-4 rounded text-henrietz-walnut focus:ring-henrietz-gold"
                      />
                      <span>Autoriser la demande de devis sur-mesure pendant la fermeture</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 2: COMPANY COORDINATES & SHOWROOM */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="font-title font-bold text-base text-henrietz-walnut flex items-center gap-2">
              <Building2 className="w-5 h-5 text-henrietz-gold" />
              Coordonnées et Fiche Showroom Abidjan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Raison Sociale / Marque *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Adresse Email de Contact Officielle *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ligne Téléphonique Standard *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ligne Téléphonique Secondaire / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.phoneAlt || ''}
                  onChange={(e) => setFormData({ ...formData, phoneAlt: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Adresse Showroom & Atelier *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: FINANCIAL & POS TAX PARAMETERS */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="font-title font-bold text-base text-henrietz-walnut flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-henrietz-oak" />
              Paramètres Financiers & Devise (ERP Côte d'Ivoire)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Devise Principale</label>
              <input
                type="text"
                disabled
                value={formData.currency}
                className="w-full px-3.5 py-2 bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold font-mono text-henrietz-walnut cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-400">Fixé en Franc CFA (FCFA) pour la zone UEMOA / Abidjan</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Taux de TVA Réglementaire (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold font-mono"
              />
              <span className="text-[10px] text-gray-400">Taux officiel en Côte d'Ivoire (18%)</span>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-2xl hover:bg-henrietz-oak transition uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-henrietz-gold" />
            Enregistrer Toutes les Modifications
          </button>
        </div>

      </form>

    </div>
  );
};
