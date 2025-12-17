'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Link } from 'lucide-react';

interface AddCourseFormProps {
  onCourseAdded: () => void;
}

export function AddCourseForm({ onCourseAdded }: AddCourseFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bannerText: '',
    pageLink: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/courses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setOpen(false);
        setFormData({
          title: '',
          description: '',
          bannerText: '',
          pageLink: ''
        });
        onCourseAdded();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Create a new course for the academy. All fields are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              placeholder="Enter course title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              placeholder="Enter course description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bannerText">Course Banner Text</Label>
            <Input
              id="bannerText"
              placeholder="Enter gorgeous banner text"
              value={formData.bannerText}
              onChange={(e) => setFormData({...formData, bannerText: e.target.value})}
              required
            />
            <p className="text-xs text-gray-500">
              Enter attractive text to display as the course banner
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pageLink" className="flex items-center space-x-2">
              <Link className="h-4 w-4" alt="" />
              <span>Course Page Link</span>
            </Label>
            <Input
              id="pageLink"
              placeholder="https://example.com/course"
              value={formData.pageLink}
              onChange={(e) => setFormData({...formData, pageLink: e.target.value})}
              required
            />
            <p className="text-xs text-gray-500">
              Provide the URL where users can access the course content
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}