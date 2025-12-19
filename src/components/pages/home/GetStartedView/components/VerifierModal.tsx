"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { env } from "@/lib/env";
import { useAirkit } from "@/hooks/useAirkit";
import axios from "axios";
import { CopyIcon, Loader2, CheckCircle, Shield, Fingerprint } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type AuthTokenResponse = {
  authToken: string;
};

export function VerifierModal() {
  const { airService, isInitialized } = useAirkit();
  const [status, setStatus] = useState<
    "success" | "error" | "loading" | "initial"
  >("initial");

  const onContinue = async () => {
    setStatus("loading");

    try {
      try {
        while (!airService.isLoggedIn) {
          await airService.login();
        }
      } catch (error) {
        setStatus("initial");
        throw error;
      }

      try {
        const { authToken } = (
          await axios.get<AuthTokenResponse>("/api/auth-token")
        ).data;

        await airService.verifyCredential({
          authToken,
          programId: env.NEXT_PUBLIC_VERIFIER_PROGRAM_ID,
          redirectUrl: env.NEXT_PUBLIC_ISSUER_URL,
        });
        setStatus("success");
      } catch (error) {
        setStatus("error");
        throw error;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const buttonText = useMemo(
    () =>
      isInitialized
        ? status === "loading"
          ? "Verifying..."
          : "Quick Verify"
        : "Initializing...",
    [status, isInitialized]
  );
  const isLoading = useMemo(
    () => status === "loading" || !isInitialized,
    [status, isInitialized]
  );

  return (
    <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-lg max-w-3xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            Quick Access
          </Badge>
        </div>
        <CardTitle className="text-xl">
          {status === "success" ? "Verification Complete!" : "Already Have Credentials?"}
        </CardTitle>
        <CardDescription>
          {status === "success"
            ? "Use this code to sign up and get your $20 trading credit"
            : "Verify your existing credentials directly here"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "success" ? (
          <div className="space-y-4">
            {/* Success State */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div className="bg-green-50/80 dark:bg-green-950/30 p-4 rounded-lg border border-green-500/20">
              <p className="text-sm text-center text-muted-foreground mb-2">Your referral code:</p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-2xl font-bold text-green-700 dark:text-green-400">
                  1234567890
                </span>
                <button
                  type="button"
                  aria-label="Copy code"
                  className="p-2 rounded-md hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText("1234567890");
                    toast.success("Code copied to clipboard");
                  }}
                >
                  <CopyIcon className="h-5 w-5 text-green-600" />
                </button>
              </div>
            </div>

            <Link
              href={env.NEXT_PUBLIC_RETURN_URL}
              target={
                env.NEXT_PUBLIC_RETURN_URL.startsWith("http")
                  ? "_blank"
                  : undefined
              }
              className="block"
            >
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {`Continue to ${env.NEXT_PUBLIC_RETURN_SITE_NAME}`}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Initial/Loading State */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Fingerprint className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Instant Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    If you already have Oyunfor credentials, verify them here without navigating away
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={onContinue}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 cursor-pointer"
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              <Shield className="mr-2 h-5 w-5" />
              {buttonText}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Don&apos;t have credentials yet?{" "}
              <Link href="/issue" className="text-blue-600 hover:underline">
                Get verified first
              </Link>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
