import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VERIFIER_URL } from "@/lib/utils/verification";
// To create custom verifier URLs, use: buildVerifierUrl({ rule: "wallet_balance_gt_5000", successUrl: "https://..." })

const Footer = () => (
    <footer className="border-t bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/issue">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Get Verified Credentials
                </Button>
              </Link>
              <Link href={VERIFIER_URL}>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Test Verification Flow
                </Button>
              </Link>
            </div>
            <Separator className="max-w-md mx-auto" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Powered by DAT Network & Moca Network AIR Kit
              </p>
              <p className="text-xs text-muted-foreground">
                Secure, verified, and transparent credential verification for Web3
              </p>
            </div>
          </div>
        </div>
      </footer>
)
export default Footer
