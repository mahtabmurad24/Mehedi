'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CourseCard } from '@/components/course-card';
import { CourseRequestModal } from '@/components/course-request-modal';
import { useAuth } from '@/contexts/auth-context';
import { MathLoadingSpinner } from '@/components/math-loading-spinner';
import { Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { StaggerContainer, StaggerItem } from '@/components/animations';

interface Course {
  id: string;
  title: string;
  description?: string;
  bannerText?: string;
  bannerImage?: string;
  pageLink?: string;
  createdAt: string;
}

interface UserRequest {
  id: string;
  courseId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
}

interface CourseListingProps {
  onLoginClick?: () => void;
}

export function CourseListing({ onLoginClick }: CourseListingProps = {}) {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userRequests, setUserRequests] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchUserRequests();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRequests = async () => {
    try {
      const response = await fetch('/api/access-requests/user');
      if (response.ok) {
        const data = await response.json();
        setUserRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching user requests:', error);
    }
  };

  const handleRequestAccess = async (courseId: string, message: string) => {
    if (!user) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/access-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          message,
        }),
      });

      if (response.ok) {
        toast.success('Access request sent successfully');
        await fetchUserRequests();
        setIsRequestModalOpen(false);
        setSelectedCourse(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const hasUserRequested = (courseId: string) => {
    return userRequests.some(request => request.courseId === courseId);
  };

  const getRequestStatus = (courseId: string) => {
    const request = userRequests.find(req => req.courseId === courseId);
    return request?.status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MathLoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Available Courses
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive mathematics courses and start your learning journey today.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 hover:scale-105 transition-transform">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Course Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4 animate-float">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No courses found' : 'No courses available'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Check back later for new courses'
              }
            </p>
          </div>
        ) : (
          <StaggerContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <StaggerItem key={course.id}>
                  <CourseCard
                    course={course}
                    onRequestAccess={(courseId) => {
                      if (!user) {
                        onLoginClick?.();
                        return;
                      }
                      setSelectedCourse(courseId);
                      setIsRequestModalOpen(true);
                    }}
                    hasRequested={hasUserRequested(course.id)}
                    requestStatus={getRequestStatus(course.id)}
                  />
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </div>

      {/* Course Request Modal */}
      <CourseRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
          setSelectedCourse(null);
        }}
        onSubmit={handleRequestAccess}
        loading={submitting}
        courseId={selectedCourse}
      />
    </div>
  );
}