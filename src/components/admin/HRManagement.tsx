import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee, FinancialRecord } from '../../types';
import { 
  UserCheck, Plus, Phone, Mail, Award, Briefcase, 
  DollarSign, CreditCard, CheckCircle2, Printer, FileText, 
  Calendar, ArrowUpRight, Users, Check, Wallet
} from 'lucide-react';

export const HRManagement: React.FC = () => {
  const { employees, addEmployee, financialRecords, addFinancialRecord } = useApp();
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<FinancialRecord | null>(null);

  // New Employee Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<Employee['role']>('Maître Ébéniste');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState(1500000);
  const [assignedProject, setAssignedProject] = useState('Atelier Fabrication Abidjan');

  // Payment Form State
  const [payEmployeeId, setPayEmployeeId] = useState<string>('');
  const [payType, setPayType] = useState<'Salaire Mensuel' | 'Prime de Rendement' | 'Prestation Sur-Mesure' | 'Avance sur Salaire'>('Salaire Mensuel');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<string>('Virement Bancaire (NSIA / SGBCI)');
  const [payPeriod, setPayPeriod] = useState<string>('Septembre 2026');
  const [payDescription, setPayDescription] = useState<string>('');
  const [payReference, setPayReference] = useState<string>('');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // KPI Calculations
  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
  
  const payrollRecords = financialRecords.filter(r => 
    r.category === 'Salaires' || r.category === 'Prestations & Primes'
  );

  const totalPaidThisMonth = payrollRecords.reduce((sum, r) => sum + r.amount, 0);

  // Open payment modal pre-selected for an employee
  const handleOpenPayModal = (employee?: Employee) => {
    const emp = employee || employees[0];
    if (emp) {
      setPayEmployeeId(emp.id);
      setPayAmount(emp.salary);
      setPayType('Salaire Mensuel');
      setPayMethod('Virement Bancaire (NSIA / SGBCI)');
      setPayPeriod('Septembre 2026');
      setPayDescription(`Règlement Salaire Mensuel - ${emp.name} (${emp.role}) - Septembre 2026`);
      setPayReference(`PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
    setIsPayModalOpen(true);
  };

  const handleSelectEmployeeInForm = (empId: string) => {
    setPayEmployeeId(empId);
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      setPayAmount(emp.salary);
      setPayDescription(`Règlement ${payType} - ${emp.name} (${emp.role}) - ${payPeriod}`);
    }
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addEmployee({
      name,
      role,
      email,
      phone,
      salary: Number(salary),
      status: 'Actif',
      assignedProject
    });

    setIsAddModalOpen(false);
    setName('');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === payEmployeeId);
    if (!emp || !payAmount) return;

    const category = payType === 'Prestation Sur-Mesure' || payType === 'Prime de Rendement' ? 'Prestations & Primes' : 'Salaires';

    const newRecord: Omit<FinancialRecord, 'id'> = {
      type: 'Dépense',
      category,
      amount: Number(payAmount),
      date: new Date().toISOString().split('T')[0],
      description: payDescription || `Règlement ${payType} - ${emp.name} via ${payMethod}`,
      referenceNo: payReference || `PAY-${Date.now().toString().slice(-5)}`
    };

    addFinancialRecord(newRecord);

    setIsPayModalOpen(false);
    setPaymentSuccessMsg(`Paiement de ${payAmount.toLocaleString('fr-FR')} FCFA effectué avec succès pour ${emp.name}.`);

    setTimeout(() => {
      setPaymentSuccessMsg(null);
    }, 5000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="font-title text-lg font-bold text-henrietz-walnut flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-henrietz-gold" />
            Gestion RH, Salaires & Prestations Ébénisterie (FCFA)
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5 font-normal tracking-wide">
            Gérez l'équipe d'ébénistes, effectuez les règlements de salaires et primes de chantier, et éditez les reçus de paie.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleOpenPayModal()}
            className="px-3.5 py-2 bg-emerald-700 text-white hover:bg-emerald-800 font-semibold text-[11px] rounded-lg shadow-sm flex items-center gap-1.5 transition uppercase tracking-wide whitespace-nowrap shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            Payer Salaire / Prestation
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-semibold text-[11px] rounded-lg shadow-sm flex items-center gap-1.5 transition uppercase tracking-wide whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            Ajouter un Collaborateur
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {paymentSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold">{paymentSuccessMsg}</span>
          </div>
          <button onClick={() => setPaymentSuccessMsg(null)} className="text-emerald-700 font-bold text-xs">✕</button>
        </div>
      )}

      {/* Payroll KPIs Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Masse Salariale Mensuelle</span>
            <span className="font-title text-xl font-bold text-henrietz-walnut">
              {totalMonthlyPayroll.toLocaleString('fr-FR')} <span className="text-xs font-normal">FCFA</span>
            </span>
            <span className="text-[10px] text-emerald-600 block mt-1 font-mono">Engagée pour {employees.length} collaborateurs</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-henrietz-gold border border-amber-200">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Paies & Prestations Réglées</span>
            <span className="font-title text-xl font-bold text-emerald-800">
              {totalPaidThisMonth.toLocaleString('fr-FR')} <span className="text-xs font-normal">FCFA</span>
            </span>
            <span className="text-[10px] text-gray-400 block mt-1 font-mono">{payrollRecords.length} virements & pièces comptables</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Effectif Atelier & Vente</span>
            <span className="font-title text-xl font-bold text-henrietz-oak">
              {employees.length} <span className="text-xs font-normal">Membres</span>
            </span>
            <span className="text-[10px] text-gray-400 block mt-1 font-mono">Abidjan Zone 4 & Ateliers</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="space-y-3">
        <h3 className="font-title font-bold text-sm text-henrietz-walnut flex items-center justify-between px-1">
          <span>Fiches Collaborateurs ({employees.length})</span>
          <span className="text-[11px] text-gray-400 font-normal">Cliquez sur « Payer Salaire » pour effectuer un virement ou prime</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {employees.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[11px] text-henrietz-oak font-bold">{emp.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    emp.status === 'Actif' ? 'bg-emerald-100 text-emerald-800' :
                    emp.status === 'En Atelier' ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {emp.status}
                  </span>
                </div>

                <div className="mt-2.5">
                  <h3 className="font-title font-bold text-base text-henrietz-walnut">{emp.name}</h3>
                  <span className="text-[11px] font-semibold text-henrietz-oak flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5" />
                    {emp.role}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600 font-light tracking-wider">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate text-[11px]">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-mono text-[11px]">{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-henrietz-walnut">
                    <Briefcase className="w-3.5 h-3.5 text-henrietz-gold shrink-0" />
                    <span className="truncate text-[11px]">{emp.assignedProject || 'Atelier Général'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 text-[11px]">Salaire Mensuel :</span>
                  <span className="font-title font-bold text-henrietz-oak text-sm">
                    {emp.salary.toLocaleString('fr-FR')} <span className="text-[10px]">FCFA</span>
                  </span>
                </div>

                <button
                  onClick={() => handleOpenPayModal(emp)}
                  className="w-full py-2 bg-[#FAF6F0] hover:bg-henrietz-walnut text-henrietz-walnut hover:text-henrietz-gold border border-henrietz-walnut/20 font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1.5 uppercase tracking-wide"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Payer Salaire / Prestation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Salary & Prestations Payment History Table */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-title font-bold text-base text-henrietz-walnut flex items-center gap-2">
              <FileText className="w-4 h-4 text-henrietz-gold" />
              Historique des Règlements de Paies & Prestations
            </h3>
            <p className="text-[11px] text-gray-500 font-normal">
              Historique comptable automatique synchronisé avec le module Finance.
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {payrollRecords.length} Règlements Enregistrés
          </span>
        </div>

        {payrollRecords.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs font-light">
            Aucun virement de salaire ou prestation enregistré pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6F0] text-henrietz-walnut font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Référence</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Désignation / Bénéficiaire</th>
                  <th className="p-3">Catégorie</th>
                  <th className="p-3">Montant (FCFA)</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-sans">
                {payrollRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 font-mono font-bold text-henrietz-oak text-[11px]">
                      {rec.referenceNo}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-gray-500">
                      {rec.date}
                    </td>
                    <td className="p-3 font-semibold text-gray-900">
                      {rec.description}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        rec.category === 'Salaires' 
                          ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {rec.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-700 text-sm">
                      -{rec.amount.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedPayslip(rec)}
                        className="px-2.5 py-1 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak text-[10px] font-bold rounded-lg transition inline-flex items-center gap-1 uppercase tracking-wider"
                      >
                        <Printer className="w-3 h-3" />
                        Reçu / Bordereau
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pay Modal (Salaires & Prestations) */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-henrietz-gold/40 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <h3 className="font-title font-bold text-lg text-henrietz-walnut flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-henrietz-gold" />
                  Règlement de Salaire ou Prestation
                </h3>
                <p className="text-[11px] text-gray-500 font-normal">
                  Imputation directe dans le module comptable de l'atelier HENRIETZ.
                </p>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} className="text-gray-400 font-bold hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleProcessPayment} className="mt-4 space-y-4 font-sans">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Sélectionner le Collaborateur / Bénéficiaire *</label>
                <select
                  value={payEmployeeId}
                  onChange={(e) => handleSelectEmployeeInForm(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.role} ({emp.salary.toLocaleString('fr-FR')} FCFA/mois)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type de Règlement</label>
                  <select
                    value={payType}
                    onChange={(e) => {
                      const newType = e.target.value as any;
                      setPayType(newType);
                      const emp = employees.find(e => e.id === payEmployeeId);
                      if (emp) {
                        setPayDescription(`Règlement ${newType} - ${emp.name} (${emp.role}) - ${payPeriod}`);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Salaire Mensuel">Salaire Mensuel</option>
                    <option value="Prime de Rendement">Prime de Rendement Chantier</option>
                    <option value="Prestation Sur-Mesure">Prestation / Honoraires Sur-Mesure</option>
                    <option value="Avance sur Salaire">Avance sur Salaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Montant à Régler (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold font-mono text-emerald-800 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mode de Paiement</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="Virement Bancaire (NSIA / SGBCI)">Virement Bancaire (NSIA / SGBCI)</option>
                    <option value="Orange Money / Wave">Mobile Money (Orange / Wave)</option>
                    <option value="Chèque d'Entreprise">Chèque d'Entreprise</option>
                    <option value="Espèces Caisse Showroom">Espèces Caisse Showroom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Période / Mois</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Septembre 2026"
                    value={payPeriod}
                    onChange={(e) => {
                      setPayPeriod(e.target.value);
                      const emp = employees.find(e => e.id === payEmployeeId);
                      if (emp) {
                        setPayDescription(`Règlement ${payType} - ${emp.name} (${emp.role}) - ${e.target.value}`);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Libellé Comptable / Description</label>
                <input
                  type="text"
                  required
                  value={payDescription}
                  onChange={(e) => setPayDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Référence Pièce Comptable</label>
                <input
                  type="text"
                  required
                  value={payReference}
                  onChange={(e) => setPayReference(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="w-1/3 py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 uppercase tracking-wider"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Valider & Inscrire au Bilan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Payslip / Bordereau Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-henrietz-gold/40 space-y-5">
            
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <span className="text-[10px] text-henrietz-gold font-mono uppercase tracking-widest block mb-0.5">
                  Maison HENRIETZ • Abidjan Côte d'Ivoire
                </span>
                <h3 className="font-title font-bold text-lg text-henrietz-walnut">
                  Bordereau de Règlement de Paie & Prestation
                </h3>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="text-gray-400 font-bold hover:text-gray-600">✕</button>
            </div>

            <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-henrietz-gold/20 space-y-3 font-sans">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">N° Pièce Comptable :</span>
                <span className="font-mono font-bold text-henrietz-oak text-sm">{selectedPayslip.referenceNo}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Date d'Émission :</span>
                <span className="font-mono font-bold text-gray-800">{selectedPayslip.date}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Catégorie Comptable :</span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">{selectedPayslip.category}</span>
              </div>

              <div className="pt-2 border-t border-gray-200 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Libellé & Motif du Règlement :</span>
                <p className="text-xs font-semibold text-henrietz-walnut">{selectedPayslip.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-700">Montant Net Réglé :</span>
                <span className="font-title text-xl font-bold text-emerald-700">
                  {selectedPayslip.amount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 text-center italic">
              Document officiel édité par le système ERP Maison HENRIETZ Abidjan Zone 4.
            </div>

            <div className="pt-3 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setSelectedPayslip(null)}
                className="w-1/2 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 uppercase tracking-wider"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="w-1/2 py-2.5 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl hover:bg-henrietz-oak uppercase tracking-wider shadow flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimer le Bordereau
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-henrietz-gold/40">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="font-title font-bold text-lg text-henrietz-walnut">Ajouter un Collaborateur</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 font-bold hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleCreateEmployee} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nom et Prénom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kouassi Yao Bernard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Poste / Rôle</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  >
                    <option value="Maître Ébéniste">Maître Ébéniste</option>
                    <option value="Designer d'Intérieur">Designer d'Intérieur</option>
                    <option value="Vendeur Caisse">Vendeur Caisse</option>
                    <option value="Administrateur">Administrateur</option>
                    <option value="Apprenti">Apprenti</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Salaire FCFA / Mois *</label>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Pro</label>
                  <input
                    type="email"
                    required
                    placeholder="b.kouassi@henrietz.ci"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Téléphone (+225)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+225 07..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Projet / Chantier Assigné</label>
                <input
                  type="text"
                  placeholder="Ex: Projet Résidence Cocody ou Atelier Abidjan"
                  value={assignedProject}
                  onChange={(e) => setAssignedProject(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full py-3 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl hover:bg-henrietz-oak uppercase tracking-wider"
                >
                  Créer la Fiche Employé
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

