
import React from 'react';
import { Dispatch, Purchase, Transaction, Product } from '../types';

interface InicioProps {
  dispatches: Dispatch[];
  purchases: Purchase[];
  transactions: Transaction[];
  products: Product[];
}

const Inicio: React.FC<InicioProps> = ({ dispatches, transactions, products }) => {
  const totalIngresos = transactions.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0);
  const totalEgresos = transactions.filter(t => t.type === 'egreso').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIngresos - totalEgresos;

  return (
    <div className="px-6 py-8 animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-blue-950 tracking-tight">Panel de Control</h2>
        <p className="text-slate-500 font-medium">Resumen general de VEpescados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-700 p-6 rounded-[32px] text-white shadow-xl shadow-blue-200">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Caja Neta</p>
          <p className="text-3xl font-black">${balance.toFixed(2)}</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded-lg">
            <span className="material-symbols-outlined text-xs">account_balance</span>
            Sincronizado
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[32px] border border-blue-100 shadow-sm">
          <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 p-2 rounded-xl mb-3">trending_up</span>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Ingresos</p>
          <p className="text-2xl font-black text-slate-900">${totalIngresos.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-blue-100 shadow-sm">
          <span className="material-symbols-outlined text-rose-600 bg-rose-50 p-2 rounded-xl mb-3">trending_down</span>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Egresos</p>
          <p className="text-2xl font-black text-slate-900">${totalEgresos.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">inventory</span>
            Stock Crítico
          </h3>
          <div className="space-y-3">
            {products.slice(0, 4).map(p => (
              <div key={p.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <span className="text-sm font-medium text-slate-700">{p.name}</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{p.stockKg.toFixed(1)} kg</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">history</span>
            Últimos Despachos
          </h3>
          <div className="space-y-3">
            {dispatches.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No hay despachos registrados hoy</p>
            ) : (
              dispatches.slice(0, 4).map(d => (
                <div key={d.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm font-medium text-slate-700">{d.recipient}</span>
                  <span className="text-xs font-black text-slate-900">${d.totalAmount.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
