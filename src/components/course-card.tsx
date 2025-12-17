'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Course {
  id: string;
  title: string;
  description?: string;
  bannerText?: string;
  pageLink?: string;
  createdAt: string;
}

interface CourseCardProps {
  course: Course;
  onRequestAccess: (courseId: string) => void;
  hasRequested?: boolean;
  requestStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
}

export function CourseCard({ course, onRequestAccess, hasRequested = false, requestStatus }: CourseCardProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionButton = () => {
    if (hasRequested) {
      if (requestStatus === 'APPROVED' && course.pageLink) {
        return (
          <Button asChild className="w-full hover:scale-105 transition-transform">
            <a href={course.pageLink} target="_blank" rel="noopener noreferrer">
              Access Course
            </a>
          </Button>
        );
      } else {
        return (
          <Badge className={`${getStatusColor(requestStatus || 'PENDING')} hover:scale-105 transition-transform`}>
            {requestStatus || 'PENDING'}
          </Badge>
        );
      }
    } else {
      return (
        <Button 
          onClick={() => onRequestAccess(course.id)} 
          className="w-full hover:scale-105 transition-transform"
        >
          Request Access
        </Button>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <div className="h-full bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
        <div className="relative h-48 overflow-hidden group">
          {course.bannerText && course.bannerText.trim() ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="text-white text-center px-4">
                <p className="text-2xl font-bold mb-2 leading-tight">{course.bannerText}</p>
                <div className="text-4xl">✨</div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="text-white text-center">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-sm font-medium">Math Course</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-600 line-clamp-3 mb-4">
            {course.description || 'No description available'}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <Clock className="h-4 w-4" />
              <span>Self-paced</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-purple-600 transition-colors">
              <Users className="h-4 w-4" />
              <span>Open</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 mb-4">
            <Star className="h-4 w-4 text-yellow-500 fill-current animate-pulse" />
            <span className="text-sm text-gray-600 font-medium">Premium Course</span>
          </div>
          
          {getActionButton()}
        </div>
      </div>
    </motion.div>
  );
}