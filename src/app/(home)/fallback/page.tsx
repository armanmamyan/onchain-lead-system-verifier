import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { XCircle, ArrowRight, HelpCircle, Shield, Wallet } from 'lucide-react';

const FallbackPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-white" />
              </div>
              <Badge variant="secondary">
                Verification Required
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Requirements Not Met
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              This exclusive offer requires verified credentials that meet specific criteria
            </p>
          </div>

          <Separator />

          {/* Main Card */}
          <Card className="border-2 border-red-500/20 shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <CardTitle className="text-xl">Access Denied</CardTitle>
              <CardDescription>
                Your credentials did not meet the advertiser&apos;s requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Requirements Box */}
              <div className="bg-red-50/50 dark:bg-red-950/20 rounded-lg p-4 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2">Required Criteria</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Verified credentials from Oyunfor
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Wallet balance greater than $1,000
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Active ecosystem participant status
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How to Qualify */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2">How to Qualify</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                      <li>Ensure your wallet has at least $1,000 in assets</li>
                      <li>Get verified credentials from the Oyunfor platform</li>
                      <li>Return to the offer and verify again</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Alternative Options */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Wallet className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Need to add funds?</h4>
                    <p className="text-sm text-muted-foreground">
                      You can add funds to your wallet through any major exchange and then return to get verified.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/issue" className="block">
                  <Button
                    size="lg"
                    className="w-full text-lg h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Get Verified Credentials
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    Browse Standard Offers
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="text-center text-xs text-muted-foreground">
            <p>Don&apos;t have the required balance? There are other offers available that may suit your profile.</p>
            <p className="mt-1">Powered by DAT Network & Moca Network AIR Kit</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FallbackPage;
