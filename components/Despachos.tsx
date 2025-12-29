
import React, { useState, useMemo } from 'react';
import { Product, Dispatch, DispatchItem } from '../types';

interface DespachosProps {
  products: Product[];
  onDispatchBatch: (dispatches: Dispatch[]) => void;
}

const Despachos: React.FC<DespachosProps> = ({ products, onDispatchBatch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [operativoName, setOperativoName] = useState('DESPACHO DEL DÍA');
  const [destinos, setDestinos] = useState(['ARTIGAS', 'YOHAN', 'MIJARES', 'ANTONI', 'JULIAN']);
  
  // Matrix data: { "productId-destinoIndex": weight }
  const [gridData, setGridData] = useState<Record<string, string>>({});

  const filteredProducts = useMemo(() => 
    products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [products, searchTerm]
  );

  const handleCellChange = (productId: string, destinoIdx: number, value: string) => {
    setGridData(prev => ({
      ...prev,
      [`${productId}-${destinoIdx}`]: value
    }));
  };

  const handleDestinoNameChange = (idx: number, name: string) => {
    const newDestinos = [...destinos];
    newDestinos[idx] = name.toUpperCase();
    setDestinos(newDestinos);
  };

  const addColumn = () => setDestinos([...destinos, `TIENDA ${destinos.length + 1}`]);
  const removeColumn = (idx: number) => setDestinos(destinos.filter((_, i) => i !== idx));

  const handleFinalizarCarga = () => {
    const batch: Dispatch[] = [];
    
    destinos.forEach((destino, dIdx) => {
      const items: DispatchItem[] = [];
      let totalKg = 0;
      let totalAmount = 0;

      products.forEach(p => {
        const val = gridData[`${p.id}-${dIdx}`];
        const qty = parseFloat(val);
        if (qty > 0) {
          const amount = qty * p.pricePerKg;
          items.push({
            productId: p.id,
            productName: p.name,
            quantityKg: qty,
            returnedKg: 0,
            priceAtDispatch: p.pricePerKg,
            totalKg: qty,
            totalAmount: amount
          });
          totalKg += qty;
          totalAmount += amount;
        }
      });

      if (items.length > 0) {
        batch.push({
          id: `d-${Date.now()}-${dIdx}`,
          recipient: `${operativoName} - ${destino}`,
          timestamp: new Date().toISOString(),
          items,
          totalKg,
          totalAmount
        });
      }
    });

    if (batch.length === 0) {
      alert("No hay datos para guardar en ninguna tienda.");
      return;
    }

    onDispatchBatch(batch);
    setGridData({});
    alert(`Se han registrado ${batch.length} despachos. ¡Pasa a la pestaña de Ventas Diarias para ver los resultados!`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500">
      {/* Header Panel */}
      <div className="px-6 py-6 bg-white border-b border-blue-100 shadow-sm flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <input 
              type="text"
              className="text-2xl font-black text-blue-900 bg-blue-50/50 border-0 rounded-2xl px-4 py-2 w-full max-w-lg focus:ring-2 focus:ring-blue-500 transition-all uppercase"
              value={operativoName}
              onChange={(e) => setOperativoName(e.target.value)}
              placeholder="NOMBRE DEL DESPACHO"
            />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 ml-4">Configura destinos y anota pesos abajo</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={addColumn}
              className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-2xl font-black text-xs hover:bg-blue-100 transition-all border border-blue-100"
            >
              <span className="material-symbols-outlined text-lg">add_box</span>
              TIENDA
            </button>
            <button 
              onClick={handleFinalizarCarga}
              className="flex items-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              GUARDAR TODO
            </button>
          </div>
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Buscar especie para anotar pesos..."
            className="w-full bg-slate-50 border border-blue-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Grid Matrix */}
      <div className="flex-1 overflow-auto p-6 no-scrollbar">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full border-separate border-spacing-0 bg-white rounded-[40px] overflow-hidden border border-blue-100 shadow-xl">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="sticky left-0 z-30 bg-blue-900 px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] border-b border-blue-800 border-r border-blue-800">
                  ESPECIE / PRODUCTO
                </th>
                {destinos.map((dest, idx) => (
                  <th key={idx} className="px-3 py-3 text-center border-b border-blue-800 min-w-[140px] group">
                    <div className="flex flex-col gap-1">
                      <input 
                        type="text" 
                        className="w-full bg-blue-800/50 border-0 rounded-lg px-2 py-2 text-center text-[10px] font-black uppercase text-white focus:bg-white focus:text-blue-900 focus:outline-none transition-colors"
                        value={dest}
                        onChange={(e) => handleDestinoNameChange(idx, e.target.value)}
                      />
                      <button 
                        onClick={() => removeColumn(idx)}
                        className="text-[9px] font-bold text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                      >
                        ELIMINAR
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50/50 px-6 py-4 text-[11px] font-black text-slate-600 border-r border-slate-100 flex items-center justify-between">
                    {p.name}
                    <span className="text-[9px] text-blue-400 bg-blue-50 px-1.5 py-0.5 rounded ml-2">${p.pricePerKg}</span>
                  </td>
                  {destinos.map((_, dIdx) => (
                    <td key={dIdx} className="p-1 border-r border-slate-50 last:border-r-0">
                      <input 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-transparent text-center py-3 text-sm font-black text-blue-800 focus:bg-cyan-50 focus:outline-none rounded-xl transition-all"
                        value={gridData[`${p.id}-${dIdx}`] || ''}
                        onChange={(e) => handleCellChange(p.id, dIdx, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Help Banner */}
      <div className="px-6 py-3 bg-blue-900 text-white flex items-center justify-center gap-3">
        <span className="material-symbols-outlined text-sm animate-pulse">info</span>
        <p className="text-[10px] font-black uppercase tracking-widest">Anota los pesos de salida en KG. Las devoluciones se gestionan en "Ventas Diarias".</p>
      </div>
    </div>
  );
};

export default Despachos;
