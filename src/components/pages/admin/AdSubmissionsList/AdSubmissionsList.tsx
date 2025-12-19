'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getAllAdSubmissions,
  updateAdSubmissionStatus,
  deleteAdSubmission,
  getAdSubmissionsStats,
} from '@/lib/actions/ad-submissions';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { type AdSubmissionType, type StatsType } from '@/lib/types';
import { Loader2, Download, Trash2, CheckCircle, XCircle, Play } from 'lucide-react';

const headers = [
  'Ad Name',
  'Description',
  'Max Issuance',
  'From',
  'Until',
  'Contact Email',
  'Contact Person',
  'Status',
  'Created At',
  'Created By',
];

const getStatusBadgeVariant = (status: AdSubmissionType['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'ACTIVE':
      return 'default';
    case 'APPROVED':
      return 'secondary';
    case 'PENDING':
      return 'outline';
    case 'REJECTED':
      return 'destructive';
    case 'EXPIRED':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusColor = (status: AdSubmissionType['status']) => {
  switch (status) {
    case 'ACTIVE':
      return 'text-green-600 bg-green-100 dark:bg-green-950/50';
    case 'APPROVED':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-950/50';
    case 'PENDING':
      return 'text-amber-600 bg-amber-100 dark:bg-amber-950/50';
    case 'REJECTED':
      return 'text-red-600 bg-red-100 dark:bg-red-950/50';
    case 'EXPIRED':
      return 'text-gray-600 bg-gray-100 dark:bg-gray-950/50';
    default:
      return '';
  }
};

const AdSubmissionsList = () => {
  const [submissions, setSubmissions] = useState<AdSubmissionType[]>([]);
  const [stats, setStats] = useState<StatsType>({
    total: 0,
    pending: 0,
    approved: 0,
    active: 0,
    rejected: 0,
    expired: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    const [submissionsResult, statsResult] = await Promise.all([
      getAllAdSubmissions(),
      getAdSubmissionsStats(),
    ]);

    if (submissionsResult.success && submissionsResult.data) {
      setSubmissions(submissionsResult.data as AdSubmissionType[]);
    }

    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusChange = useCallback(async (
    id: string,
    newStatus: AdSubmissionType['status']
  ) => {
    const result = await updateAdSubmissionStatus(id, newStatus);

    if (result.success) {
      toast.success(`Status updated to ${newStatus}`);
      fetchSubmissions();
    } else {
      toast.error('Failed to update status');
    }
  }, [fetchSubmissions]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    const result = await deleteAdSubmission(id);

    if (result.success) {
      toast.success('Submission deleted successfully');
      fetchSubmissions();
    } else {
      toast.error('Failed to delete submission');
    }
  }, [fetchSubmissions]);

  const exportToCSV = useCallback(() => {
    const rows = submissions.map((sub) => [
      sub.adName,
      sub.adDescription,
      sub.maximumIssuance,
      format(new Date(sub.accessibleFrom), 'yyyy-MM-dd HH:mm'),
      format(new Date(sub.accessibleUntil), 'yyyy-MM-dd HH:mm'),
      sub.contactEmail,
      sub.contactPersonName,
      sub.status,
      format(new Date(sub.createdAt), 'yyyy-MM-dd HH:mm'),
      sub.createdBy?.username || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ad-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();

    toast.success('CSV exported successfully');
  }, [submissions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-muted-foreground">Loading submissions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-amber-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-amber-600">
              {stats.pending}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-blue-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {stats.approved}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-green-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {stats.active}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-red-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {stats.rejected}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expired</CardDescription>
            <CardTitle className="text-2xl text-gray-600">
              {stats.expired}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Ad Submissions</CardTitle>
              <CardDescription>
                Manage and review all advertising campaigns
              </CardDescription>
            </div>
            <Button
              onClick={exportToCSV}
              variant="outline"
              disabled={submissions.length === 0}
              className="cursor-pointer"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No submissions yet</p>
              <p className="text-sm">Ad campaign submissions will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Slots</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-xs">
                          <p className="font-semibold truncate">{sub.adName}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {sub.adDescription}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{sub.contactPersonName}</p>
                          <p className="text-muted-foreground">
                            {sub.contactEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{sub.maximumIssuance}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {format(
                              new Date(sub.accessibleFrom),
                              'MMM dd, yyyy'
                            )}
                          </p>
                          <p className="text-muted-foreground">
                            to{' '}
                            {format(
                              new Date(sub.accessibleUntil),
                              'MMM dd, yyyy'
                            )}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadgeVariant(sub.status)}
                          className={getStatusColor(sub.status)}
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(sub.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {sub.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(sub.id, 'APPROVED')
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 cursor-pointer"
                                onClick={() =>
                                  handleStatusChange(sub.id, 'REJECTED')
                                }
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {sub.status === 'APPROVED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:text-blue-700 cursor-pointer"
                              onClick={() =>
                                handleStatusChange(sub.id, 'ACTIVE')
                              }
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                            onClick={() => handleDelete(sub.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdSubmissionsList;