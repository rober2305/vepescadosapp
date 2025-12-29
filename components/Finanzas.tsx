
import React from 'react';
import { Transaction } from '../types';

interface FinanzasProps {
  transactions: Transaction[];
}

const Finanzas: React.FC<FinanzasProps> = ({ transactions }) => {
  const ingresos = transactions.filter(t => t.type === 'ingreso').reduce((sum, t) => sum + t.amount, 0);
  const egresos = transactions.filter(t => t.type === 'egreso').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="px-6 py-8 animate-in slide-in-from-right duration-300">
      <h2 className="text-2xl font-black text-blue-950 mb-6">Ingresos y Egresos</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-sm flex flex-col items-center">
            <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 p-2 rounded-xl mb-2">add_circle</span>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Ingresos Totales</p>
            <p className="text-xl font-black text-emerald-600 mt-1">${ingresos.toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-sm flex flex-col items-center">
            <span className="material-symbols-outlined text-rose-600 bg-rose-50 p-2 rounded-xl mb-2">remove_circle</span>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Egresos Totales</p>
            <p className="text-xl font-black text-rose-600 mt-1">${egresos.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-blue-50 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Libro Mayor</h3>
        </div>
        {transactions.length === 0 ? (
          <p className="p-12 text-center text-sm text-slate-400 italic">Sin movimientos registrados</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${tx.type === 'ingreso' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    <span className="material-symbols-outlined text-sm">
                      {tx.type === 'ingreso' ? 'arrow_downward' : 'arrow_upward'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{new Date(tx.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className={`font-black ${tx.type === 'ingreso' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'ingreso' ? '+' : '-'}${tx.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Finanzas;
