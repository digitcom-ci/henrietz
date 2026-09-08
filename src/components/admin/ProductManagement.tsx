import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, WoodSpecies, ProductCategory, ProductVariant } from '../../types';
import { Package, Plus, Trash2, TreePine, AlertTriangle, Layers, Upload, Camera, Image as ImageIcon, Edit } from 'lucide-react';

const PRESET_PRODUCT_IMAGES = [
  { label: 'Table Noyer', url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Table Chêne', url: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Buffet Sculpté', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fauteuil Bouclé', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fauteuil Cuir', url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bureau Teck', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lit Fumé', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
  { label: 'Essence Iroko', url: 'https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=800&q=80' }
];

export const ProductManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, woodSpecies, addWoodSpecies, updateWoodSpecies, deleteWoodSpecies } = useApp();
  
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'wood'>('products');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddWoodOpen, setIsAddWoodOpen] = useState(false);

  // Edit states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingWood, setEditingWood] = useState<WoodSpecies | null>(null);

  // New product form state (FCFA)
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Salon');
  const [price, setPrice] = useState(850000);
  const [stock, setStock] = useState(0);
  const [prodStatus, setProdStatus] = useState<Product['status']>('Sur commande');
  const [description, setDescription] = useState('');
  const [woodType, setWoodType] = useState('Noyer Noble');
  const [dimensions, setDimensions] = useState('200 x 90 x 75 cm');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80');

  // Edit product form state
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ProductCategory>('Salon');
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [editStatus, setEditStatus] = useState<Product['status']>('Sur commande');
  const [editDescription, setEditDescription] = useState('');
  const [editWoodType, setEditWoodType] = useState('');
  const [editDimensions, setEditDimensions] = useState('');
  const [editImage, setEditImage] = useState('');

  // Variants state for new product
  const [variantsList, setVariantsList] = useState<ProductVariant[]>([]);
  const [vName, setVName] = useState('');
  const [vImage, setVImage] = useState('');
  const [vPrice, setVPrice] = useState<number>(0);
  const [vSize, setVSize] = useState('');
  const [vStock, setVStock] = useState<number>(0);
  const [vStatus, setVStatus] = useState<Product['status']>('Sur commande');
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);

  // Variants state for edit product
  const [editVariantsList, setEditVariantsList] = useState<ProductVariant[]>([]);
  const [editVName, setEditVName] = useState('');
  const [editVImage, setEditVImage] = useState('');
  const [editVPrice, setEditVPrice] = useState<number>(0);
  const [editVSize, setEditVSize] = useState('');
  const [editVStock, setEditVStock] = useState<number>(0);
  const [editVStatus, setEditVStatus] = useState<Product['status']>('Sur commande');
  const [editingEditVariantId, setEditingEditVariantId] = useState<string | null>(null);

  // New wood form state (FCFA)
  const [woodName, setWoodName] = useState('');
  const [pricePerM2, setPricePerM2] = useState(130000);
  const [density, setDensity] = useState('660 kg/m³');
  const [woodDesc, setWoodDesc] = useState('');
  const [woodImg, setWoodImg] = useState('https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=600&q=80');

  // Edit wood form state
  const [editWoodName, setEditWoodName] = useState('');
  const [editWoodPricePerM2, setEditWoodPricePerM2] = useState(0);
  const [editWoodDensity, setEditWoodDensity] = useState('');
  const [editWoodDesc, setEditWoodDesc] = useState('');
  const [editWoodImg, setEditWoodImg] = useState('');

  const handleAddVariant = () => {
    if (!vName.trim()) return;
    if (editingVariantId) {
      setVariantsList(prev => prev.map(v => v.id === editingVariantId ? {
        ...v,
        name: vName.trim(),
        image: vImage.trim() || image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        price: vPrice > 0 ? Number(vPrice) : Number(price),
        size: vSize.trim() || dimensions,
        stock: Number(vStock),
        status: vStatus
      } : v));
      setEditingVariantId(null);
    } else {
      const newVariant: ProductVariant = {
        id: 'v-' + Date.now() + Math.floor(Math.random() * 100),
        name: vName.trim(),
        image: vImage.trim() || image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        price: vPrice > 0 ? Number(vPrice) : Number(price),
        size: vSize.trim() || dimensions,
        stock: Number(vStock),
        status: vStatus
      };
      setVariantsList(prev => [...prev, newVariant]);
    }
    setVName('');
    setVImage('');
    setVPrice(0);
    setVSize('');
    setVStock(0);
    setVStatus('Sur commande');
  };

  const handleStartEditVariant = (variant: ProductVariant) => {
    setEditingVariantId(variant.id);
    setVName(variant.name);
    setVSize(variant.size || '');
    setVPrice(variant.price || 0);
    setVImage(variant.image || '');
    setVStock(variant.stock ?? 0);
    setVStatus(variant.status || 'Sur commande');
  };

  const handleRemoveVariant = (id: string) => {
    if (editingVariantId === id) setEditingVariantId(null);
    setVariantsList(prev => prev.filter(v => v.id !== id));
  };

  const handleMainImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setVImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    addProduct({
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      description,
      woodType,
      dimensions,
      image: image || 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
      isCustomizable: true,
      status: prodStatus,
      variants: variantsList.length > 0 ? variantsList : undefined
    });
    setIsAddProductOpen(false);
    setName('');
    setVariantsList([]);
  };

  const handleCreateWood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!woodName) return;
    addWoodSpecies({
      name: woodName,
      pricePerM2: Number(pricePerM2),
      density,
      description: woodDesc,
      image: woodImg
    });
    setIsAddWoodOpen(false);
    setWoodName('');
  };

  // Product edit handlers
  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditPrice(product.price);
    setEditStock(product.stock);
    setEditStatus(product.status || 'Sur commande');
    setEditDescription(product.description || '');
    setEditWoodType(product.woodType || '');
    setEditDimensions(product.dimensions || '');
    setEditImage(product.image || '');
    setEditVariantsList(product.variants ? [...product.variants] : []);
    setEditVName('');
    setEditVImage('');
    setEditVPrice(0);
    setEditVSize('');
    setEditVStock(0);
    setEditVStatus('Sur commande');
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editName || !editPrice) return;
    updateProduct(editingProduct.id, {
      name: editName,
      category: editCategory,
      price: Number(editPrice),
      stock: Number(editStock),
      description: editDescription,
      woodType: editWoodType,
      dimensions: editDimensions,
      image: editImage,
      status: editStatus,
      variants: editVariantsList.length > 0 ? editVariantsList : undefined
    });
    setEditingProduct(null);
  };

  const handleAddEditVariant = () => {
    if (!editVName.trim()) return;
    if (editingEditVariantId) {
      setEditVariantsList(prev => prev.map(v => v.id === editingEditVariantId ? {
        ...v,
        name: editVName.trim(),
        image: editVImage.trim() || editImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        price: editVPrice > 0 ? Number(editVPrice) : Number(editPrice),
        size: editVSize.trim() || editDimensions,
        stock: Number(editVStock),
        status: editVStatus
      } : v));
      setEditingEditVariantId(null);
    } else {
      const newVariant: ProductVariant = {
        id: 'v-' + Date.now() + Math.floor(Math.random() * 100),
        name: editVName.trim(),
        image: editVImage.trim() || editImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        price: editVPrice > 0 ? Number(editVPrice) : Number(editPrice),
        size: editVSize.trim() || editDimensions,
        stock: Number(editVStock),
        status: editVStatus
      };
      setEditVariantsList(prev => [...prev, newVariant]);
    }
    setEditVName('');
    setEditVImage('');
    setEditVPrice(0);
    setEditVSize('');
    setEditVStock(0);
    setEditVStatus('Sur commande');
  };

  const handleStartEditEditVariant = (variant: ProductVariant) => {
    setEditingEditVariantId(variant.id);
    setEditVName(variant.name);
    setEditVSize(variant.size || '');
    setEditVPrice(variant.price || 0);
    setEditVImage(variant.image || '');
    setEditVStock(variant.stock ?? 0);
    setEditVStatus(variant.status || 'Sur commande');
  };

  const handleRemoveEditVariant = (id: string) => {
    if (editingEditVariantId === id) setEditingEditVariantId(null);
    setEditVariantsList(prev => prev.filter(v => v.id !== id));
  };

  const handleEditMainImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditVariantImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditVImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Wood edit handlers
  const handleOpenEditWood = (wood: WoodSpecies) => {
    setEditingWood(wood);
    setEditWoodName(wood.name);
    setEditWoodPricePerM2(wood.pricePerM2);
    setEditWoodDensity(wood.density);
    setEditWoodDesc(wood.description || '');
    setEditWoodImg(wood.image || '');
  };

  const handleSaveEditWood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWood || !editWoodName) return;
    updateWoodSpecies(editingWood.id, {
      name: editWoodName,
      pricePerM2: Number(editWoodPricePerM2),
      density: editWoodDensity,
      description: editWoodDesc,
      image: editWoodImg
    });
    setEditingWood(null);
  };

  const handleEditWoodImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditWoodImg(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddWoodImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setWoodImg(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const totalVariantsCount = products.reduce((acc, p) => acc + (p.variants ? p.variants.length : 0), 0);
  const totalArticlesCount = products.length + totalVariantsCount;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-title text-lg font-bold text-henrietz-walnut flex items-center gap-2">
              <Package className="w-5 h-5 text-henrietz-gold" />
              Catalogue Produits & Essences de Bois (FCFA)
            </h2>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold font-mono border border-amber-300">
              {totalArticlesCount} Articles Totaux ({products.length} Meubles + {totalVariantsCount} Variantes)
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5 font-normal tracking-wide">
            Ajoutez de nouveaux meubles au catalogue Abidjan, gérez les stocks atelier ({totalArticlesCount} références incluant déclinaisons) et les tarifs des essences de bois bruts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeSubTab === 'products' ? (
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-3.5 py-2 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-semibold text-[11px] rounded-lg shadow-sm flex items-center gap-1.5 transition uppercase tracking-wide whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              Ajouter un Meuble
            </button>
          ) : (
            <button
              onClick={() => setIsAddWoodOpen(true)}
              className="px-3.5 py-2 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-semibold text-[11px] rounded-lg shadow-sm flex items-center gap-1.5 transition uppercase tracking-wide whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              Ajouter une Essence
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('products')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 uppercase tracking-wider whitespace-nowrap shrink-0 ${
            activeSubTab === 'products'
              ? 'bg-henrietz-walnut text-henrietz-gold shadow'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Catalogue Meubles & Déco ({totalArticlesCount} articles total)
        </button>

        <button
          onClick={() => setActiveSubTab('wood')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 uppercase tracking-wider whitespace-nowrap shrink-0 ${
            activeSubTab === 'wood'
              ? 'bg-henrietz-walnut text-henrietz-gold shadow'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <TreePine className="w-4 h-4" />
          Essences de Bois ({woodSpecies.length})
        </button>
      </div>

      {/* Products Table View */}
      {activeSubTab === 'products' ? (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF6F0] border-b border-gray-200 text-gray-600 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="p-4">Article</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Essence Bois</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Prix (FCFA)</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0" 
                      />
                      <div>
                        <h4 className="font-title font-bold text-henrietz-walnut text-sm">{product.name}</h4>
                        <span className="text-[11px] text-gray-500 font-mono">Dim: {product.dimensions}</span>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-gray-700 uppercase tracking-wider">
                      {product.category}
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg font-medium text-[11px]">
                        {product.woodType || 'Standard'}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={product.stock}
                          onChange={(e) => updateProduct(product.id, { 
                            stock: Number(e.target.value),
                            status: Number(e.target.value) > 0 ? 'En stock' : 'Rupture'
                          })}
                          className="w-16 px-2 py-1 bg-gray-50 border border-gray-300 rounded-lg text-xs text-center font-mono font-bold"
                        />
                        {product.stock <= 2 && (
                          <span title="Stock faible !">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-title font-bold text-sm text-henrietz-oak">
                      {product.price.toLocaleString('fr-FR')} FCFA
                    </td>

                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        className="p-2 text-henrietz-walnut hover:text-henrietz-gold hover:bg-amber-50 rounded-xl transition"
                        title="Modifier l'article"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Supprimer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Wood Species Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {woodSpecies.map(wood => (
            <div key={wood.id} className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between space-y-4 relative group">
              <div className="flex gap-3 items-start justify-between">
                <div className="flex gap-3 items-center">
                  <img 
                    src={wood.image} 
                    alt={wood.name} 
                    className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0" 
                  />
                  <div>
                    <h3 className="font-title font-bold text-base text-henrietz-walnut leading-snug">{wood.name}</h3>
                    <span className="text-xs font-mono font-bold text-henrietz-oak block">
                      Tarif : {wood.pricePerM2.toLocaleString('fr-FR')} FCFA / m²
                    </span>
                    <p className="text-[11px] text-gray-400">Masse : {wood.density}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => handleOpenEditWood(wood)}
                    className="p-1.5 text-henrietz-walnut hover:text-henrietz-gold hover:bg-amber-50 rounded-lg transition"
                    title="Éditer l'essence"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteWoodSpecies(wood.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Supprimer l'essence"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-[#FAF6F0] p-3.5 rounded-xl font-light tracking-wider">
                {wood.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-henrietz-gold/40 max-h-[90vh] flex flex-col">
            
            {/* Modal Fixed Header */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 shrink-0">
              <h3 className="font-title font-bold text-lg text-henrietz-walnut flex items-center gap-2">
                <Package className="w-5 h-5 text-henrietz-gold" />
                Ajouter un Meuble & ses Variantes
              </h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-gray-400 font-bold hover:text-gray-600">✕</button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateProduct} className="mt-3 space-y-4 overflow-y-auto pr-1 flex-1 font-sans">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nom du Meuble / Objet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Table Repas Iroko Massif"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  >
                    {['Salon', 'Chambre', 'Salle à Manger', 'Bureau', 'Bois & Matériaux', 'Décoration'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Essence de Bois</label>
                  <input
                    type="text"
                    placeholder="Ex: Iroko Exotique"
                    value={woodType}
                    onChange={(e) => setWoodType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Prix FCFA *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stock En Atelier</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Statut Pièce *</label>
                  <select
                    value={prodStatus}
                    onChange={(e) => setProdStatus(e.target.value as Product['status'])}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-henrietz-walnut"
                  >
                    <option value="Sur commande">Sur Commande (Sur-Mesure)</option>
                    <option value="En stock">En Stock (Dispo)</option>
                    <option value="Rupture">Rupture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dimensions</label>
                <input
                  type="text"
                  placeholder="Dimensions ex: 180 x 90 x 75 cm"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              {/* Main Photo Selection with File Picker & Presets */}
              <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-henrietz-gold/30 space-y-2">
                <label className="block text-xs font-bold text-henrietz-walnut flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-henrietz-gold" />
                  Photo Principale du Meuble *
                </label>

                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-300 bg-gray-100 shrink-0 relative">
                    <img src={image} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer px-3.5 py-2 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-semibold text-[11px] rounded-xl shadow-xs inline-flex items-center gap-1.5 transition uppercase tracking-wide">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Importer une photo (Fichier)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleMainImageFileUpload}
                        className="hidden" 
                      />
                    </label>

                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                      <span className="text-[10px] text-gray-500 font-bold uppercase shrink-0">Galerie :</span>
                      {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImage(preset.url)}
                          className={`w-6 h-6 rounded-md overflow-hidden border transition shrink-0 ${
                            image === preset.url ? 'border-henrietz-gold ring-2 ring-henrietz-gold/40 scale-105' : 'border-gray-300 opacity-60 hover:opacity-100'
                          }`}
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Ou coller une URL d'image (https://...)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description Fiche Produit</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                ></textarea>
              </div>

              {/* Add Variants Sub-form Section */}
              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-henrietz-gold/30 space-y-3 font-sans">
                <div className="flex justify-between items-center">
                  <h4 className="font-title font-bold text-xs text-henrietz-walnut flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-henrietz-gold" />
                    Ajouter des Variantes (Finition, Taille & Photos)
                  </h4>
                  <span className="text-[10px] font-bold text-henrietz-oak font-mono">{variantsList.length} ajoutée(s)</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Nom variante (ex: Chêne Blond)"
                    value={vName}
                    onChange={(e) => setVName(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Dimension (ex: 200 x 95 cm)"
                    value={vSize}
                    onChange={(e) => setVSize(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="number"
                    placeholder="Prix variante FCFA"
                    value={vPrice || ''}
                    onChange={(e) => setVPrice(Number(e.target.value))}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono font-bold"
                  />
                  
                  {/* Variant File Upload Button */}
                  <label className="cursor-pointer px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs flex items-center justify-between text-gray-700 hover:bg-gray-50">
                    <span className="truncate">{vImage ? 'Photo sélectionnée' : 'Photo variante'}</span>
                    <Upload className="w-3.5 h-3.5 text-henrietz-walnut shrink-0" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleVariantImageFileUpload}
                      className="hidden" 
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Stock Variante</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Stock"
                      value={vStock}
                      onChange={(e) => setVStock(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Statut Variante</label>
                    <select
                      value={vStatus}
                      onChange={(e) => setVStatus(e.target.value as Product['status'])}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-henrietz-walnut"
                    >
                      <option value="Sur commande">Sur Commande</option>
                      <option value="En stock">En Stock</option>
                      <option value="Rupture">Rupture</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] text-gray-500 font-bold uppercase shrink-0">Photos Galerie :</span>
                  {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setVImage(preset.url)}
                      className={`w-6 h-6 rounded-md overflow-hidden border transition shrink-0 ${
                        vImage === preset.url ? 'border-henrietz-gold ring-2 ring-henrietz-gold/40 scale-105' : 'border-gray-300 opacity-60 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="w-full py-2 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-bold text-[11px] rounded-lg transition shadow-xs flex items-center justify-center gap-1 uppercase tracking-wider"
                >
                  {editingVariantId ? (
                    <>
                      <Edit className="w-3.5 h-3.5" />
                      Mettre à jour cette variante
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter cette variante à la liste
                    </>
                  )}
                </button>

                {/* List of Added Variants */}
                {variantsList.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-gray-200">
                    {variantsList.map((variant) => (
                      <div key={variant.id} className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                        editingVariantId === variant.id ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300' : 'bg-white border-gray-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <img src={variant.image} alt={variant.name} className="w-7 h-7 rounded-lg object-cover border border-gray-200 shrink-0" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 block leading-tight">{variant.name}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold ${
                                variant.status === 'En stock' ? 'bg-emerald-100 text-emerald-800' :
                                variant.status === 'Rupture' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {variant.status || 'Sur commande'}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono">
                              {(variant.price || price).toLocaleString('fr-FR')} FCFA • Stock: {variant.stock ?? 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditVariant(variant)}
                            className="text-henrietz-walnut hover:text-henrietz-gold p-1 font-bold rounded-md hover:bg-amber-100"
                            title="Modifier cette variante"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(variant.id)}
                            className="text-red-500 hover:text-red-700 font-bold p-1 rounded-md hover:bg-red-50"
                            title="Supprimer cette variante"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 shrink-0">
                <button
                  type="submit"
                  className="w-full py-3 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl hover:bg-henrietz-oak uppercase tracking-wider shadow-md"
                >
                  Enregistrer et Publier le Produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Wood Modal */}
      {isAddWoodOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-henrietz-gold/40">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="font-title font-bold text-xl text-henrietz-walnut">Ajouter une Essence de Bois</h3>
              <button onClick={() => setIsAddWoodOpen(false)} className="text-gray-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateWood} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nom de l'Essence *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ébène de Côte d'Ivoire"
                  value={woodName}
                  onChange={(e) => setWoodName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Prix Moyen FCFA / m²</label>
                  <input
                    type="number"
                    required
                    value={pricePerM2}
                    onChange={(e) => setPricePerM2(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Densité (kg/m³)</label>
                  <input
                    type="text"
                    value={density}
                    onChange={(e) => setDensity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description & Caractéristiques</label>
                <textarea
                  rows={2}
                  value={woodDesc}
                  onChange={(e) => setWoodDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                ></textarea>
              </div>

              {/* Photo Upload for Add Wood */}
              <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-henrietz-gold/30 space-y-2">
                <label className="block text-xs font-bold text-henrietz-walnut flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-henrietz-gold" />
                  Photo de l'Essence
                </label>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-300 bg-gray-100 shrink-0">
                    <img src={woodImg} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-semibold text-[11px] rounded-xl shadow-xs inline-flex items-center gap-1.5 transition uppercase tracking-wide">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Importer Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAddWoodImageFileUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="URL d'image (https://...)"
                  value={woodImg}
                  onChange={(e) => setWoodImg(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full py-3 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl hover:bg-henrietz-oak uppercase tracking-wider"
                >
                  Ajouter l'Essence au Tarif ERP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-henrietz-gold/40 max-h-[90vh] flex flex-col">
            
            {/* Modal Fixed Header */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 shrink-0">
              <h3 className="font-title font-bold text-lg text-henrietz-walnut flex items-center gap-2">
                <Edit className="w-5 h-5 text-henrietz-gold" />
                Modifier le Meuble : {editingProduct.name}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 font-bold hover:text-gray-600">✕</button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveEditProduct} className="mt-3 space-y-4 overflow-y-auto pr-1 flex-1 font-sans">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nom du Meuble *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  >
                    {['Salon', 'Chambre', 'Salle à Manger', 'Bureau', 'Bois & Matériaux', 'Décoration'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Essence de Bois</label>
                  <input
                    type="text"
                    value={editWoodType}
                    onChange={(e) => setEditWoodType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Prix FCFA *</label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold font-mono text-henrietz-oak"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stock En Atelier</label>
                  <input
                    type="number"
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Statut Pièce *</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Product['status'])}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-henrietz-walnut"
                  >
                    <option value="Sur commande">Sur Commande (Sur-Mesure)</option>
                    <option value="En stock">En Stock (Dispo)</option>
                    <option value="Rupture">Rupture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dimensions</label>
                <input
                  type="text"
                  value={editDimensions}
                  onChange={(e) => setEditDimensions(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                />
              </div>

              {/* Main Photo Selection for Edit */}
              <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-henrietz-gold/30 space-y-2">
                <label className="block text-xs font-bold text-henrietz-walnut flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-henrietz-gold" />
                  Photo Principale du Meuble *
                </label>

                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-300 bg-gray-100 shrink-0 relative">
                    <img src={editImage} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer px-3.5 py-2 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-semibold text-[11px] rounded-xl shadow-xs inline-flex items-center gap-1.5 transition uppercase tracking-wide">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Importer nouvelle photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleEditMainImageFileUpload}
                        className="hidden" 
                      />
                    </label>

                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                      <span className="text-[10px] text-gray-500 font-bold uppercase shrink-0">Galerie :</span>
                      {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditImage(preset.url)}
                          className={`w-6 h-6 rounded-md overflow-hidden border transition shrink-0 ${
                            editImage === preset.url ? 'border-henrietz-gold ring-2 ring-henrietz-gold/40 scale-105' : 'border-gray-300 opacity-60 hover:opacity-100'
                          }`}
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Ou coller une URL d'image (https://...)"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description Fiche Produit</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                ></textarea>
              </div>

              {/* Edit Variants Sub-form Section */}
              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-henrietz-gold/30 space-y-3 font-sans">
                <div className="flex justify-between items-center">
                  <h4 className="font-title font-bold text-xs text-henrietz-walnut flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-henrietz-gold" />
                    Gérer les Variantes ({editVariantsList.length})
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Nom variante (ex: Chêne Blond)"
                    value={editVName}
                    onChange={(e) => setEditVName(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Dimension (ex: 200 x 95 cm)"
                    value={editVSize}
                    onChange={(e) => setEditVSize(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="number"
                    placeholder="Prix variante FCFA"
                    value={editVPrice || ''}
                    onChange={(e) => setEditVPrice(Number(e.target.value))}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono font-bold"
                  />
                  
                  {/* Variant File Upload Button */}
                  <label className="cursor-pointer px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs flex items-center justify-between text-gray-700 hover:bg-gray-50">
                    <span className="truncate">{editVImage ? 'Photo sélectionnée' : 'Photo variante'}</span>
                    <Upload className="w-3.5 h-3.5 text-henrietz-walnut shrink-0" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleEditVariantImageFileUpload}
                      className="hidden" 
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Stock Variante</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Stock"
                      value={editVStock}
                      onChange={(e) => setEditVStock(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Statut Variante</label>
                    <select
                      value={editVStatus}
                      onChange={(e) => setEditVStatus(e.target.value as Product['status'])}
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-henrietz-walnut"
                    >
                      <option value="Sur commande">Sur Commande</option>
                      <option value="En stock">En Stock</option>
                      <option value="Rupture">Rupture</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] text-gray-500 font-bold uppercase shrink-0">Photos Galerie :</span>
                  {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditVImage(preset.url)}
                      className={`w-6 h-6 rounded-md overflow-hidden border transition shrink-0 ${
                        editVImage === preset.url ? 'border-henrietz-gold ring-2 ring-henrietz-gold/40 scale-105' : 'border-gray-300 opacity-60 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddEditVariant}
                  className="w-full py-2 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-bold text-[11px] rounded-lg transition shadow-xs flex items-center justify-center gap-1 uppercase tracking-wider"
                >
                  {editingEditVariantId ? (
                    <>
                      <Edit className="w-3.5 h-3.5" />
                      Mettre à jour la variante
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter cette variante
                    </>
                  )}
                </button>

                {/* List of Added Variants */}
                {editVariantsList.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-gray-200">
                    {editVariantsList.map((variant) => (
                      <div key={variant.id} className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                        editingEditVariantId === variant.id ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300' : 'bg-white border-gray-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <img src={variant.image} alt={variant.name} className="w-7 h-7 rounded-lg object-cover border border-gray-200 shrink-0" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 block leading-tight">{variant.name}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold ${
                                variant.status === 'En stock' ? 'bg-emerald-100 text-emerald-800' :
                                variant.status === 'Rupture' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {variant.status || 'Sur commande'}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono">
                              {(variant.price || editPrice).toLocaleString('fr-FR')} FCFA • Stock: {variant.stock ?? 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditEditVariant(variant)}
                            className="text-henrietz-walnut hover:text-henrietz-gold p-1 font-bold rounded-md hover:bg-amber-100"
                            title="Modifier cette variante"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveEditVariant(variant.id)}
                            className="text-red-500 hover:text-red-700 font-bold p-1 rounded-md hover:bg-red-50"
                            title="Supprimer cette variante"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 shrink-0">
                <button
                  type="submit"
                  className="w-full py-3 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl hover:bg-henrietz-oak uppercase tracking-wider shadow-md"
                >
                  Enregistrer les Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Wood Modal */}
      {editingWood && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-henrietz-gold/40">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="font-title font-bold text-xl text-henrietz-walnut flex items-center gap-2">
                <Edit className="w-5 h-5 text-henrietz-gold" />
                Modifier l'Essence : {editingWood.name}
              </h3>
              <button onClick={() => setEditingWood(null)} className="text-gray-400 font-bold hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSaveEditWood} className="mt-4 space-y-4 font-sans">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nom de l'Essence *</label>
                <input
                  type="text"
                  required
                  value={editWoodName}
                  onChange={(e) => setEditWoodName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Prix Moyen FCFA / m²</label>
                  <input
                    type="number"
                    required
                    value={editWoodPricePerM2}
                    onChange={(e) => setEditWoodPricePerM2(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold font-mono text-henrietz-oak"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Densité (kg/m³)</label>
                  <input
                    type="text"
                    value={editWoodDensity}
                    onChange={(e) => setEditWoodDensity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description & Caractéristiques</label>
                <textarea
                  rows={2}
                  value={editWoodDesc}
                  onChange={(e) => setEditWoodDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                ></textarea>
              </div>

              {/* Photo Upload for Edit Wood */}
              <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-henrietz-gold/30 space-y-2">
                <label className="block text-xs font-bold text-henrietz-walnut flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-henrietz-gold" />
                  Photo de l'Essence
                </label>
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-300 bg-gray-100 shrink-0">
                    <img src={editWoodImg} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 bg-henrietz-walnut text-henrietz-gold hover:bg-henrietz-oak font-semibold text-[11px] rounded-xl shadow-xs inline-flex items-center gap-1.5 transition uppercase tracking-wide">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Importer Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleEditWoodImageFileUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="URL d'image (https://...)"
                  value={editWoodImg}
                  onChange={(e) => setEditWoodImg(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full py-3 bg-henrietz-walnut text-henrietz-gold font-bold text-xs rounded-xl hover:bg-henrietz-oak uppercase tracking-wider shadow-md"
                >
                  Mettre à jour l'Essence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
