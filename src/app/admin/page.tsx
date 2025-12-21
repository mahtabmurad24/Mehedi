'use client';

import { useState, useEffect } from 'react';
import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { AdminPanel } from '@/components/admin/admin-panel';
import { MathLoadingSpinner } from '@/components/math-loading-spinner';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user.role === 'ADMIN') {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if user is admin
        if (data.user.role === 'ADMIN') {
          setIsAdmin(true);
          return { success: true };
        } else {
          return { success: false, error: 'Access denied. Admin privileges required.' };
        }
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MathLoadingSpinner />
      </div>
    );
  }

  if (isAdmin) {
    return <AdminPanel />;
  }

  return <AdminLoginForm onLogin={handleAdminLogin} />;
}