import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, WoodSpecies, QuoteRequest, Order, 
  POSTransaction, FinancialRecord, Employee, CRMContact, OrderItem, User, ProductVariant, SiteSettings 
} from '../types';
import { 
  INITIAL_PRODUCTS, INITIAL_WOOD_SPECIES, INITIAL_QUOTES, 
  INITIAL_ORDERS, INITIAL_POS_TRANSACTIONS, INITIAL_FINANCIAL_RECORDS, 
  INITIAL_EMPLOYEES, INITIAL_CONTACTS 
} from '../data/mockData';

export type AdminTab = 'dashboard' | 'products' | 'quotes' | 'pos' | 'finance' | 'crm' | 'hr' | 'users' | 'settings';

interface AppContextType {
  // App View & Auth
  viewMode: 'client' | 'client-portal' | 'admin';
  setViewMode: (mode: 'client' | 'client-portal' | 'admin') => void;
  activeAdminTab: AdminTab;
  setActiveAdminTab: (tab: AdminTab) => void;

  currentUser: User | null;
  login: (email: string, pass: string) => { success: boolean; message: string };
  register: (name: string, email: string, phone: string, pass: string, role?: 'client' | 'admin') => { success: boolean; message: string };
  logout: () => void;

  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot-password';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot-password') => void;

  updateUserPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  resetUserPassword: (email: string, newPass: string) => { success: boolean; message: string };

  // Products & Wood
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  woodSpecies: WoodSpecies[];
  addWoodSpecies: (wood: Omit<WoodSpecies, 'id'>) => void;
  updateWoodSpecies: (id: string, wood: Partial<WoodSpecies>) => void;
  deleteWoodSpecies: (id: string) => void;

  // Quotes
  quotes: QuoteRequest[];
  addQuoteRequest: (quote: Omit<QuoteRequest, 'id' | 'status' | 'date'>) => void;
  updateQuoteStatus: (id: string, status: QuoteRequest['status'], notes?: string) => void;

  // Orders
  orders: Order[];
  createOrder: (clientName: string, clientEmail: string, clientPhone: string) => void;
  updateOrderStatus: (id: string, status: Order['orderStatus']) => void;

  // POS / Caisse
  posTransactions: POSTransaction[];
  processPOSSale: (items: OrderItem[], discount: number, paymentMethod: POSTransaction['paymentMethod'], cashierName: string) => void;

  // Finance
  financialRecords: FinancialRecord[];
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;

  // Employees RH
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;

  // CRM Contacts
  contacts: CRMContact[];
  addContactMessage: (contactId: string, text: string, sender: 'Client' | 'HENRIETZ') => void;

  // User Management
  usersList: (User & { password?: string })[];
  addUser: (userData: Omit<User, 'id'> & { password?: string }) => { success: boolean; message: string };
  updateUser: (id: string, userData: Partial<User & { password?: string }>) => { success: boolean; message: string };
  deleteUser: (id: string) => void;

  // Site Settings & Closure
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Cart
  cart: OrderItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: ProductVariant) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const safeGetInitialData = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    if (Array.isArray(fallback) && (!Array.isArray(parsed) || parsed.length === 0)) {
      return fallback;
    }
    return parsed;
  } catch (err) {
    console.warn(`Failed to parse localStorage key "${key}", using fallback data.`, err);
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'client' | 'client-portal' | 'admin'>('client');
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');

  const DEFAULT_USERS: (User & { password?: string })[] = [
    {
      id: 'usr-admin',
      name: 'Direction HENRIETZ',
      email: 'admin@henrietz.ci',
      phone: '+225 27 21 00 00 00',
      role: 'admin',
      password: 'admin123'
    }
  ];

  const [users, setUsers] = useState<(User & { password?: string })[]>(() => safeGetInitialData('henrietz_v3_users', DEFAULT_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => safeGetInitialData('henrietz_v3_current_user', null));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot-password'>('login');

  const [products, setProducts] = useState<Product[]>(() => safeGetInitialData('henrietz_v3_products', INITIAL_PRODUCTS));
  const [woodSpecies, setWoodSpecies] = useState<WoodSpecies[]>(() => safeGetInitialData('henrietz_v3_woods', INITIAL_WOOD_SPECIES));
  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => safeGetInitialData('henrietz_v3_quotes', INITIAL_QUOTES));
  const [orders, setOrders] = useState<Order[]>(() => safeGetInitialData('henrietz_v3_orders', INITIAL_ORDERS));
  const [posTransactions, setPosTransactions] = useState<POSTransaction[]>(() => safeGetInitialData('henrietz_v3_pos', INITIAL_POS_TRANSACTIONS));
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(() => safeGetInitialData('henrietz_v3_finance', INITIAL_FINANCIAL_RECORDS));
  const [employees, setEmployees] = useState<Employee[]>(() => safeGetInitialData('henrietz_v3_employees', INITIAL_EMPLOYEES));
  const [contacts, setContacts] = useState<CRMContact[]>(() => safeGetInitialData('henrietz_v3_contacts', INITIAL_CONTACTS));

  const DEFAULT_SITE_SETTINGS: SiteSettings = {
    companyName: 'Maison HENRIETZ Abidjan',
    phone: '+225 27 21 00 00 00',
    phoneAlt: '+225 07 08 09 10 11',
    email: 'contact@henrietz.ci',
    address: 'Marcory Zone 4, Bd de Marseille, Abidjan',
    currency: 'FCFA',
    taxRate: 18,
    siteStatus: 'Ouvert',
    closureMessage: 'Chers clients, notre atelier et showroom d’Abidjan observent une fermeture temporaire. Nous restons joignables par email et téléphone pour le suivi de vos projets.',
    reopeningDate: '2026-09-15',
    allowQuotesInMaintenance: true,
    enableOrders: true
  };

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => safeGetInitialData('henrietz_site_settings', DEFAULT_SITE_SETTINGS));
  useEffect(() => { localStorage.setItem('henrietz_site_settings', JSON.stringify(siteSettings)); }, [siteSettings]);

  const updateSiteSettings = (updated: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...updated }));
  };

  const addUser = (userData: Omit<User, 'id'> & { password?: string }): { success: boolean; message: string } => {
    const trimmedEmail = userData.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { 
        success: false, 
        message: `Erreur de sécurité : L'adresse email "${trimmedEmail}" est déjà associée à un compte. L'utilisation de 2 adresses identiques est strictement interdite.` 
      };
    }

    const newUser = {
      ...userData,
      email: trimmedEmail,
      id: 'usr-' + Date.now()
    };
    setUsers(prev => [...prev, newUser]);

    if (userData.role === 'client') {
      const existingContact = contacts.find(c => c.email.toLowerCase() === trimmedEmail);
      if (existingContact) {
        setContacts(prev => prev.map(c => c.id === existingContact.id ? {
          ...c,
          name: userData.name || c.name,
          phone: userData.phone || c.phone,
          lastContact: new Date().toISOString().split('T')[0]
        } : c));
      } else {
        const newContact: CRMContact = {
          id: 'CRM-' + Date.now(),
          name: userData.name,
          email: trimmedEmail,
          phone: userData.phone || '',
          type: 'Particulier',
          totalSpent: 0,
          projectsCount: 0,
          lastContact: new Date().toISOString().split('T')[0],
          messages: []
        };
        setContacts(prev => [newContact, ...prev]);
      }
    }

    return { success: true, message: `Utilisateur "${userData.name}" créé avec succès.` };
  };

  const updateUser = (id: string, userData: Partial<User & { password?: string }>): { success: boolean; message: string } => {
    if (userData.email) {
      const trimmedEmail = userData.email.trim().toLowerCase();
      const duplicate = users.find(u => u.id !== id && u.email.toLowerCase() === trimmedEmail);
      if (duplicate) {
        return { 
          success: false, 
          message: `Erreur de sécurité : L'adresse email "${trimmedEmail}" est déjà utilisée par "${duplicate.name}". Impossible d'utiliser deux comptes avec la même adresse email.` 
        };
      }
    }

    const formattedUserData = {
      ...userData,
      email: userData.email ? userData.email.trim().toLowerCase() : undefined
    };

    setUsers(prev => prev.map(u => u.id === id ? { 
      ...u, 
      ...formattedUserData,
      email: formattedUserData.email || u.email 
    } : u));

    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? {
        ...prev,
        name: userData.name !== undefined ? userData.name : prev.name,
        email: formattedUserData.email !== undefined ? formattedUserData.email : prev.email,
        phone: userData.phone !== undefined ? userData.phone : prev.phone,
        role: userData.role !== undefined ? userData.role : prev.role,
      } : null);
    }

    if (userData.email || userData.name || userData.phone) {
      const targetUser = users.find(u => u.id === id);
      const emailToMatch = (formattedUserData.email || targetUser?.email || '').toLowerCase();
      if (emailToMatch) {
        setContacts(prev => prev.map(c => c.email.toLowerCase() === emailToMatch ? {
          ...c,
          name: userData.name !== undefined ? userData.name : c.name,
          email: formattedUserData.email !== undefined ? formattedUserData.email : c.email,
          phone: userData.phone !== undefined ? userData.phone : c.phone,
          lastContact: new Date().toISOString().split('T')[0]
        } : c));
      }
    }

    return { success: true, message: 'Compte mis à jour avec succès.' };
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Synchronize state to localStorage
  useEffect(() => { localStorage.setItem('henrietz_v3_users', JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('henrietz_v3_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('henrietz_v3_current_user');
    }
  }, [currentUser]);
  useEffect(() => { localStorage.setItem('henrietz_v3_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('henrietz_v3_woods', JSON.stringify(woodSpecies)); }, [woodSpecies]);
  useEffect(() => { localStorage.setItem('henrietz_v3_quotes', JSON.stringify(quotes)); }, [quotes]);
  useEffect(() => { localStorage.setItem('henrietz_v3_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('henrietz_v3_pos', JSON.stringify(posTransactions)); }, [posTransactions]);
  useEffect(() => { localStorage.setItem('henrietz_v3_finance', JSON.stringify(financialRecords)); }, [financialRecords]);
  useEffect(() => { localStorage.setItem('henrietz_v3_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('henrietz_v3_contacts', JSON.stringify(contacts)); }, [contacts]);

  const login = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!user) {
      return { success: false, message: 'Aucun compte trouvé avec cet email.' };
    }
    if (user.password && user.password !== pass) {
      return { success: false, message: 'Mot de passe incorrect.' };
    }
    const cleanUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };
    setCurrentUser(cleanUser);
    if (cleanUser.role === 'admin') {
      setViewMode('admin');
    } else {
      setViewMode('client');
    }
    return { success: true, message: `Bienvenue, ${cleanUser.name} !` };
  };

  const register = (name: string, email: string, phone: string, pass: string, role: 'client' | 'admin' = 'client') => {
    const trimmedEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'Cet email est déjà utilisé.' };
    }
    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email: trimmedEmail,
      phone,
      role,
      password: pass
    };
    setUsers(prev => [...prev, newUser]);
    const cleanUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role
    };
    setCurrentUser(cleanUser);

    // Synchronize to CRM Contacts for clients
    if (role === 'client') {
      const existingContact = contacts.find(c => c.email.toLowerCase() === trimmedEmail);
      if (existingContact) {
        setContacts(prev => prev.map(c => c.id === existingContact.id ? {
          ...c,
          name: name || c.name,
          phone: phone || c.phone,
          lastContact: new Date().toISOString().split('T')[0]
        } : c));
      } else {
        const newContact: CRMContact = {
          id: 'CRM-' + Date.now(),
          name,
          email: trimmedEmail,
          phone: phone || '',
          type: 'Particulier',
          totalSpent: 0,
          projectsCount: 0,
          lastContact: new Date().toISOString().split('T')[0],
          messages: []
        };
        setContacts(prev => [newContact, ...prev]);
      }
    }

    if (role === 'admin') {
      setViewMode('admin');
    }
    return { success: true, message: 'Compte créé avec succès !' };
  };

  const logout = () => {
    setCurrentUser(null);
    setViewMode('client');
  };

  const updateUserPassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return { success: false, message: 'Non connecté.' };
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex === -1) return { success: false, message: 'Utilisateur non trouvé.' };
    const user = users[userIndex];
    if (user.password && user.password !== oldPass) {
      return { success: false, message: 'Mot de passe actuel incorrect.' };
    }
    const updatedUsers = [...users];
    updatedUsers[userIndex] = { ...user, password: newPass };
    setUsers(updatedUsers);
    return { success: true, message: 'Mot de passe mis à jour avec succès !' };
  };

  const resetUserPassword = (email: string, newPass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === trimmedEmail);
    if (userIndex === -1) {
      return { success: false, message: 'Aucun compte associé à cette adresse email.' };
    }
    const updatedUsers = [...users];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPass };
    setUsers(updatedUsers);
    return { success: true, message: 'Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.' };
  };

  // Product Actions
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProd,
      id: 'prod-' + Date.now()
    };
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addWoodSpecies = (newWood: Omit<WoodSpecies, 'id'>) => {
    const wood: WoodSpecies = {
      ...newWood,
      id: 'wood-' + Date.now()
    };
    setWoodSpecies(prev => [...prev, wood]);
  };

  const updateWoodSpecies = (id: string, updated: Partial<WoodSpecies>) => {
    setWoodSpecies(prev => prev.map(w => w.id === id ? { ...w, ...updated } : w));
  };

  const deleteWoodSpecies = (id: string) => {
    setWoodSpecies(prev => prev.filter(w => w.id !== id));
  };

  // Quotes Actions
  const addQuoteRequest = (data: Omit<QuoteRequest, 'id' | 'status' | 'date'>) => {
    const quote: QuoteRequest = {
      ...data,
      id: 'DEV-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
      status: 'En attente',
      date: new Date().toISOString().split('T')[0]
    };
    setQuotes(prev => [quote, ...prev]);

    // Also add to CRM
    const existingContact = contacts.find(c => c.email === data.clientEmail);
    if (existingContact) {
      setContacts(prev => prev.map(c => c.id === existingContact.id ? {
        ...c,
        projectsCount: c.projectsCount + 1,
        lastContact: new Date().toISOString().split('T')[0]
      } : c));
    } else {
      const newContact: CRMContact = {
        id: 'CRM-' + Date.now(),
        name: data.clientName,
        email: data.clientEmail,
        phone: data.clientPhone,
        type: 'Particulier',
        totalSpent: 0,
        projectsCount: 1,
        lastContact: new Date().toISOString().split('T')[0],
        messages: [{
          id: 'm-' + Date.now(),
          sender: 'Client',
          text: `Nouvelle demande de devis aménagement : ${data.projectType} (${data.woodType})`,
          date: new Date().toLocaleDateString('fr-FR')
        }]
      };
      setContacts(prev => [newContact, ...prev]);
    }
  };

  const updateQuoteStatus = (id: string, status: QuoteRequest['status'], notes?: string) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === id) {
        const updated = { ...q, status };
        if (notes) updated.notes = notes;
        
        // If validated, add to financial expected record
        if (status === 'Validé') {
          addFinancialRecord({
            type: 'Recette',
            category: 'Devis Aménagement',
            amount: q.estimatedPrice,
            date: new Date().toISOString().split('T')[0],
            description: `Acompte / Devis Validé : ${q.projectType} (${q.clientName})`,
            referenceNo: q.id
          });
        }
        return updated;
      }
      return q;
    }));
  };

  // Cart Actions
  const addToCart = (product: Product, quantity = 1, selectedVariant?: ProductVariant) => {
    const itemPrice = selectedVariant?.price || product.price;
    const itemImage = selectedVariant?.image || product.image;
    const variantName = selectedVariant?.name;
    const itemIdKey = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id;
    const itemDisplayName = selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemIdKey);
      if (existing) {
        return prev.map(item => item.id === itemIdKey 
          ? { ...item, quantity: item.quantity + quantity }
          : item
        );
      }
      return [...prev, {
        id: itemIdKey,
        productId: product.id,
        name: itemDisplayName,
        price: itemPrice,
        quantity,
        image: itemImage,
        variantName
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders Action
  const createOrder = (clientName: string, clientEmail: string, clientPhone: string) => {
    if (cart.length === 0) return;
    const orderId = 'CMD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: orderId,
      clientName,
      clientEmail,
      clientPhone,
      items: [...cart],
      totalAmount: cartTotal,
      paymentStatus: 'Payé',
      orderStatus: 'Nouvelle',
      date: new Date().toISOString().split('T')[0],
      source: 'Boutique Web'
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update stocks
    cart.forEach(item => {
      setProducts(prev => prev.map(p => p.id === item.productId ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p));
    });

    // Add financial entry
    addFinancialRecord({
      type: 'Recette',
      category: 'Vente Boutique',
      amount: cartTotal,
      date: new Date().toISOString().split('T')[0],
      description: `Commande E-commerce ${orderId} (${clientName})`,
      referenceNo: orderId
    });

    // Update or create CRM Contact and update totalSpent and projectsCount
    const trimmedOrderEmail = clientEmail.trim().toLowerCase();
    const existingCRMContact = contacts.find(c => c.email.toLowerCase() === trimmedOrderEmail);
    if (existingCRMContact) {
      setContacts(prev => prev.map(c => c.id === existingCRMContact.id ? {
        ...c,
        name: clientName || c.name,
        phone: clientPhone || c.phone,
        totalSpent: c.totalSpent + cartTotal,
        projectsCount: c.projectsCount + 1,
        lastContact: new Date().toISOString().split('T')[0]
      } : c));
    } else {
      const newContact: CRMContact = {
        id: 'CRM-' + Date.now(),
        name: clientName,
        email: trimmedOrderEmail,
        phone: clientPhone,
        type: 'Particulier',
        totalSpent: cartTotal,
        projectsCount: 1,
        lastContact: new Date().toISOString().split('T')[0],
        messages: [{
          id: 'm-' + Date.now(),
          sender: 'Client',
          text: `Commande Boutique E-commerce effectuée : ${orderId} (${cartTotal.toLocaleString('fr-FR')} FCFA)`,
          date: new Date().toLocaleDateString('fr-FR')
        }]
      };
      setContacts(prev => [newContact, ...prev]);
    }

    clearCart();
    setIsCartOpen(false);
  };

  const updateOrderStatus = (id: string, status: Order['orderStatus']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: status } : o));
  };

  // POS / Caisse Action
  const processPOSSale = (
    items: OrderItem[], 
    discount: number, 
    paymentMethod: POSTransaction['paymentMethod'], 
    cashierName: string
  ) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = Math.max(0, subtotal - discount);
    const ticketNo = 'TK-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);

    const transaction: POSTransaction = {
      id: 'POS-' + Date.now(),
      ticketNo,
      items,
      subtotal,
      discount,
      total,
      paymentMethod,
      cashierName,
      timestamp: new Date().toLocaleString('fr-FR')
    };

    setPosTransactions(prev => [transaction, ...prev]);

    // Update Product stocks
    items.forEach(item => {
      setProducts(prev => prev.map(p => p.id === item.productId ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p));
    });

    // Register financial transaction
    addFinancialRecord({
      type: 'Recette',
      category: 'Vente Boutique',
      amount: total,
      date: new Date().toISOString().split('T')[0],
      description: `Vente Caisse ${ticketNo} (${paymentMethod})`,
      referenceNo: ticketNo
    });
  };

  // Financial Action
  const addFinancialRecord = (record: Omit<FinancialRecord, 'id'>) => {
    const newRecord: FinancialRecord = {
      ...record,
      id: 'FIN-' + Date.now()
    };
    setFinancialRecords(prev => [newRecord, ...prev]);
  };

  // Employees Action
  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...emp,
      id: 'EMP-' + Math.floor(10 + Math.random() * 90)
    };
    setEmployees(prev => [...prev, newEmp]);
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  };

  // CRM Action
  const addContactMessage = (contactId: string, text: string, sender: 'Client' | 'HENRIETZ') => {
    setContacts(prev => {
      const exists = prev.some(c => c.id === contactId);
      if (exists) {
        return prev.map(c => {
          if (c.id === contactId) {
            return {
              ...c,
              lastContact: new Date().toISOString().split('T')[0],
              messages: [
                ...c.messages,
                {
                  id: 'm-' + Date.now(),
                  sender,
                  text,
                  date: new Date().toLocaleString('fr-FR')
                }
              ]
            };
          }
          return c;
        });
      } else {
        const newContact: CRMContact = {
          id: contactId,
          name: currentUser?.name || 'Nouveau Client',
          email: currentUser?.email || 'client@henrietz.ci',
          phone: currentUser?.phone || '',
          type: 'Particulier',
          totalSpent: 0,
          projectsCount: 0,
          lastContact: new Date().toISOString().split('T')[0],
          messages: [{
            id: 'm-' + Date.now(),
            sender,
            text,
            date: new Date().toLocaleString('fr-FR')
          }]
        };
        return [newContact, ...prev];
      }
    });
  };

  return (
    <AppContext.Provider value={{
      viewMode, setViewMode,
      activeAdminTab, setActiveAdminTab,
      currentUser, login, register, logout,
      isAuthModalOpen, setIsAuthModalOpen,
      authModalMode, setAuthModalMode,
      updateUserPassword, resetUserPassword,
      products, addProduct, updateProduct, deleteProduct,
      woodSpecies, addWoodSpecies, updateWoodSpecies, deleteWoodSpecies,
      quotes, addQuoteRequest, updateQuoteStatus,
      orders, createOrder, updateOrderStatus,
      posTransactions, processPOSSale,
      financialRecords, addFinancialRecord,
      employees, addEmployee, updateEmployee,
      contacts, addContactMessage,
      usersList: users, addUser, updateUser, deleteUser,
      siteSettings, updateSiteSettings,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      cartTotal, cartCount, isCartOpen, setIsCartOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
