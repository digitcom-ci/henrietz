import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight, Sparkles, KeyRound, CheckCircle2, ShieldAlert, Eye, EyeOff } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    register,
    resetUserPassword,
    usersList
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'client' | 'admin'>('client');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot password 2-step security verification states
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [generatedCode, setGeneratedCode] = useState('');
  const [securityCodeInput, setSecurityCodeInput] = useState('');

  if (!isAuthModalOpen) return null;

  const handleRequestSecurityCode = () => {
    setError(null);
    setSuccessMsg(null);
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Veuillez d'abord saisir l'adresse email de votre compte.");
      return;
    }

    const userExists = usersList.some(u => u.email.toLowerCase() === trimmedEmail);
    if (!userExists) {
      setError("Aucun compte actif trouvé avec cette adresse email.");
      return;
    }

    // Generate a 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setForgotStep('verify');
    setSuccessMsg(`Un code de sécurité à 6 chiffres a été transmis à ${trimmedEmail}. (Code de vérification : ${code})`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    setTimeout(() => {
      if (authModalMode === 'login') {
        const res = login(email, password);
        if (!res.success) {
          setError(res.message);
        } else {
          setIsAuthModalOpen(false);
          resetForm();
        }
      } else if (authModalMode === 'register') {
        if (!name.trim()) {
          setError('Veuillez saisir votre nom complet.');
          setLoading(false);
          return;
        }
        const res = register(name, email, phone, password, 'client');
        if (!res.success) {
          setError(res.message);
        } else {
          setIsAuthModalOpen(false);
          resetForm();
        }
      } else if (authModalMode === 'forgot-password') {
        if (forgotStep === 'request') {
          handleRequestSecurityCode();
          setLoading(false);
          return;
        }

        // Step 2: Verification of security code
        if (securityCodeInput.trim() !== generatedCode) {
          setError("Code de sécurité à 6 chiffres invalide ou expiré.");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Les deux mots de passe ne correspondent pas.');
          setLoading(false);
          return;
        }

        if (password.length < 4) {
          setError('Le mot de passe doit comporter au moins 4 caractères.');
          setLoading(false);
          return;
        }

        const res = resetUserPassword(email, password);
        if (!res.success) {
          setError(res.message);
        } else {
          setSuccessMsg("Mot de passe sécurisé et réinitialisé avec succès ! Redirection vers la connexion...");
          setTimeout(() => {
            setAuthModalMode('login');
            setForgotStep('request');
            setGeneratedCode('');
            setSecurityCodeInput('');
            setSuccessMsg(null);
          }, 2000);
        }
      }
      setLoading(false);
    }, 400);
  };

  const handleQuickLogin = (demoRole: 'client' | 'admin') => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    setTimeout(() => {
      if (demoRole === 'admin') {
        login('admin@henrietz.ci', 'admin123');
      } else {
        const res = login('client@henrietz.ci', 'client123');
        if (!res.success) {
          register('Client Démo', 'client@henrietz.ci', '+225 07 00 00 00 00', 'client123', 'client');
        }
      }
      setLoading(false);
      setIsAuthModalOpen(false);
      resetForm();
    }, 300);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccessMsg(null);
    setForgotStep('request');
    setGeneratedCode('');
    setSecurityCodeInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charbon/80 backdrop-blur-md transition-opacity animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-cacao border border-sable/30 rounded-2xl shadow-2xl overflow-hidden text-ivoire my-auto font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with logo & close */}
        <div className="relative shrink-0 px-6 pt-6 pb-4 text-center border-b border-sable/15 bg-gradient-to-b from-cacao/90 to-cacao">
          <button 
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-3.5 right-3.5 p-2 text-sable/60 hover:text-ivoire hover:bg-sable/10 rounded-full transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <img 
            src="/logo-henrietz-light.png" 
            alt="Maison HENRIETZ" 
            className="h-10 mx-auto mb-3 object-contain"
          />
          <p className="text-xs text-sable/80 tracking-widest font-light uppercase">
            ÉBÉNISTERIE D'ART & MOBILIER ABIDJAN
          </p>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* Mode Switcher Tabs */}
          {authModalMode !== 'forgot-password' ? (
            <div className="grid grid-cols-2 p-1 mb-6 bg-charbon/60 rounded-xl border border-sable/20">
              <button
                onClick={() => { setAuthModalMode('login'); setError(null); setSuccessMsg(null); }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all tracking-wider ${
                  authModalMode === 'login' 
                    ? 'bg-terracotta text-ivoire shadow-md' 
                    : 'text-sable/70 hover:text-ivoire'
                }`}
              >
                Se Connecter
              </button>
              <button
                onClick={() => { setAuthModalMode('register'); setError(null); setSuccessMsg(null); }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all tracking-wider ${
                  authModalMode === 'register' 
                    ? 'bg-terracotta text-ivoire shadow-md' 
                    : 'text-sable/70 hover:text-ivoire'
                }`}
              >
                S'inscrire
              </button>
            </div>
          ) : (
            <div className="mb-6 p-3 bg-charbon/60 border border-sable/20 rounded-xl flex items-center justify-between text-xs">
              <span className="text-sable font-semibold flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-terracotta" />
                {forgotStep === 'request' ? 'Étape 1/2 : Code de Sécurité' : 'Étape 2/2 : Validation & Mot de Passe'}
              </span>
              <button
                onClick={() => { 
                  setAuthModalMode('login'); 
                  setForgotStep('request'); 
                  setGeneratedCode('');
                  setSecurityCodeInput('');
                  setError(null); 
                  setSuccessMsg(null); 
                }}
                className="text-terracotta hover:underline font-bold text-[11px]"
              >
                ← Connexion
              </button>
            </div>
          )}

          {/* Notifications */}
          {error && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 font-light flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 font-light flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-sable mb-1 font-semibold">
                  Nom & Prénom
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-sable/50 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jean Kouassi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-charbon/50 border border-sable/30 rounded-lg text-xs text-ivoire placeholder-sable/40 focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>
            )}

            {/* Email Field (Used in Login, Register, & Forgot Password Step 1) */}
            {(authModalMode !== 'forgot-password' || forgotStep === 'request') && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-sable mb-1 font-semibold">
                  Adresse Email du Compte
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-sable/50 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="votre.email@exemple.ci"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-charbon/50 border border-sable/30 rounded-lg text-xs text-ivoire placeholder-sable/40 focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>
            )}

            {/* Forgot Password Step 2 Inputs */}
            {authModalMode === 'forgot-password' && forgotStep === 'verify' && (
              <>
                <div className="p-3 bg-charbon/40 border border-sable/20 rounded-xl space-y-1">
                  <span className="text-[10px] text-sable/60 uppercase block">Compte concerné :</span>
                  <span className="font-mono font-bold text-xs text-sable block">{email}</span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-sable mb-1 font-semibold flex items-center justify-between">
                    <span>Code de Sécurité (6 chiffres) *</span>
                    <span className="text-[10px] text-terracotta font-mono font-bold">Code reçu par SMS / Email</span>
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-terracotta absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="Ex: 784920"
                      value={securityCodeInput}
                      onChange={(e) => setSecurityCodeInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-charbon/50 border border-terracotta/40 rounded-lg text-xs text-ivoire font-mono font-bold tracking-widest placeholder-sable/40 focus:outline-none focus:border-terracotta"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-sable mb-1 font-semibold">
                    Nouveau Mot de Passe *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-sable/50 absolute left-3 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-charbon/50 border border-sable/30 rounded-lg text-xs text-ivoire placeholder-sable/40 focus:outline-none focus:border-terracotta"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-sable/60 hover:text-sable transition"
                      title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-sable mb-1 font-semibold">
                    Confirmer le Nouveau Mot de Passe *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-sable/50 absolute left-3 top-3" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 bg-charbon/50 border border-sable/30 rounded-lg text-xs text-ivoire placeholder-sable/40 focus:outline-none focus:border-terracotta"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-sable/60 hover:text-sable transition"
                      title={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {authModalMode === 'register' && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-sable mb-1 font-semibold">
                  Téléphone (Optionnel)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-sable/50 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+225 07 00 00 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-charbon/50 border border-sable/30 rounded-lg text-xs text-ivoire placeholder-sable/40 focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>
            )}

            {/* Standard Login Password input */}
            {authModalMode === 'login' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] uppercase tracking-wider text-sable font-semibold">
                    Mot de Passe
                  </label>
                  <button
                    type="button"
                    onClick={() => { setAuthModalMode('forgot-password'); setForgotStep('request'); setError(null); setSuccessMsg(null); }}
                    className="text-[10px] text-terracotta hover:underline font-semibold"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-sable/50 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-charbon/50 border border-sable/30 rounded-lg text-xs text-ivoire placeholder-sable/40 focus:outline-none focus:border-terracotta"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-sable/60 hover:text-sable transition"
                    title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {authModalMode === 'register' && (
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-sable mb-1 font-semibold">
                  Mot de Passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-sable/50 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-charbon/50 border border-sable/30 rounded-lg text-xs text-ivoire placeholder-sable/40 focus:outline-none focus:border-terracotta"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-sable/60 hover:text-sable transition"
                    title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}



            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-terracotta to-cognac hover:from-cognac hover:to-terracotta text-ivoire text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span>Patientez...</span>
              ) : (
                <>
                  <span>
                    {authModalMode === 'login' ? 'Se Connecter' :
                     authModalMode === 'register' ? 'Créer mon compte' :
                     forgotStep === 'request' ? 'Obtenir un Code de Sécurité' : 'Valider la Réinitialisation'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {authModalMode === 'forgot-password' && forgotStep === 'verify' && (
              <button
                type="button"
                onClick={() => setForgotStep('request')}
                className="w-full py-2 text-[11px] text-sable/70 hover:text-sable underline text-center block"
              >
                ← Changer d'adresse e-mail
              </button>
            )}
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-sable/15">
            <p className="text-[11px] text-sable/70 font-light text-center mb-3 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sable" />
              <span>Accès rapide de démonstration :</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('client')}
                className="px-3 py-2 text-[11px] bg-charbon/70 hover:bg-charbon border border-sable/30 hover:border-sable/60 text-sable hover:text-ivoire rounded-lg transition text-left flex items-center gap-2"
              >
                <UserIcon className="w-3.5 h-3.5 text-cognac shrink-0" />
                <div className="truncate">
                  <div className="font-semibold leading-tight">Compte Client</div>
                  <div className="text-[9px] text-sable/50 truncate">client@henrietz.ci</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="px-3 py-2 text-[11px] bg-charbon/70 hover:bg-charbon border border-terracotta/40 hover:border-terracotta text-ivoire rounded-lg transition text-left flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-terracotta shrink-0" />
                <div className="truncate">
                  <div className="font-semibold leading-tight text-terracotta">Accès ERP Admin</div>
                  <div className="text-[9px] text-sable/50 truncate">admin@henrietz.ci</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
