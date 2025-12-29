
import React, { useState } from 'react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updatePrice = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice) || 0;
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, pricePerKg: price } : p
    ));
  };

  const updateStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, stockKg: Math.max(0, p.stockKg + delta), lastUpdated: new Date().toISOString() } : p
    ));
  };

  return (
    <div className="px-6 py-8 animate-in slide-in-from-right duration-500 bg-slate-50 min-h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-black text-blue-950 tracking-tight uppercase">Inventario Base</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ajusta stock y precios generales</p>
        </div>
        <button className="bg-blue-700 text-white p-4 rounded-3xl shadow-xl shadow-blue-100 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <div className="relative mb-8">
        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input 
          type="text" 
          placeholder="Filtrar por nombre de especie..."
          className="w-full bg-white border border-blue-100 rounded-3xl py-5 pl-14 pr-6 text-sm font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-[36px] border border-blue-50 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col gap-2">
              <h4 className="font-black text-blue-900 uppercase tracking-tight text-lg">{product.name}</h4>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Precio Sugerido:</span>
                <div className="flex items-center">
                    <span className="text-blue-600 font-black mr-1">$</span>
                    <input 
                        type="number" 
                        className="bg-blue-50/50 border-0 rounded-lg w-16 text-xs font-black text-blue-700 py-1 text-center"
                        value={product.pricePerKg}
                        onChange={(e) => updatePrice(product.id, e.target.value)}
                    />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className={`text-2xl font-black ${product.stockKg < 50 ? 'text-rose-600' : 'text-blue-900'}`}>
                  {product.stockKg.toFixed(1)} <span className="text-[10px] font-black text-slate-400">KG</span>
                </p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Cámara Actual</p>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => updateStock(product.id, 10)}
                  className="bg-blue-50 text-blue-700 w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all active:scale-90 border border-blue-100"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
                <button 
                  onClick={() => updateStock(product.id, -10)}
                  className="bg-slate-50 text-slate-400 w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
