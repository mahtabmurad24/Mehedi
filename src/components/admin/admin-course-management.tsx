'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description?: string;
  bannerText?: string;
  bannerImage?: string;
  pageLink?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  _count?: {
    accessRequests: number;
  };
}



export function AdminCourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number; aspectRatio: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bannerImage: '',
    pageLink: ''
  });



  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        updateRequestCounts();
      }, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [loading, courses]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        // Get request counts for each course
        const coursesWithCounts = await Promise.all(
          data.courses.map(async (course: Course) => {
            const requestsResponse = await fetch(`/api/access-requests?courseId=${course.id}`);
            if (requestsResponse.ok) {
              const requestsData = await requestsResponse.json();
              return {
                ...course,
                _count: {
                  accessRequests: requestsData.requests.length
                }
              };
            }
            return course;
          })
        );
        setCourses(coursesWithCounts);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestCounts = async () => {
    try {
      const updatedCourses = await Promise.all(
        courses.map(async (course) => {
          const requestsResponse = await fetch(`/api/access-requests?courseId=${course.id}`);
          if (requestsResponse.ok) {
            const requestsData = await requestsResponse.json();
            return {
              ...course,
              _count: {
                accessRequests: requestsData.requests.length
              }
            };
          }
          return course;
        })
      );
      setCourses(updatedCourses);
    } catch (error) {
      console.error('Error updating request counts:', error);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';
      const method = editingCourse ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(`Course ${editingCourse ? 'updated' : 'created'} successfully`);
        await fetchCourses();
        setIsDialogOpen(false);
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      bannerImage: course.bannerImage || '',
      pageLink: course.pageLink || ''
    });
    setImageDimensions(null); // Reset dimensions when editing
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    setDeletingCourseId(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Course deleted successfully');
        await fetchCourses();
      } else {
        toast.error('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    } finally {
      setDeletingCourseId(null);
    }
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      bannerImage: '',
      pageLink: ''
    });
    setImageDimensions(null);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, bannerImage: data.url }));

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          const aspectRatio = (img.width / img.height).toFixed(2);
          setImageDimensions({
            width: img.width,
            height: img.height,
            aspectRatio: `${img.width}:${img.height} (${aspectRatio}:1)`
          });
        };
        img.src = URL.createObjectURL(file);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-gray-600">Create and manage courses</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-xl">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </DialogTitle>
              <DialogDescription>
                {editingCourse ? 'Update the course information' : 'Create a new course'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter course title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter course description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="bannerImage" className="text-sm font-medium">Banner Image {!editingCourse ? '*' : '(Optional)'}</Label>
                <Input
                  id="bannerImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  disabled={uploading}
                  required={!editingCourse}
                />
                {uploading && (
                  <p className="text-sm text-blue-600 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Uploading...
                  </p>
                )}
                {formData.bannerImage && (
                  <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                    <img
                      src={formData.bannerImage}
                      alt="Banner preview"
                      className="w-full h-24 object-cover rounded-md border"
                    />
                    {imageDimensions && (
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        Dimensions: {imageDimensions.aspectRatio}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Upload an image for the course banner (recommended aspect ratio: 16:9)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pageLink" className="text-sm font-medium">Course Page Link *</Label>
                <Input
                  id="pageLink"
                  value={formData.pageLink}
                  onChange={(e) => setFormData({ ...formData, pageLink: e.target.value })}
                  placeholder="https://example.com/course"
                  required
                />
              </div>
              
              <DialogFooter className="flex gap-3 pt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingCourse ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingCourse ? 'Update Course' : 'Create Course'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first course to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
            <CardDescription>
              Drag and drop courses to reorder them. The first 3 courses will be displayed on the home page. Manage your courses and view access request statistics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[50px]">Order</TableHead>
                    <TableHead className="min-w-[200px]">Course</TableHead>
                    <TableHead className="min-w-[200px]">Description</TableHead>
                    <TableHead className="min-w-[100px]">Requests</TableHead>
                    <TableHead className="min-w-[100px]">Created</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-500">#{course.order}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{course.title}</div>
                          {course.pageLink && (
                            <a
                              href={course.pageLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Course
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {course.description || 'No description'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {course._count?.accessRequests || 0} requests
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(course.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(course)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(course.id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={deletingCourseId === course.id}
                          >
                            {deletingCourseId === course.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}