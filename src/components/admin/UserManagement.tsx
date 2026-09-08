import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { UserCheck, Shield, Plus, Search, Trash2, Edit, Key, Mail, Phone, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { usersList, addUser, updateUser, deleteUser, resetUserPassword } = useApp();

  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'client'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<(User & { password?: string }) | null>(null);
  const [resettingUser, setResettingUser] = useState<(User & { password?: string }) | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  // Password visibility state
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Add user form state
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('+225 ');
  const [addRole, setAddRole] = useState<'client' | 'admin'>('client');
  const [addPassword, setAddPassword] = useState('');

  // Edit user form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<'client' | 'admin'>('client');
  const [editPassword, setEditPassword] = useState('');

  // Feedback message
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredUsers = usersList.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.phone && u.phone.includes(searchQuery));
    return matchesRole && matchesSearch;
  });

  const adminCount = usersList.filter(u => u.role === 'admin').length;
  const clientCount = usersList.filter(u => u.role === 'client').length;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addEmail) return;

    const res = addUser({
      name: addName.trim(),
      email: addEmail.trim().toLowerCase(),
      phone: addPhone.trim(),
      role: addRole,
      password: addPassword.trim() || 'password123'
    });

    if (!res.success) {
      setFeedback({ type: 'error', message: res.message });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    setIsAddUserOpen(false);
    setAddName('');
    setAddEmail('');
    setAddPhone('+225 ');
    setAddRole('client');
    setAddPassword('');
    
    setFeedback({ type: 'success', message: res.message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenEditUser = (user: User & { password?: string }) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditRole(user.role);
    setEditPassword(user.password || '');
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName || !editEmail) return;

    const res = updateUser(editingUser.id, {
      name: editName.trim(),
      email: editEmail.trim().toLowerCase(),
      phone: editPhone.trim(),
      role: editRole,
      password: editPassword.trim() || editingUser.password
    });

    if (!res.success) {
      setFeedback({ type: 'error', message: res.message });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    setEditingUser(null);
    setFeedback({ type: 'success', message: res.message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser || !newPasswordInput) return;

    const res = resetUserPassword(resettingUser.email, newPasswordInput.trim());
    if (res.success) {
      setFeedback({ type: 'success', message: `Nouveau mot de passe enregistré pour ${resettingUser.name}.` });
      setResettingUser(null);
      setNewPasswordInput('');
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-title text-lg font-bold text-henrietz-walnut flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-henrietz-gold" />
              Gestion des Utilisateurs & Accès Espace Client / Admin
            </h2>
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold font-mono">
              {usersList.length} comptes enregistrés
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5 font-normal tracking-wide">
            Administrez les comptes clients de la boutique web et les accès administrateurs de la Direction Maison HENRIETZ.
          </p>
        </div>

        <button
          onClick={() => setIsAddUserOpen(true)}
          className="px-4 py-2.5 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2 transition uppercase tracking-wide shrink-0"
        >
          <Plus className="w-4 h-4" />
          Créer un Utilisateur
        </button>
      </div>

      {/* Notification Feedback */}
      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-red-50 text-red-900 border-red-300'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Comptes</span>
            <span className="font-title font-bold text-xl text-henrietz-walnut">{usersList.length}</span>
          </div>
          <div className="p-2.5 bg-amber-50 text-henrietz-walnut rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Administrateurs ERP</span>
            <span className="font-title font-bold text-xl text-henrietz-oak">{adminCount}</span>
          </div>
          <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Clients Inscrits</span>
            <span className="font-title font-bold text-xl text-emerald-700">{clientCount}</span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['all', 'admin', 'client'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition uppercase tracking-wider whitespace-nowrap ${
                roleFilter === r
                  ? 'bg-henrietz-walnut text-henrietz-gold shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r === 'all' ? `Tous (${usersList.length})` : r === 'admin' ? `Administrateurs (${adminCount})` : `Clients (${clientCount})`}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher nom, email, tél..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0] border-b border-gray-200 text-gray-600 text-[11px] uppercase tracking-wider font-semibold">
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Contact Email</th>
                <th className="p-4">Téléphone</th>
                <th className="p-4">Rôle & Droits</th>
                <th className="p-4">Mot de Passe</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs">{user.name}</h4>
                        <span className="text-[10px] text-gray-400 font-mono">ID: {user.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-mono text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{user.email}</span>
                    </div>
                  </td>

                  <td className="p-4 text-gray-600 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{user.phone || 'Non renseigné'}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {user.role === 'admin' && <Shield className="w-3 h-3 text-purple-700" />}
                      {user.role === 'admin' ? 'ADMINISTRATEUR DIRECTION' : 'CLIENT BOUTIQUE'}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-gray-500 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-gray-400" />
                      <span>••••••••</span>
                    </div>
                  </td>

                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => setResettingUser(user)}
                      className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition"
                      title="Réinitialiser le mot de passe"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEditUser(user)}
                      className="p-1.5 text-henrietz-walnut hover:bg-amber-50 rounded-lg transition"
                      title="Éditer les informations"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {user.email !== 'admin@henrietz.ci' && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer définitivement le compte de ${user.name} ?`)) {
                            deleteUser(user.id);
                            setFeedback({ type: 'success', message: `Utilisateur supprimé.` });
                            setTimeout(() => setFeedback(null), 3000);
                          }
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add User */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-henrietz-gold/40">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="font-title font-bold text-base text-henrietz-walnut flex items-center gap-2">
                <Plus className="w-5 h-5 text-henrietz-gold" />
                Créer un Nouveau Compte Utilisateur
              </h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-gray-400 font-bold hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nom et Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kouassi Emmanuel"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Adresse Email *</label>
                <input
                  type="email"
                  required
                  placeholder="nom@domaine.ci"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Numéro Téléphone</label>
                <input
                  type="text"
                  placeholder="+225 07 00 00 00 00"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Rôle Accès *</label>
                  <select
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value as 'client' | 'admin')}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-henrietz-walnut"
                  >
                    <option value="client">Client Boutique</option>
                    <option value="admin">Administrateur ERP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mot de Passe *</label>
                  <div className="relative">
                    <input
                      type={showAddPassword ? "text" : "password"}
                      required
                      placeholder="Mot de passe"
                      value={addPassword}
                      onChange={(e) => setAddPassword(e.target.value)}
                      className="w-full pl-3.5 pr-9 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAddPassword(!showAddPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      title={showAddPassword ? "Masquer" : "Afficher"}
                    >
                      {showAddPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl hover:bg-henrietz-oak uppercase tracking-wider"
                >
                  Enregistrer l'Utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-henrietz-gold/40">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="font-title font-bold text-base text-henrietz-walnut flex items-center gap-2">
                <Edit className="w-5 h-5 text-henrietz-gold" />
                Modifier l'Utilisateur : {editingUser.name}
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 font-bold hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSaveEditUser} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nom et Prénom *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Adresse Email *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Rôle Accès *</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as 'client' | 'admin')}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-henrietz-walnut"
                  >
                    <option value="client">Client Boutique</option>
                    <option value="admin">Administrateur ERP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nouveau Mot de Passe</label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? "text" : "password"}
                      placeholder="Laisser vide si inchangé"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full pl-3.5 pr-9 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      title={showEditPassword ? "Masquer" : "Afficher"}
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl hover:bg-henrietz-oak uppercase tracking-wider"
                >
                  Mettre à Jour le Compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reset Password */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-henrietz-gold/40">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h3 className="font-title font-bold text-sm text-henrietz-walnut flex items-center gap-2">
                <Key className="w-4 h-4 text-henrietz-gold" />
                Réinitialiser Mot de Passe
              </h3>
              <button onClick={() => setResettingUser(null)} className="text-gray-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="mt-4 space-y-3">
              <p className="text-xs text-gray-600">
                Définissez un nouveau mot de passe pour <strong className="text-henrietz-walnut">{resettingUser.name}</strong> ({resettingUser.email}).
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nouveau Mot de Passe *</label>
                <div className="relative">
                  <input
                    type={showResetPassword ? "text" : "password"}
                    required
                    placeholder="Saisissez au moins 6 caractères"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full pl-3.5 pr-9 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    title={showResetPassword ? "Masquer" : "Afficher"}
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl hover:bg-henrietz-oak uppercase tracking-wider"
                >
                  Valider le Mot de Passe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
