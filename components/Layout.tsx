
import React from 'react';
import { LayoutDashboard, ReceiptText, Landmark, CreditCard, Tag, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'accounts', label: 'Bank Accounts', icon: Landmark },
    { id: 'cards', label: 'Credit Cards', icon: CreditCard },
    { id: 'categories', label: 'Categories', icon: Tag },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold text-blue-600">Expensify</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 bg-white border-r w-64 p-4 flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:block mb-8 px-4">
          <h1 className="text-2xl font-bold text-blue-600">Expensify</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
            />
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto border-t pt-4 px-2">
          <div className="flex items-center gap-3 p-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <UserIcon size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
