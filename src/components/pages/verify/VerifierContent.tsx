'use client';

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Shield,
  Fingerprint,
  Lock,
} from "lucide-react";
import { useAirkit } from "@/hooks/useAirkit";
import { env } from "@/lib/env";
import { parseRule } from "@/lib/utils/verification";
import axios from "axios";

type AuthTokenResponse = {
  authToken: string;
};

type VerificationStatus =
  | "initializing"
  | "ready"
  | "verifying"
  | "success"
  | "failed";
const VerifierContent = ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const router = useRouter();
  const { airService, isInitialized } = useAirkit();

  const [status, setStatus] = useState<VerificationStatus>("initializing");
  const [message, setMessage] = useState("Initializing verification system...");
  const [countdown, setCountdown] = useState<number | null>(null);

  const params = use(searchParams)
  const partnerId = params.partnerId as string || "oyunfor";
  const successUrl = params.successUrl as string || "/okx";
  const failUrl = params.failUrl as string || "/fallback";
  const rule = params.rule as string || "wallet_balance_gt_1000";
  const requiredBalance = parseRule(rule);

  const handleRedirect = (url: string) => {
    // Check if URL is external (starts with http:// or https://)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.location.href = url;
    } else {
      router.push(url);
    }
  };

  // Countdown redirect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      if (status === "success") {
        handleRedirect(successUrl);
      } else if (status === "failed") {
        handleRedirect(failUrl);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, status, successUrl, failUrl, router]);

  useEffect(() => {
    if (isInitialized && status === "initializing") {
      setStatus("ready");
      setMessage("Click below to verify your credentials");
    }
  }, [isInitialized, status]);

  const startVerification = async () => {
    setStatus("verifying");
    setMessage("Opening AIR Kit authentication...");

    try {
      // Step 1: Login with AIR Kit if not already logged in
      if (!airService.isLoggedIn) {
        await airService.login();
      }

      setMessage("Fetching authorization token...");

      // Step 2: Get auth token from our API
      const { authToken } = (
        await axios.get<AuthTokenResponse>("/api/auth-token")
      ).data;

      setMessage("Verifying your credentials with zero-knowledge proof...");

      // Step 3: Verify credentials with AIR Kit
      const result = await airService.verifyCredential({
        authToken,
        programId: env.NEXT_PUBLIC_VERIFIER_PROGRAM_ID,
        redirectUrl: env.NEXT_PUBLIC_ISSUER_URL || "/issue",
      });
      console.log({result});
      
      // Step 4: Check if credential meets requirements
      if (result?.status === 'Compliant') {
        setStatus("success");
        setMessage(
          `Verification successful!`
        );
        setCountdown(3);
      } else {
        // No credential found - redirect to issuer
        setStatus("failed");
        setMessage(
          "No valid credentials found. You need to get verified first."
        );
        setCountdown(5);
      }
    } catch (error: unknown) {
      console.error("Verification failed:", error);
      setStatus("failed");
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Verification process was cancelled or failed";
      setMessage(errorMessage);
      setCountdown(5);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <Badge variant="secondary">DAT Network Verifier</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Credential Verification
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Verify your on-chain credentials to access exclusive content from{" "}
              {partnerId.charAt(0).toUpperCase() + partnerId.slice(1)}
            </p>
          </div>

          <Separator />

          {/* Main Verification Card */}
          <Card className="border-2 border-blue-500/20 shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">
                {status === "initializing" && "Setting Up..."}
                {status === "ready" && "Ready to Verify"}
                {status === "verifying" && "Verifying Credentials"}
                {status === "success" && "Verification Successful!"}
                {status === "failed" && "Verification Failed"}
              </CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Icon */}
              <div className="flex justify-center py-4">
                {(status === "initializing" || status === "verifying") && (
                  <div className="relative">
                    <Loader2 className="h-20 w-20 animate-spin text-blue-600" />
                    <Fingerprint className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" />
                  </div>
                )}
                {status === "ready" && (
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                    <Lock className="h-10 w-10 text-blue-600" />
                  </div>
                )}
                {status === "success" && (
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                )}
                {status === "failed" && (
                  <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                    <XCircle className="h-12 w-12 text-red-600" />
                  </div>
                )}
              </div>

              {/* Requirement Info */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">
                      Verification Requirement
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Wallet balance greater than{" "}
                      <strong className="text-blue-700 dark:text-blue-400">
                        ${requiredBalance.toLocaleString()}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Steps */}
              {status === "verifying" && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Connecting to AIR Kit</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span>Generating zero-knowledge proof</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground opacity-50">
                    <div className="h-4 w-4 rounded-full border-2" />
                    <span>Validating requirements</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {status === "ready" && (
                <Button
                  size="lg"
                  className="w-full text-lg h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                  onClick={startVerification}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Verify My Credentials
                  </span>
                </Button>
              )}

              {/* Countdown */}
              {countdown !== null && (
                <p className="text-center text-sm text-muted-foreground">
                  Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}
                  ...
                </p>
              )}

              {/* Failed - Manual Redirect Options */}
              {status === "failed" && countdown !== null && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setCountdown(null);
                      setStatus("ready");
                      setMessage("Click below to verify your credentials");
                    }}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => router.push("/issue")}
                  >
                    Get Credentials
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacy Note */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              🔒 Your data is verified using zero-knowledge proofs. We never see
              your actual wallet balance.
            </p>
            <p className="mt-1">
              Powered by DAT Network & Moca Network AIR Kit
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifierContent;