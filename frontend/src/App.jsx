import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load all pages — each page is only downloaded when first visited
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Abonnements = lazy(() => import('./pages/Abonnements'));
const Inscription = lazy(() => import('./pages/Inscription'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminUsers = lazy(() => import('./pages/admin/UserManager'));
const AdminSubscriptions = lazy(() => import('./pages/admin/SubscriptionManager'));
const AdminContent = lazy(() => import('./pages/admin/ContentManager'));
const AdminActivity = lazy(() => import('./pages/admin/ActivityLog'));
const AdminMessages = lazy(() => import('./pages/admin/MessageManager'));

// Lightweight loading indicator
const PageLoader = () => (
  <div className="min-h-screen bg-[#0e141a] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="dark">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/services" element={<><Navbar /><Services /></>} />
            <Route path="/abonnements" element={<><Navbar /><Abonnements /></>} />
            <Route path="/inscription" element={<><Navbar /><Inscription /></>} />
            <Route path="/contact" element={<><Navbar /><Contact /></>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute><Suspense fallback={<PageLoader />}><AdminLayout><AdminDashboard /></AdminLayout></Suspense></ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute><Suspense fallback={<PageLoader />}><AdminLayout><AdminUsers /></AdminLayout></Suspense></ProtectedRoute>
            } />
            <Route path="/admin/subscriptions" element={
              <ProtectedRoute><Suspense fallback={<PageLoader />}><AdminLayout><AdminSubscriptions /></AdminLayout></Suspense></ProtectedRoute>
            } />
            <Route path="/admin/messages" element={
              <ProtectedRoute><Suspense fallback={<PageLoader />}><AdminLayout><AdminMessages /></AdminLayout></Suspense></ProtectedRoute>
            } />
            <Route path="/admin/activity" element={
              <ProtectedRoute><Suspense fallback={<PageLoader />}><AdminLayout><AdminActivity /></AdminLayout></Suspense></ProtectedRoute>
            } />
            <Route path="/admin/content" element={
              <ProtectedRoute><Suspense fallback={<PageLoader />}><AdminLayout><AdminContent /></AdminLayout></Suspense></ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
