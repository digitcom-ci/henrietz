export type ProductCategory = 'Salon' | 'Chambre' | 'Salle à Manger' | 'Bureau' | 'Bois & Matériaux' | 'Décoration';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Finition Noyer Brun", "Chêne Clair", "Format XL"
  color?: string; // hex code or color description
  size?: string; // e.g. "240 x 100 x 75 cm"
  price?: number; // optional price override in FCFA
  image: string;
  stock?: number;
  status?: 'En stock' | 'Sur commande' | 'Rupture';
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  description: string;
  woodType?: string;
  dimensions?: string;
  image: string;
  isCustomizable: boolean;
  status: 'En stock' | 'Sur commande' | 'Rupture';
  variants?: ProductVariant[];
}

export interface WoodSpecies {
  id: string;
  name: string;
  pricePerM2: number;
  density: string;
  description: string;
  image: string;
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectType: 'Aménagement Intérieur' | 'Dressing Sur-Mesure' | 'Cuisine & Comptoir' | 'Bibliothèque sur-mesure' | 'Découpe Bois Bruts';
  woodType: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  estimatedPrice: number;
  status: 'En attente' | 'Étude en cours' | 'Devis Transmis' | 'Validé' | 'En Fabrication' | 'Terminé' | 'Refusé';
  date: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantName?: string;
}

export interface Order {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'Payé' | 'Acompte (50%)' | 'En attente';
  orderStatus: 'Nouvelle' | 'En production' | 'Prêt à livrer' | 'Livrée';
  date: string;
  source: 'Boutique Web' | 'Caisse Atelier';
}

export interface POSTransaction {
  id: string;
  ticketNo: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'Carte Bancaire' | 'Espèces' | 'Virement' | 'Chèque';
  cashierName: string;
  timestamp: string;
}

export interface FinancialRecord {
  id: string;
  type: 'Recette' | 'Dépense';
  category: 'Vente Boutique' | 'Devis Aménagement' | 'Achat Matières Premières' | 'Salaires' | 'Charges Atelier' | 'Outillage' | 'Prestations & Primes';
  amount: number;
  date: string;
  description: string;
  referenceNo: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'Administrateur' | 'Maître Ébéniste' | 'Vendeur Caisse' | 'Designer d\'Intérieur' | 'Apprenti';
  email: string;
  phone: string;
  salary: number;
  status: 'Actif' | 'En Atelier' | 'En Congé';
  assignedProject?: string;
}

export interface CRMContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: 'Particulier' | 'Architecte' | 'Professionnel';
  totalSpent: number;
  projectsCount: number;
  lastContact: string;
  messages: {
    id: string;
    sender: 'Client' | 'HENRIETZ';
    text: string;
    date: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'admin';
}

export interface SiteSettings {
  companyName: string;
  phone: string;
  phoneAlt?: string;
  email: string;
  address: string;
  currency: string;
  taxRate: number; // TVA e.g. 18%
  siteStatus: 'Ouvert' | 'Fermeture Temporaire' | 'Fermeture Définitive';
  closureMessage: string;
  reopeningDate?: string;
  allowQuotesInMaintenance: boolean;
  enableOrders: boolean;
}

