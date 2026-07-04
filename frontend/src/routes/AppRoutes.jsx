import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Marketplace from '../pages/Marketplace';
import SellerDashboard from '../pages/SellerDashboard';
import AIReasoning from '../pages/AIReasoning';
import AuctionDetails from '../pages/AuctionDetails';
import WinnerReveal from '../pages/WinnerReveal';
import MainLayout from '../layouts/MainLayout';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing page has its own standalone main layout config */}
      <Route path="/" element={<Landing />} />

      {/* Pages wrapping MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/auction/:id" element={<AuctionDetails />} />
        <Route path="/winner" element={<WinnerReveal />} />
      </Route>

      {/* AI Reasoning page is high-fidelity full-height and uses custom header/footer layout directly */}
      <Route path="/reasoning" element={<AIReasoning />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
