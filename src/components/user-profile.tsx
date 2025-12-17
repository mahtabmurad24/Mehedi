'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Calendar, BookOpen, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MathLoadingSpinner } from '@/components/math-loading-spinner';

interface Course {
  id: string;
  title: string;
  description?: string;
  bannerImage?: string;
  pageLink?: string;
  createdAt: string;
}

interface AccessRequest {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  message?: string;
  adminNote?: string;
  createdAt: string;
  course: Course;
}

export function UserProfile() {
  const { user } = useAuth();
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAccessRequests();
    }
  }, [user]);

  const fetchAccessRequests = async () => {
    try {
      const response = await fetch('/api/access-requests/user');
      if (response.ok) {
        const data = await response.json();
        setAccessRequests(data.requests);
      }
    } catch (error) {
      console.error('Error fetching access requests:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
          <Button>Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.name ? `https://ui-avatars.com/api/?name=${user.name}&size=96` : undefined} />
              <AvatarFallback className="text-2xl">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">
                {user.name || 'User Profile'}
              </h1>
              <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="mt-2">
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Requests</span>
                  <span className="text-2xl font-bold">{accessRequests.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Approved</span>
                  <span className="text-2xl font-bold text-green-600">
                    {accessRequests.filter(r => r.status === 'APPROVED').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {accessRequests.filter(r => r.status === 'PENDING').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rejected</span>
                  <span className="text-2xl font-bold text-red-600">
                    {accessRequests.filter(r => r.status === 'REJECTED').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>My Course Requests</span>
                </CardTitle>
                <CardDescription>
                  Track the status of your course access requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <MathLoadingSpinner />
                  </div>
                ) : accessRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No course requests yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Browse our courses and request access to start learning
                    </p>
                    <Button>Browse Courses</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {accessRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{request.course.title}</h3>
                            <p className="text-sm text-gray-600">
                              Requested on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        
                        {request.message && (
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm font-medium mb-1">Your Message:</p>
                            <p className="text-sm text-gray-600">{request.message}</p>
                          </div>
                        )}
                        
                        {request.adminNote && (
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="text-sm font-medium mb-1">Admin Note:</p>
                            <p className="text-sm text-gray-600">{request.adminNote}</p>
                          </div>
                        )}
                        
                        {request.status === 'APPROVED' && request.course.pageLink && (
                          <Button asChild className="w-full">
                            <a 
                              href={request.course.pageLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center space-x-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Access Course</span>
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}