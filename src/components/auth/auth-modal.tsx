'use client';

import { useState } from 'react';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4">
        {isLogin ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <SignupForm onToggleMode={toggleMode} />
        )}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}