
import React, { useState } from 'react';
import { Product, Purchase } from '../types';

interface ComprasProps {
  products: Product[];
  onPurchase: (purchase: Purchase) => void;
}

const Compras: React.FC<ComprasProps> = ({ products, onPurchase }) => {
  const [provider, setProvider] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState(0);
  const [cost, setCost] = useState(0);

  const handleSave = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product || !provider || qty <= 0 || cost <= 0) return;

    onPurchase({
      id: `p-${Date.now()}`,
      provider,
      productName: product.name,
      quantityKg: qty,
      totalCost: cost,
      timestamp: new Date().toISOString()
    });

    setProvider('');
    setSelectedProductId('');
    setQty(0);
    setCost(0);
  };

  return (
    <div className="px-6 py-8 animate-in slide-in-from-right duration-300">
      <h2 className="text-2xl font-black text-blue-950 mb-6">Registro de Compras</h2>
      
      <div className="bg-white p-6 rounded-[32px] border border-blue-100 shadow-sm space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Proveedor / Barco</label>
          <input 
            type="text"
            className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm font-bold text-blue-900 focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del proveedor"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Especie Recibida</label>
          <select 
            className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm font-bold text-blue-900 focus:ring-2 focus:ring-blue-500"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Cantidad (KG)</label>
            <input 
              type="number"
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm font-bold text-blue-900 focus:ring-2 focus:ring-blue-500"
              placeholder="0.0"
              value={qty || ''}
              onChange={(e) => setQty(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Costo Total ($)</label>
            <input 
              type="number"
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm font-bold text-blue-900 focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              value={cost || ''}
              onChange={(e) => setCost(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl mt-4 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">save_as</span>
          REGISTRAR COMPRA
        </button>
      </div>
    </div>
  );
};

export default Compras;
