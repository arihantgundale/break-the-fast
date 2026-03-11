import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import CateringPage from './pages/CateringPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminQuickEntryPage from './pages/AdminQuickEntryPage';
import AdminMenuPage from './pages/AdminMenuPage';

/* ─── Route guards ─── */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, role, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user || role !== 'ADMIN') return <Navigate to="/login?mode=admin" replace />;
  return children;
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

/* ─── Layout wrapper (shows Navbar + Footer for customer pages) ─── */
function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-160px)]">{children}</main>
      <Footer />
    </>
  );
}

/* ─── App ─── */
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: 'Inter, sans-serif', fontWeight: 500 },
              success: { iconTheme: { primary: '#27AE60', secondary: '#fff' } },
              error: { iconTheme: { primary: '#C0392B', secondary: '#fff' } },
            }}
          />

          <Routes>
            {/* ───── Public / Customer pages ───── */}
            <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
            <Route path="/menu" element={<CustomerLayout><MenuPage /></CustomerLayout>} />
            <Route path="/about" element={<CustomerLayout><AboutPage /></CustomerLayout>} />
            <Route path="/catering" element={<CustomerLayout><CateringPage /></CustomerLayout>} />
            <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
            <Route path="/login" element={<CustomerLayout><LoginPage /></CustomerLayout>} />

            {/* ───── Authenticated customer pages ───── */}
            <Route
              path="/checkout"
              element={
                <CustomerLayout>
                  <PrivateRoute><CheckoutPage /></PrivateRoute>
                </CustomerLayout>
              }
            />
            <Route
              path="/order-confirmation/:orderNumber"
              element={
                <CustomerLayout>
                  <PrivateRoute><OrderConfirmationPage /></PrivateRoute>
                </CustomerLayout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <CustomerLayout>
                  <PrivateRoute><DashboardPage /></PrivateRoute>
                </CustomerLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <CustomerLayout>
                  <PrivateRoute><ProfilePage /></PrivateRoute>
                </CustomerLayout>
              }
            />

            {/* ───── Admin pages (no Navbar/Footer) ───── */}
            <Route
              path="/admin/orders"
              element={<AdminRoute><AdminOrdersPage /></AdminRoute>}
            />
            <Route
              path="/admin/quick-entry"
              element={<AdminRoute><AdminQuickEntryPage /></AdminRoute>}
            />
            <Route
              path="/admin/menu"
              element={<AdminRoute><AdminMenuPage /></AdminRoute>}
            />

            {/* ───── Catch-all redirect ───── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
