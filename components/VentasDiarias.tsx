
import React, { useState } from 'react';
import { Dispatch, DailyClose } from '../types';

interface VentasDiariasProps {
  dispatches: Dispatch[];
  onUpdateDispatch: (updated: Dispatch) => void;
}

const VentasDiarias: React.FC<VentasDiariasProps> = ({ dispatches, onUpdateDispatch }) => {
  const [selectedDispatchId, setSelectedDispatchId] = useState<string | null>(dispatches[0]?.id || null);
  
  const selectedDispatch = dispatches.find(d => d.id === selectedDispatchId);

  const handleUpdateClose = (field: keyof DailyClose, value: string) => {
    if (!selectedDispatch) return;
    
    const newClose = {
      ...(selectedDispatch.closeData || {
        ptoBs: 0, efectivoBs: 0, pagoMovil: 0, gastos: 0, donaciones: 0,
        transformacion: 0, credito: 0, comisiones: 0, personal: 0, tasaCambio: 350
      }),
      [field]: parseFloat(value) || 0
    };

    onUpdateDispatch({
      ...selectedDispatch,
      closeData: newClose
    });
  };

  const handleUpdateReturn = (itemId: string, value: string) => {
    if (!selectedDispatch) return;
    const returned = parseFloat(value) || 0;
    
    const newItems = selectedDispatch.items.map(item => {
      if (item.productId === itemId) {
        const totalKg = Math.max(0, item.quantityKg - returned);
        return {
          ...item,
          returnedKg: returned,
          totalKg,
          totalAmount: totalKg * item.priceAtDispatch
        };
      }
      return item;
    });

    const totalKg = newItems.reduce((s, i) => s + i.totalKg, 0);
    const totalAmount = newItems.reduce((s, i) => s + i.totalAmount, 0);

    onUpdateDispatch({
      ...selectedDispatch,
      items: newItems,
      totalKg,
      totalAmount
    });
  };

  const calculateCuadre = () => {
    if (!selectedDispatch || !selectedDispatch.closeData) return { diferencia: 0, recibido: 0, totalBs: 0, totalGastosBs: 0 };
    const c = selectedDispatch.closeData;
    const ingresosBs = c.ptoBs + c.efectivoBs + c.pagoMovil + c.comisiones;
    const egresosBs = c.gastos + c.donaciones + c.transformacion + c.credito + c.personal;
    const netoDolares = (ingresosBs - egresosBs) / (c.tasaCambio || 1);
    return {
      recibido: netoDolares,
      diferencia: netoDolares - selectedDispatch.totalAmount,
      totalBs: ingresosBs,
      totalGastosBs: egresosBs
    };
  };

  const { recibido, diferencia, totalBs, totalGastosBs } = calculateCuadre();

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in slide-in-from-right duration-500">
      <div className="p-6 bg-white border-b border-blue-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-blue-950 tracking-tight">Cierre de Ventas por Tienda</h2>
          {selectedDispatch && (
             <div className="bg-blue-900 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 animate-bounce">
                Anotando: {selectedDispatch.recipient.split(' - ')[1]}
             </div>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {dispatches.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 w-full">
              <span className="material-symbols-outlined text-amber-600">warning</span>
              <p className="text-xs font-black text-amber-800 uppercase tracking-widest italic">No hay despachos cargados. Ve a "Despachos" para iniciar.</p>
            </div>
          ) : (
            dispatches.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDispatchId(d.id)}
                className={`flex-none px-6 py-4 rounded-2xl font-black text-xs uppercase transition-all border flex items-center gap-2 ${
                  selectedDispatchId === d.id 
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xl shadow-blue-100 -translate-y-1' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{selectedDispatchId === d.id ? 'check_circle' : 'storefront'}</span>
                {d.recipient.split(' - ')[1] || d.recipient}
              </button>
            ))
          )}
        </div>
      </div>

      {selectedDispatch ? (
        <div className="flex-1 overflow-auto p-6 space-y-8 no-scrollbar pb-32">
          {/* Devoluciones Table */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">assignment_return</span>
                Control de Devoluciones y Pesos Reales
              </h3>
              <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border border-emerald-100">
                Venta Esperada: ${selectedDispatch.totalAmount.toFixed(2)}
              </div>
            </div>
            <div className="bg-white rounded-[40px] border border-blue-50 shadow-xl overflow-hidden">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">ESPECIE</th>
                    <th className="px-2 py-4 text-center text-[10px] font-black uppercase tracking-widest">KG DESP.</th>
                    <th className="px-2 py-4 text-center text-[10px] font-black uppercase tracking-widest bg-blue-800">KG DEV.</th>
                    <th className="px-2 py-4 text-center text-[10px] font-black uppercase tracking-widest">TOTAL KG</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">VENTA $</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {selectedDispatch.items.map(item => (
                    <tr key={item.productId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700 uppercase text-xs">{item.productName}</td>
                      <td className="px-2 py-4 text-center font-black text-slate-400">{item.quantityKg.toFixed(2)}</td>
                      <td className="p-1 bg-blue-50/50">
                        <input 
                          type="number" step="0.01" 
                          className="w-full bg-white border border-blue-100 rounded-xl text-center font-black text-blue-900 py-2 focus:ring-2 focus:ring-blue-500"
                          value={item.returnedKg || ''}
                          placeholder="0.00"
                          onChange={(e) => handleUpdateReturn(item.productId, e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-4 text-center font-black text-blue-900">{item.totalKg.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-black text-blue-700">${item.totalAmount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 font-black text-blue-900 text-xs">
                    <tr>
                        <td className="px-6 py-4">TOTALES</td>
                        <td className="px-2 py-4 text-center">{selectedDispatch.items.reduce((s,i) => s + i.quantityKg, 0).toFixed(2)}</td>
                        <td className="px-2 py-4 text-center bg-blue-100">{selectedDispatch.items.reduce((s,i) => s + i.returnedKg, 0).toFixed(2)}</td>
                        <td className="px-2 py-4 text-center">{selectedDispatch.totalKg.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right bg-blue-200">${selectedDispatch.totalAmount.toFixed(2)}</td>
                    </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Cuadre de Caja - Financials */}
          <section className="bg-white p-8 rounded-[48px] border border-blue-100 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full translate-x-1/2 -translate-y-1/2 -z-10"></div>
            
            {/* Ingresos Column */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-black text-blue-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">payments</span>
                  INGRESOS (Bs)
                </h4>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-xl">
                  <span className="text-[10px] font-black text-blue-600">TASA BS/$:</span>
                  <input 
                    type="number" 
                    className="w-16 bg-white border-0 rounded-lg text-center font-black text-blue-700 text-xs py-1"
                    value={selectedDispatch.closeData?.tasaCambio || 350}
                    onChange={(e) => handleUpdateClose('tasaCambio', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'PTO BS (Punto)', field: 'ptoBs' },
                  { label: 'EFECTIVO BS', field: 'efectivoBs' },
                  { label: 'PAGO MÓVIL', field: 'pagoMovil' },
                  { label: 'COMISIONES', field: 'comisiones' }
                ].map(f => (
                  <div key={f.field} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{f.label}</span>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-32 bg-slate-50 border border-slate-100 rounded-xl text-right font-black text-blue-900 p-3 text-sm focus:ring-2 focus:ring-blue-500"
                      value={(selectedDispatch.closeData as any)?.[f.field] || ''}
                      onChange={(e) => handleUpdateClose(f.field as any, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-600 uppercase">Subtotal Ingresos Bs:</span>
                <span className="text-sm font-black text-blue-900">{totalBs.toLocaleString()} Bs</span>
              </div>
            </div>

            {/* Egresos Column */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-sm">trending_down</span>
                EGRESOS / GASTOS (Bs)
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'GASTOS TIENDA', field: 'gastos' },
                  { label: 'DONACIONES', field: 'donaciones' },
                  { label: 'TRANSFORMACIÓN', field: 'transformacion' },
                  { label: 'CRÉDITOS', field: 'credito' },
                  { label: 'PERSONAL', field: 'personal' }
                ].map(f => (
                  <div key={f.field} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{f.label}</span>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-32 bg-rose-50/30 border border-rose-100 rounded-xl text-right font-black text-rose-700 p-3 text-sm focus:ring-2 focus:ring-rose-500"
                      value={(selectedDispatch.closeData as any)?.[f.field] || ''}
                      onChange={(e) => handleUpdateClose(f.field as any, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-600 uppercase">Subtotal Egresos Bs:</span>
                <span className="text-sm font-black text-rose-700">{totalGastosBs.toLocaleString()} Bs</span>
              </div>
            </div>
          </section>

          {/* DIFERENCIA FINAL BANNER */}
          <section className={`p-10 rounded-[48px] text-white shadow-2xl transition-all relative overflow-hidden ${diferencia >= -0.1 ? 'bg-blue-900' : 'bg-rose-900'}`}>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full"></div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em] mb-2">Resultado Final del Día (Cuadre)</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter">${diferencia.toFixed(2)}</span>
                    <span className="text-xs font-bold opacity-60 uppercase">Diferencia</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 divide-x divide-white/10 text-center">
                <div className="px-4">
                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">Venta Real</p>
                    <p className="text-xl font-black">${selectedDispatch.totalAmount.toFixed(2)}</p>
                </div>
                <div className="px-4">
                    <p className="text-[10px] font-black uppercase opacity-60 mb-1">Caja Neta ($)</p>
                    <p className={`text-xl font-black ${recibido >= selectedDispatch.totalAmount ? 'text-emerald-400' : 'text-rose-300'}`}>
                        ${recibido.toFixed(2)}
                    </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10 border-t border-white/10 pt-8 flex flex-col items-center gap-4">
              <button className="bg-white text-blue-900 hover:bg-blue-50 font-black px-16 py-4 rounded-3xl shadow-xl transition-all active:scale-95 flex items-center gap-3">
                <span className="material-symbols-outlined">lock</span>
                CERRAR Y GUARDAR CUADRE
              </button>
              <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest text-center max-w-xs">
                Al cerrar el cuadre, se congelará la información de este despacho y se restará del inventario base.
              </p>
            </div>
          </section>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-6xl text-blue-300">receipt_long</span>
          </div>
          <h3 className="text-xl font-black text-blue-900 uppercase tracking-widest">Esperando Selección</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-xs leading-relaxed">
            Selecciona una de las tiendas de arriba para realizar su anotación de devoluciones y cierre financiero.
          </p>
        </div>
      )}
    </div>
  );
};

export default VentasDiarias;
