import { Product, WoodSpecies, QuoteRequest, Order, POSTransaction, FinancialRecord, Employee, CRMContact } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Table Repas Royale - Noyer Massif',
    category: 'Salle à Manger',
    price: 2250000,
    stock: 0,
    description: 'Plateau monobloc en Noyer sélectionné à la main avec bords bruts (live edge) et piétement contemporain en laiton brossé.',
    woodType: 'Noyer Noble',
    dimensions: '240 x 100 x 75 cm',
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80',
    isCustomizable: true,
    status: 'Sur commande',
    variants: [
      {
        id: 'v-1-1',
        name: 'Finition Noyer Sombre (240 cm)',
        color: '#42170D',
        size: '240 x 100 cm',
        price: 2250000,
        image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'v-1-2',
        name: 'Finition Chêne Blond (200 cm)',
        color: '#D6B58B',
        size: '200 x 95 cm',
        price: 1950000,
        image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'v-1-3',
        name: 'Finition Teck Ambré (280 cm XL)',
        color: '#A85A2A',
        size: '280 x 110 cm',
        price: 2600000,
        image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1000&q=80'
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Buffet Enfilade Sculpté - Chêne Clair',
    category: 'Salon',
    price: 1890000,
    stock: 0,
    description: 'Meuble enfilade 4 portes aux lignes organiques épurées avec lattes ajourées en Chêne Massif.',
    woodType: 'Chêne Sélection',
    dimensions: '200 x 45 x 78 cm',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80',
    isCustomizable: true,
    status: 'Sur commande',
    variants: [
      {
        id: 'v-2-1',
        name: 'Chêne Clair Naturel (4 Portes)',
        color: '#F5E8D1',
        size: '200 cm',
        price: 1890000,
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'v-2-2',
        name: 'Noyer Ombré Sculpté (3 Portes)',
        color: '#42170D',
        size: '160 cm',
        price: 1650000,
        image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80'
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Fauteuil Artisanal Bouclé & Noyer',
    category: 'Salon',
    price: 850000,
    stock: 0,
    description: 'Structure galbée en Noyer teinté sombre et tissu bouclé ivoire haute densité.',
    woodType: 'Noyer',
    dimensions: '85 x 90 x 75 cm',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
    isCustomizable: true,
    status: 'Sur commande',
    variants: [
      {
        id: 'v-3-1',
        name: 'Tissu Bouclé Ivoire',
        color: '#F5E8D1',
        size: '85 cm',
        price: 850000,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'v-3-2',
        name: 'Velours Terracotta & Teck',
        color: '#8F3215',
        size: '85 cm',
        price: 890000,
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'v-3-3',
        name: 'Cuir Cognac Prestige',
        color: '#A85A2A',
        size: '85 cm',
        price: 950000,
        image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=1000&q=80'
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Bureau Minimaliste Executive Teck',
    category: 'Bureau',
    price: 1350000,
    stock: 0,
    description: 'Bureau de direction avec passages de câbles intégrés et tiroirs à fermeture douce en Teck massif.',
    woodType: 'Teck de Plantation',
    dimensions: '180 x 80 x 76 cm',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80',
    isCustomizable: true,
    status: 'Sur commande'
  },
  {
    id: 'prod-5',
    name: 'Lit King Size Tête de Lit Lattée',
    category: 'Chambre',
    price: 2100000,
    stock: 0,
    description: 'Lit complet avec sommier à lattes et majestueuse tête de lit panoramique en Chêne fumé.',
    woodType: 'Chêne Fumé',
    dimensions: '210 x 200 x 120 cm',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
    isCustomizable: true,
    status: 'Sur commande'
  },
  {
    id: 'prod-6',
    name: 'Planche Découpe Bois d\'Iroko Brut',
    category: 'Bois & Matériaux',
    price: 120000,
    stock: 15,
    description: 'Matière brute sélectionnée pour créations sur-mesure, poncée et traitée aux huiles bio.',
    woodType: 'Iroko Exotique',
    dimensions: '120 x 40 x 4 cm',
    image: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=1000&q=80',
    isCustomizable: true,
    status: 'En stock'
  },
  {
    id: 'prod-7',
    name: 'Vase Céramique & Socle Bois Sculpté',
    category: 'Décoration',
    price: 220000,
    stock: 0,
    description: 'Pièce décorative fait main avec socle en ronce de Noyer gravé à la main.',
    woodType: 'Noyer',
    dimensions: '25 x 25 x 45 cm',
    image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=1000&q=80',
    isCustomizable: false,
    status: 'Sur commande'
  }
];

export const INITIAL_WOOD_SPECIES: WoodSpecies[] = [
  {
    id: 'wood-1',
    name: 'Noyer d\'Amérique (Noce)',
    pricePerM2: 150000,
    density: '610 kg/m³',
    description: 'Bois noble d\'exception aux nuances chocolat profond, idéal pour tables de prestige et meubles de salon.',
    image: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'wood-2',
    name: 'Chêne Massif Sélection',
    pricePerM2: 110000,
    density: '710 kg/m³',
    description: 'Robuste, élégant et intemporel. Grain droit avec maillures fines, parfait pour les dressings et agencements.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'wood-3',
    name: 'Teck de Birmanie',
    pricePerM2: 220000,
    density: '650 kg/m³',
    description: 'Essence hautement imputrescible chargée en huiles naturelles, idéale pour terrasses et pièces d\'eau.',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'wood-4',
    name: 'Iroko Côte d\'Ivoire',
    pricePerM2: 130000,
    density: '660 kg/m³',
    description: 'Bois noble africain doré aux reflets ambrés, excellente stabilité dimensionnelle pour comptoirs et agencements.',
    image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_QUOTES: QuoteRequest[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_POS_TRANSACTIONS: POSTransaction[] = [];

export const INITIAL_FINANCIAL_RECORDS: FinancialRecord[] = [];

export const INITIAL_EMPLOYEES: Employee[] = [];

export const INITIAL_CONTACTS: CRMContact[] = [];
