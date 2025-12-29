
import React from 'react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView }) => {
  const navItems: { id: View; icon: string; label: string }[] = [
    { id: 'inicio', icon: 'home', label: 'Inicio' },
    { id: 'despachos', icon: 'grid_view', label: 'Despachos' },
    { id: 'ventas', icon: 'assignment_turned_in', label: 'Ventas Diarias' },
    { id: 'inventario', icon: 'inventory_2', label: 'Inventario' },
    { id: 'compras', icon: 'local_shipping', label: 'Compras' },
    { id: 'finanzas', icon: 'account_balance', label: 'Caja' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 px-2 py-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-4xl mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 transition-all duration-200 rounded-xl ${
                isActive ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${isActive ? 'font-variation-settings-"FILL" 1' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
