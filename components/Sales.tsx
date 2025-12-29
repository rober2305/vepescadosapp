
import React, { useState } from 'react';
import { Product, Sale, SaleItem } from '../types';

interface SalesProps {
  products: Product[];
  onSaleComplete: (sale: Sale) => void;
}

const Sales: React.FC<SalesProps> = ({ products, onSaleComplete }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [qty, setQty] = useState<number>(1);

  const addToCart = () => {
    if (!selectedProductId) return;
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(prev => prev.map(item => 
        item.productId === product.id ? { ...item, quantityKg: item.quantityKg + qty } : item
      ));
    } else {
      setCart(prev => [...prev, {
        productId: product.id,
        productName: product.name,
        quantityKg: qty,
        priceAtSale: product.pricePerKg
      }]);
    }
    setQty(1);
    setSelectedProductId('');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.productId !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.quantityKg * item.priceAtSale), 0);

  const finalizeSale = () => {
    if (cart.length === 0) return;
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      items: cart,
      totalAmount: total,
      paymentMethod: 'Cash'
    };
    onSaleComplete(newSale);
    setCart([]);
  };

  return (
    <div className="px-6 py-6 animate-in slide-in-from-right duration-300">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6">Nueva Venta</h2>

      {/* Product Selection */}
      <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-sm mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Seleccionar Especie</label>
            <select 
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">-- Elige un pescado --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (${p.pricePerKg}/kg)</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Peso (kg)</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-lg font-black text-slate-900 focus:ring-2 focus:ring-primary-500"
                  value={qty}
                  onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kg</span>
              </div>
            </div>
            <button 
              onClick={addToCart}
              disabled={!selectedProductId}
              className="mt-6 bg-primary-600 text-white p-4 rounded-2xl shadow-lg shadow-primary-200 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">add_shopping_cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="mb-24">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-bold text-slate-900">Carrito de Venta</h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cart.length} ítems</span>
        </div>
        
        {cart.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-10 rounded-3xl text-center">
            <span className="material-symbols-outlined text-slate-300 text-5xl mb-2">set_meal</span>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Carrito Vacío</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.productId} className="bg-white p-4 rounded-2xl border border-blue-50 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <h4 className="font-bold text-slate-900">{item.productName}</h4>
                  <p className="text-xs text-slate-400 font-bold">{item.quantityKg}kg x ${item.priceAtSale}/kg</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-black text-primary-700">${(item.quantityKg * item.priceAtSale).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-400 hover:text-red-600 p-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Summary */}
      <div className="fixed bottom-24 left-0 right-0 px-6 max-w-lg mx-auto pointer-events-none">
        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pointer-events-auto">
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-500 font-bold text-sm uppercase">Total a Pagar</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">${total.toFixed(2)}</p>
          </div>
          <button 
            onClick={finalizeSale}
            disabled={cart.length === 0}
            className="w-full bg-primary-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-200 disabled:opacity-50 disabled:shadow-none hover:bg-primary-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>CONFIRMAR VENTA</span>
            <span className="material-symbols-outlined">check_circle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;
