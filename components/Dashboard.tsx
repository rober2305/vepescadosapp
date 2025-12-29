
import React, { useState, useEffect } from 'react';
import { Product, Sale } from '../types';
import { getInventoryInsights } from '../services/geminiService';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  const [insights, setInsights] = useState<{title: string, description: string, urgency: string}[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const data = await getInventoryInsights(products);
      setInsights(data);
      setLoadingInsights(false);
    };
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSalesToday = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const lowStockCount = products.filter(p => p.stockKg < 10).length;

  return (
    <div className="px-6 py-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">¡Hola, Carlos!</h2>
        <p className="text-slate-500 font-medium">Aquí tienes el resumen de hoy en la pescadería.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-blue-50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <span className="material-symbols-outlined text-primary-600 bg-primary-50 p-2 rounded-xl mb-3">trending_up</span>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ventas de hoy</p>
            <p className="text-2xl font-black text-slate-900">${totalSalesToday.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-red-50 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <span className="material-symbols-outlined text-red-600 bg-red-50 p-2 rounded-xl mb-3">inventory_2</span>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Alertas Stock</p>
            <p className="text-2xl font-black text-slate-900">{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary-600">auto_awesome</span>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Sugerencias del Capitán AI</h3>
        </div>
        
        <div className="space-y-3">
          {loadingInsights ? (
            <div className="bg-white p-6 rounded-3xl border border-blue-100 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm font-medium">Analizando las redes...</p>
            </div>
          ) : (
            insights.map((insight, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex items-start gap-4">
                <div className={`mt-1 size-3 rounded-full shrink-0 ${insight.urgency === 'Alta' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-400'}`}></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-0.5">{insight.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Sales */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Ventas Recientes</h3>
          <button className="text-primary-600 text-xs font-bold hover:underline">Ver todo</button>
        </div>
        
        <div className="bg-white rounded-3xl border border-blue-50 overflow-hidden shadow-sm">
          {sales.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400 text-sm font-medium">Aún no hay ventas registradas hoy.</p>
            </div>
          ) : (
            sales.slice(0, 5).map((sale) => (
              <div key={sale.id} className="p-4 border-b border-slate-50 last:border-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-xl text-slate-600">
                    <span className="material-symbols-outlined">receipt_long</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Ticket #{sale.id.slice(-4)}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <p className="text-sm font-black text-primary-700">${sale.totalAmount.toFixed(2)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
