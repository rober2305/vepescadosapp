
import React from 'react';
import { Sale } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FinancesProps {
  sales: Sale[];
}

const Finances: React.FC<FinancesProps> = ({ sales }) => {
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  
  // Group sales by hour for a simple chart
  const hourlyData = Array.from({ length: 8 }, (_, i) => {
    const hour = 9 + i; // 9 AM to 4 PM
    const amount = sales
      .filter(s => new Date(s.timestamp).getHours() === hour)
      .reduce((sum, s) => sum + s.totalAmount, 0);
    return {
      hour: `${hour}:00`,
      amount
    };
  });

  return (
    <div className="px-6 py-6 animate-in slide-in-from-right duration-300">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6">Estado de Caja</h2>

      <div className="bg-gradient-to-br from-primary-600 to-blue-800 p-8 rounded-[40px] text-white shadow-2xl shadow-primary-200 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <p className="text-primary-100 text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-80">Recaudación de Hoy</p>
        <h3 className="text-5xl font-black tracking-tighter mb-6">${totalRevenue.toFixed(2)}</h3>
        
        <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">payments</span>
                <span className="text-xs font-bold">Bs. {(totalRevenue * 36.5).toLocaleString()}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span className="text-xs font-bold">+5.2%</span>
            </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-bold text-slate-900 mb-4 px-1">Actividad del Día</h4>
        <div className="bg-white p-4 rounded-3xl border border-blue-50 shadow-sm h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {hourlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#2563eb' : '#f1f5f9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-blue-50 flex flex-col items-center">
            <span className="material-symbols-outlined text-primary-600 bg-primary-50 p-2 rounded-xl mb-3">credit_card</span>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Punto de Venta</p>
            <p className="text-xl font-black text-slate-900 mt-1">$0.00</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-blue-50 flex flex-col items-center">
            <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 p-2 rounded-xl mb-3">account_balance_wallet</span>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Efectivo</p>
            <p className="text-xl font-black text-slate-900 mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Finances;
