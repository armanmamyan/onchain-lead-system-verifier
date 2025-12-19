import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DebuggingInfo,
} from "@/components/pages/home/GetStartedView/components";

const PartnerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <Badge variant="secondary">AIR Kit Partner</Badge>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Welcome to Oyunfor
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted Web3 gaming platform. Discover premium games and
              unlock exclusive content with verified on-chain credentials.
            </p>
          </div>

          <Separator />

          {/* Featured Advertisement Card */}
          <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="default"
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      Featured Game
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-amber-500 text-amber-700 dark:text-amber-400"
                    >
                      Premium Offer
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl">
                    Exclusive Web3 Adventure Game
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="text-base">
                Experience the next generation of gaming with verified on-chain
                rewards. This exclusive game is available only to active
                ecosystem participants with verified credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Program Timeline */}
              <div className="bg-amber-50/50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-500/20">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-muted-foreground">
                        Campaign Ends
                      </p>
                      <p className="text-base font-bold text-amber-700 dark:text-amber-400">
                        December 31st, 2025
                      </p>
                    </div>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="hidden sm:block h-12"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎫</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-muted-foreground">
                        Premium Slots
                      </p>
                      <p className="text-base font-bold text-amber-700 dark:text-amber-400">
                        1000 Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements & Benefits */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xl">💰</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-1">
                      Qualification Requirement
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      This advertiser requires active ecosystem participants
                      with a{" "}
                      <strong className="text-blue-700 dark:text-blue-400">
                        wallet balance greater than $1,000
                      </strong>
                      . DAT Network will verify your credentials seamlessly
                      before granting access.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                    Verified Access
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Instant credential verification via AIR Kit
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                    Premium Rewards
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Earn exclusive in-game assets and benefits
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                    On-Chain Proof
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All rewards verified on the blockchain
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                    Privacy First
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Your data stays with you, always secure
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link href='/issue' className="block">
                  <Button
                    size="lg"
                    className="w-full text-lg h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      Play Now - Get Verified
                      <span className="text-xl">→</span>
                    </span>
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  DAT Network will verify your wallet credentials and route you
                  to the game
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎮 Strategy Games</CardTitle>
                <CardDescription>Build and conquer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Plan your moves and dominate the battlefield in epic strategy
                  games.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⚔️ RPG Adventures</CardTitle>
                <CardDescription>Epic quests await</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Embark on legendary adventures and collect rare NFT items.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🕹️ Arcade Classics</CardTitle>
                <CardDescription>Retro gaming fun</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Enjoy classic arcade games with blockchain-powered
                  leaderboards.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          <DebuggingInfo />
        </div>
      </main>
    </div>
  );
}


export default PartnerPage;