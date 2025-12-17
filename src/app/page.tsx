'use client';

import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { Footer } from '@/components/footer';
import { AuthModal } from '@/components/auth/auth-modal';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MathLoadingSpinner } from '@/components/math-loading-spinner';
import { CourseCard } from '@/components/course-card';

export default function Home() {
  const { user, loading, setShowAuthModal } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setShowAuthModal(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      const response = await fetch('/api/courses?limit=3');
      if (response.ok) {
        const data = await response.json();
        setFeaturedCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching featured courses:', error);
    } finally {
      setCoursesLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MathLoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        <HeroSection onGetStartedClick={() => setShowAuthModal(true)} />
        
        {/* Featured Courses Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Courses
              </h2>
              <p className="text-lg text-gray-600">
                Discover our most popular mathematics courses
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coursesLoading ? (
                // Loading placeholders
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : featuredCourses.length === 0 ? (
                // No courses message
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Courses Available
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Check back later for new mathematics courses
                  </p>
                  {user?.role === 'ADMIN' && (
                    <Button asChild>
                      <Link href="/admin">
                        Add First Course
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                // Real courses
                featuredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onRequestAccess={(courseId) => {
                      if (!user) {
                        setShowAuthModal(true);
                        return;
                      }
                      // Handle course request
                      window.location.href = `/courses`;
                    }}
                  />
                ))
              )}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/courses">
                  View All Courses
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}