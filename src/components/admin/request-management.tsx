'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, X, AlertTriangle, MessageSquare } from 'lucide-react';

interface RequestManagementProps {
  request: {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    message?: string;
    adminNote?: string;
    createdAt: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
    course: {
      id: string;
      title: string;
    };
  };
  onRequestUpdated: () => void;
}

export function RequestManagement({ request, onRequestUpdated }: RequestManagementProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  const handleAction = async (status: string, note?: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/access-requests/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNote: note }),
      });

      if (response.ok) {
        onRequestUpdated();
        setAdminNote('');
      } else {
        alert('Failed to update request');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request');
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

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{request.course.title}</h3>
          <p className="text-sm text-gray-600">
            Requested by: {request.user.name || request.user.email}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge className={getStatusColor(request.status)}>
          {request.status}
        </Badge>
      </div>
      
      {request.message && (
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm font-medium mb-1 flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>User Message:</span>
          </p>
          <p className="text-sm text-gray-600">{request.message}</p>
        </div>
      )}
      
      {request.adminNote && (
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-sm font-medium mb-1 flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>Admin Note:</span>
          </p>
          <p className="text-sm text-gray-600">{request.adminNote}</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {request.status === 'PENDING' && (
          <>
            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center space-x-1">
                  <Check className="h-4 w-4" />
                  <span>Approve</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Request</DialogTitle>
                  <DialogDescription>
                    Approve this course access request for {request.user.name || request.user.email}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="approveNote">Admin Note (Optional)</Label>
                    <Textarea
                      id="approveNote"
                      placeholder="Add a note for the user..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleAction('APPROVED', adminNote)} disabled={loading}>
                    {loading ? 'Approving...' : 'Approve Request'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex items-center space-x-1">
                  <X className="h-4 w-4" />
                  <span>Reject</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Request</DialogTitle>
                  <DialogDescription>
                    Reject this course access request. A reason is required.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rejectNote">Rejection Reason *</Label>
                    <Textarea
                      id="rejectNote"
                      placeholder="Please provide a reason for rejection..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleAction('REJECTED', adminNote)} 
                    disabled={loading || !adminNote.trim()}
                  >
                    {loading ? 'Rejecting...' : 'Reject Request'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
        
        {request.status === 'APPROVED' && (
          <>
            <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Suspend</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Suspend Access</DialogTitle>
                  <DialogDescription>
                    Suspend course access for {request.user.name || request.user.email}. A reason is required.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="suspendNote">Suspension Reason *</Label>
                    <Textarea
                      id="suspendNote"
                      placeholder="Please provide a reason for suspension..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleAction('SUSPENDED', adminNote)} 
                    disabled={loading || !adminNote.trim()}
                  >
                    {loading ? 'Suspending...' : 'Suspend Access'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="destructive" className="flex items-center space-x-1">
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Access</DialogTitle>
                  <DialogDescription>
                    Cancel course access for {request.user.name || request.user.email}. A reason is required.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cancelNote">Cancellation Reason *</Label>
                    <Textarea
                      id="cancelNote"
                      placeholder="Please provide a reason for cancellation..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleAction('REJECTED', adminNote)} 
                    disabled={loading || !adminNote.trim()}
                  >
                    {loading ? 'Cancelling...' : 'Cancel Access'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
        
        {request.status === 'SUSPENDED' && (
          <>
            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center space-x-1">
                  <Check className="h-4 w-4" />
                  <span>Re-approve</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Re-approve Access</DialogTitle>
                  <DialogDescription>
                    Restore course access for {request.user.name || request.user.email}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reapproveNote">Admin Note (Optional)</Label>
                    <Textarea
                      id="reapproveNote"
                      placeholder="Add a note for the user..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleAction('APPROVED', adminNote)} disabled={loading}>
                    {loading ? 'Re-approving...' : 'Re-approve Access'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="destructive" className="flex items-center space-x-1">
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Access</DialogTitle>
                  <DialogDescription>
                    Cancel course access for {request.user.name || request.user.email}. A reason is required.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cancelNote">Cancellation Reason *</Label>
                    <Textarea
                      id="cancelNote"
                      placeholder="Please provide a reason for cancellation..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleAction('REJECTED', adminNote)} 
                    disabled={loading || !adminNote.trim()}
                  >
                    {loading ? 'Cancelling...' : 'Cancel Access'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {request.status === 'REJECTED' && (
          <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center space-x-1">
                <Check className="h-4 w-4" />
                <span>Approve</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Request</DialogTitle>
                <DialogDescription>
                  Approve this previously rejected course access request for {request.user.name || request.user.email}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="approveNote">Admin Note (Optional)</Label>
                  <Textarea
                    id="approveNote"
                    placeholder="Add a note for the user..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleAction('APPROVED', adminNote)} disabled={loading}>
                  {loading ? 'Approving...' : 'Approve Request'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}