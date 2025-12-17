'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { AuthModal } from '@/components/auth/auth-modal';
import { useState } from 'react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <AuthProvider showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal}>
      <Navbar onLoginClick={() => setShowAuthModal(true)} />
      {children}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </AuthProvider>
  );
}