
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AuthPage } from './features/auth/pages/AuthPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { TransactionsPage } from './features/transactions/pages/TransactionsPage';
import { AccountsPage } from './features/accounts/pages/AccountsPage';
import { CardsPage } from './features/cards/pages/CardsPage';
import { CategoriesPage } from './features/categories/pages/CategoriesPage';
import { authService } from './services/authService';
import { User } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setUser(authService.getCurrentUser());
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage key={user?.id} />;
      case 'transactions':
        return <TransactionsPage key={user?.id} />;
      case 'accounts':
        return <AccountsPage key={user?.id} />;
      case 'cards':
        return <CardsPage key={user?.id} />;
      case 'categories':
        return <CategoriesPage key={user?.id} />;
      default:
        return <DashboardPage key={user?.id} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={user} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
