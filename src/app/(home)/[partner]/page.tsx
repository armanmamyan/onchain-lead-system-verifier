import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Trophy, Star, Gift, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

interface PartnerPageProps {
  params: Promise<{
    partner: string;
  }>;
}

export default async function AdvertiserSuccessPage({ params }: PartnerPageProps) {
  const { partner } = await params;
  
  // Format partner name for display
  const partnerName = partner.charAt(0).toUpperCase() + partner.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                Verified Access
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Welcome to {partnerName} Premium!
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your credentials have been verified. You now have access to exclusive offers and features.
            </p>
          </div>

          <Separator />

          {/* Success Banner */}
          <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-lg overflow-hidden">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">
                Verification Successful!
              </CardTitle>
              <CardDescription>
                You&apos;ve been verified as a premium ecosystem participant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* VIP Benefits */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Crown className="h-6 w-6" />
                  Exclusive VIP Benefits
                </h3>
                <p className="text-green-100 mb-4">
                  As a verified user with $1,000+ wallet balance, you unlock:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4" />
                    </div>
                    <span>Premium trading features with advanced tools</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-4 w-4" />
                    </div>
                    <span>50% lower trading fees on all transactions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Gift className="h-4 w-4" />
                    </div>
                    <span>$20 trading credit bonus applied to your account</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Crown className="h-4 w-4" />
                    </div>
                    <span>Early access to new token listings</span>
                  </li>
                </ul>
              </div>

              {/* Status Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Verification Status</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">Active</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valid For</p>
                    <p className="font-semibold">30 Days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tier</p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">Premium</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Start Trading
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    View Dashboard
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0">
                    <Gift className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Bonus Applied</h4>
                    <p className="text-sm text-muted-foreground">
                      Your $20 trading credit has been automatically added to your account
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Priority Support</h4>
                    <p className="text-sm text-muted-foreground">
                      24/7 VIP customer support is now available for your account
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back to Partner Link */}
          <div className="text-center">
            <Link href="/">
              <Button variant="link" className="text-muted-foreground">
                ← Back to Oyunfor
              </Button>
            </Link>
          </div>

          {/* Footer Note */}
          <div className="text-center text-xs text-muted-foreground">
            <p>Your verified status was confirmed using zero-knowledge proofs. Your data remains private.</p>
            <p className="mt-1">Powered by DAT Network & Moca Network AIR Kit</p>
          </div>
        </div>
      </main>
    </div>
  );
}
