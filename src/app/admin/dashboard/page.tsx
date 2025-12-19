import AdSubmissionsList from "@/components/pages/admin/AdSubmissionsList";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboardPage() {
  return (
    <div className="container h-full mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline">Dashboard</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Ad Campaign Management</h1>
        <p className="text-muted-foreground max-w-2xl">
          Review, approve, and manage advertising campaigns. Track campaign status and export data for reporting.
        </p>
      </div>
      
      <Separator className="mb-8" />
      
      <AdSubmissionsList />
    </div>
  );
}
