'use client';

import { CourseListing } from '@/components/course-listing';
import { useAuth } from '@/contexts/auth-context';

export default function CoursesPage() {
  const { setShowAuthModal } = useAuth();

  return (
    <CourseListing onLoginClick={() => setShowAuthModal(true)} />
  );
}