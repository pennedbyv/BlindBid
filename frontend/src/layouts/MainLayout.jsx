import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function MainLayout() {
  const location = useLocation();
  const path = location.pathname;

  // Determine navbar variant
  let navVariant = 'landing';
  if (path.startsWith('/seller')) {
    navVariant = 'dashboard';
  } else if (path.startsWith('/marketplace')) {
    navVariant = 'marketplace';
  } else if (path.startsWith('/auction')) {
    navVariant = 'auction';
  } else if (path.startsWith('/winner')) {
    navVariant = 'winner';
  }

  // Determine footer variant
  // Dashboard & AI Reasoning use the compact footer. Marketplace & Winner reveal use the landing/full footer.
  const isDashboard = path.startsWith('/seller');
  const footerVariant = isDashboard ? 'dashboard' : 'landing';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <Navbar variant={navVariant} />

      {/* Main content wrapper */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer variant={footerVariant} />
    </div>
  );
}
