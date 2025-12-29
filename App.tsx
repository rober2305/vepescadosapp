
import React, { useState } from 'react';
import { View, Product, Dispatch, Purchase, Transaction } from './types';
import Navigation from './components/Navigation';
import Inicio from './components/Inicio';
import Despachos from './components/Despachos';
import VentasDiarias from './components/VentasDiarias';
import Compras from './components/Compras';
import Finanzas from './components/Finanzas';
import Inventory from './components/Inventory';

const SPECIES = [
  "ANCHOA", "AGUJA", "ATUN ALBACORA", "ATUN RUEDA", "BAGRE", "BONITA", "BOCACHICO", 
  "CAMARÓN", "CANARIO", "CALAMAR", "CATACO", "CAZON", "CARITE G", "CARITE", 
  "COJINUA", "CORO CORO", "CUCHINA CATALANA", "CUNARO", "CUNARO PEQ", 
  "CURVINA G", "CURVINA P", "DORADO", "GUACUCO", "JUREL ENTERO", "JUREL RUEDA", 
  "JURELETE", "LAMPAROSA", "LEBRANCHE", "LISA", "MOJITO", "MERLUZA", "MEDREGAL", 
  "PEPITONA", "PICUA ENTERA", "PICUA RUEDA", "PULPO", "RAYA", "RECORTE", 
  "ROBALITO", "ROBALO", "RONCADOR", "SARDINA", "SURTIDO PAELLA", "TAJALY", 
  "VARIOS SALEMA"
];

const INITIAL_PRODUCTS: Product[] = SPECIES.map((name, index) => ({
  id: `p-${index}`,
  name,
  pricePerKg: 5.5,
  stockKg: 500,
  category: "Pescado Fresco"
}));

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('inicio');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddDispatches = (newDispatches: Dispatch[]) => {
    setDispatches(prev => [...newDispatches, ...prev]);
    const txs: Transaction[] = newDispatches.map(d => ({
      id: `tx-${Date.now()}-${Math.random()}`,
      type: 'ingreso',
      description: `Despacho a ${d.recipient}`,
      amount: d.totalAmount,
      timestamp: d.timestamp
    }));
    setTransactions(prev => [...txs, ...prev]);
  };

  const handleUpdateDispatch = (updated: Dispatch) => {
    setDispatches(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleAddPurchase = (newPurchase: Purchase) => {
    setPurchases(prev => [newPurchase, ...prev]);
    const newTx: Transaction = {
      id: `tx-p-${Date.now()}`,
      type: 'egreso',
      description: `Compra: ${newPurchase.productName}`,
      amount: newPurchase.totalCost,
      timestamp: newPurchase.timestamp
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'inicio': return <Inicio dispatches={dispatches} purchases={purchases} transactions={transactions} products={products} />;
      case 'despachos': return <Despachos products={products} onDispatchBatch={handleAddDispatches} />;
      case 'ventas': return <VentasDiarias dispatches={dispatches} onUpdateDispatch={handleUpdateDispatch} />;
      case 'compras': return <Compras products={products} onPurchase={handleAddPurchase} />;
      case 'finanzas': return <Finanzas transactions={transactions} />;
      case 'inventario': return <Inventory products={products} setProducts={setProducts} />;
      default: return <Inicio dispatches={dispatches} purchases={purchases} transactions={transactions} products={products} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <header className="flex-none bg-blue-900 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-blue-900 text-xl font-bold">sailing</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase">VEpescados</h1>
        </div>
        <div className="text-[10px] font-black text-blue-100 bg-white/10 px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest">
          {new Date().toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric', month: 'short' })}
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden pb-20">
        {renderView()}
      </main>

      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default App;
