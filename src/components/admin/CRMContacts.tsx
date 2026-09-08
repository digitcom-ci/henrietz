import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CRMContact } from '../../types';
import { Users, Mail, Phone, Send, Building } from 'lucide-react';

export const CRMContacts: React.FC = () => {
  const { contacts, addContactMessage } = useApp();
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(contacts[0] || null);
  const [replyText, setReplyText] = useState('');
  const [filterType, setFilterType] = useState<string>('Tous');

  const filteredContacts = contacts.filter(c => filterType === 'Tous' || c.type === filterType);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedContact) return;

    addContactMessage(selectedContact.id, replyText, 'HENRIETZ');
    
    // Update local UI
    const updatedMessages = [
      ...selectedContact.messages,
      {
        id: 'm-' + Date.now(),
        sender: 'HENRIETZ' as const,
        text: replyText,
        date: new Date().toLocaleString('fr-FR')
      }
    ];
    setSelectedContact({ ...selectedContact, messages: updatedMessages });
    setReplyText('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-title text-lg font-bold text-henrietz-walnut flex items-center gap-2">
            <Users className="w-5 h-5 text-henrietz-gold" />
            Gestion Clients CRM Abidjan & Messagerie Directe
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5 font-normal tracking-wide">
            Consultez les dossiers clients (Particuliers, Architectes d'intérieur), l'historique des achats en FCFA et répondez aux messages.
          </p>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {['Tous', 'Particulier', 'Architecte', 'Professionnel'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition uppercase tracking-wide ${
                filterType === t 
                  ? 'bg-henrietz-walnut text-henrietz-gold shadow-sm' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact List */}
        <div className="lg:col-span-5 bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-3">
          <h3 className="font-title font-bold text-sm text-henrietz-walnut px-2 mb-2">
            Base Clients ({filteredContacts.length})
          </h3>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredContacts.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedContact(c)}
                className={`p-4 rounded-2xl cursor-pointer transition border ${
                  selectedContact?.id === c.id
                    ? 'bg-henrietz-walnut text-white border-henrietz-gold shadow-md'
                    : 'bg-[#FAF6F0] hover:bg-gray-100 text-gray-800 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-title font-bold text-sm">{c.name}</h4>
                    {c.company && (
                      <p className="text-[11px] opacity-80 flex items-center gap-1 font-semibold tracking-wider">
                        <Building className="w-3 h-3" />
                        {c.company}
                      </p>
                    )}
                    <p className="text-xs opacity-75 mt-1 font-mono">{c.email}</p>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    c.type === 'Architecte' ? 'bg-amber-200 text-amber-900' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {c.type}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-xs opacity-90">
                  <span>Projets : {c.projectsCount}</span>
                  <span className="font-title font-bold">Total : {c.totalSpent.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messaging & Client Details */}
        {selectedContact ? (
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between h-[600px]">
            
            {/* Header info */}
            <div className="pb-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-title font-bold text-xl text-henrietz-walnut">{selectedContact.name}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 font-mono">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selectedContact.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selectedContact.phone}</span>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-gray-400 block font-mono text-[11px]">Dernier contact : {selectedContact.lastContact}</span>
                <span className="font-title font-bold text-henrietz-oak text-sm">
                  {selectedContact.totalSpent.toLocaleString('fr-FR')} FCFA d'achats
                </span>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {selectedContact.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === 'HENRIETZ' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed tracking-wider ${
                      msg.sender === 'HENRIETZ'
                        ? 'bg-henrietz-walnut text-henrietz-cream rounded-br-none shadow'
                        : 'bg-[#FAF6F0] text-henrietz-dark border border-gray-300 rounded-bl-none'
                    }`}
                  >
                    <p className="font-bold text-[10px] mb-1 opacity-80 uppercase tracking-widest">
                      {msg.sender === 'HENRIETZ' ? 'Maison HENRIETZ Abidjan' : selectedContact.name}
                    </p>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 font-mono">{msg.date}</span>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                placeholder="Rédiger une réponse officielle HENRIETZ au client..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-henrietz-gold tracking-wider"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-henrietz-walnut hover:bg-henrietz-oak text-henrietz-gold font-bold text-xs rounded-xl flex items-center gap-1.5 transition uppercase tracking-wider"
              >
                <Send className="w-4 h-4" />
                Envoyer
              </button>
            </form>

          </div>
        ) : null}

      </div>

    </div>
  );
};
