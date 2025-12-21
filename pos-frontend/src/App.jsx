import { useState } from 'react';
import { useSelector } from 'react-redux';
import MainLayout from './layouts/MainLayout';
import POSPage from './pages/POSPage';
import TablesPage from './pages/TablesPage';
import OrdersPage from './pages/OrdersPage';
import KitchenDisplayPage from './pages/KitchenDisplayPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CustomersPage from './pages/CustomersPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import { selectIsAuthenticated } from './store/slices/authSlice';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('pos');
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'pos':
        return <POSPage />;
      case 'tables':
        return <TablesPage />;
      case 'orders':
        return <OrdersPage />;
      case 'kitchen':
        return <KitchenDisplayPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'customers':
        return <CustomersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <POSPage />;
    }
  };

  return (
    <MainLayout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </MainLayout>
  );
}

export default App;
