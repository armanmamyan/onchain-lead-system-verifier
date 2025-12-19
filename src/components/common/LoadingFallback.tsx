import { Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
    <Card className="max-w-md w-full mx-4">
      <CardContent className="pt-6 text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
        <h2 className="text-xl font-semibold">Loading Verifier...</h2>
        <p className="text-muted-foreground">
          Please wait while we set up the verification system
        </p>
      </CardContent>
    </Card>
  </div>
);

export default LoadingFallback;
