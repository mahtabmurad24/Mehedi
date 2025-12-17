'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '@/components/animations';

interface HeroSectionProps {
  onGetStartedClick?: () => void;
}

export function HeroSection({ onGetStartedClick }: HeroSectionProps) {
  const { user } = useAuth();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center">
          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block mt-2 animate-gradient">
                Mehedi's Math Academy
              </span>
            </h1>
          </FadeIn>
          
          <SlideIn delay={0.2}>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Master mathematics with expert guidance, interactive courses, and personalized learning paths. 
              Transform your understanding of math with our premium educational platform.
            </p>
          </SlideIn>
          
          <SlideIn delay={0.3} direction="up">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    onClick={onGetStartedClick}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-3 border-2 hover:scale-105 transition-all duration-200"
                  >
                    Learn More
                  </Button>
                </>
              ) : (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  asChild
                >
                  <Link href="/courses">
                    Browse Courses
                  </Link>
                </Button>
              )}
            </div>
          </SlideIn>
        </div>

        <StaggerContainer className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaggerItem>
              <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Expert Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comprehensive math courses designed by experts with years of teaching experience.
                  </CardDescription>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Personalized Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Tailored learning paths that adapt to your pace and learning style.
                  </CardDescription>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Certified Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Earn certificates upon course completion to showcase your achievements.
                  </CardDescription>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">24/7 Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Learn at your own pace with round-the-clock access to course materials.
                  </CardDescription>
                </CardContent>
              </Card>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}