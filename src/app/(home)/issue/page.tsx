"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAirkit } from "@/hooks/useAirkit";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CheckCircle,
  Wallet,
  Shield,
  ArrowRight,
  Fingerprint,
  Repeat,
} from "lucide-react";
import { env } from "@/lib/env";
import axios from "axios";
import Link from "next/link";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import StepIndicator from "@/components/pages/issue/StepIndicator";
import { Alchemy, Network } from "alchemy-sdk";
import { BalanceData } from "@/lib/types";
import { useSignMessage } from "wagmi";
import { getEthPrice, getTokenPrice, walletMessage } from "@/lib/utils/web3";
import { createOrUpdateUser } from "@/lib/actions/users";

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  network: Network.ETH_MAINNET,
});

type AuthTokenResponse = {
  authToken: string;
};
const renderStepContentTitle = (step: number) => {
  switch (step) {
    case 1:
      return "Step 1: Login with AIR Kit";
    case 2:
      return "Step 2: Connect Your Wallet";
    case 3:
      return "Step 3: Issue Your Credential";
    case 4:
      return "Credential Issued Successfully!";
  }
};

const renderStepContentDescription = (step: number) => {
  switch (step) {
    case 1:
      return "Authenticate with AIR Kit to create your decentralized identity";
    case 2:
      return "Connect your wallet so we can verify your balance";
    case 3:
      return "Review your information and issue your credential";
    case 4:
      return "Your credentials have been verified and stored securely";
  }
};

const IssueCredential = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [error, setError] = useState("");
  const { airService, isInitialized } = useAirkit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const signMessage = useSignMessage();

  const getUserInfo = useCallback(async () => {
    if (airService.isLoggedIn) {
      const userData = await airService.getUserInfo();
      return {
        email: userData.user.email,
        id: userData.user.id,
      };
    }
    return null;
  }, [airService]);
  
  const fetchBalance = useCallback(async (walletAddress: `0x${string}`) => {
    try {
      setIsLoadingBalance(true);
      setError("");
      const ethBalance = await alchemy.core.getBalance(walletAddress, "latest");
      const ethBalanceFormatted = parseFloat(ethBalance.toString()) / 1e18;
      const tokenBalances = await alchemy.core.getTokenBalances(walletAddress);
      const ethPrice = await getEthPrice();

      const tokens = await Promise.all(
        tokenBalances.tokenBalances
          .filter((token) => token.tokenBalance !== "0x0")
          .map(async (token) => {
            const metadata = await alchemy.core.getTokenMetadata(
              token.contractAddress
            );
            const tokenBalance =
              parseInt(token.tokenBalance || "0", 16) /
              Math.pow(10, metadata.decimals || 18);

            const price = getTokenPrice(token.contractAddress);

            return {
              symbol: metadata.symbol || "UNKNOWN",
              balance: tokenBalance,
              usdValue: tokenBalance * price,
            };
          })
      );

      const totalUsd =
        ethBalanceFormatted * ethPrice +
        tokens.reduce((sum, token) => sum + token.usdValue, 0);

      setBalanceData({
        totalUsd,
        eth: ethBalanceFormatted,
        tokens,
      });
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
      setError("Failed to fetch wallet balance. Please try again.");
    } finally {
      setIsLoadingBalance(false);
    }
  }, []);

  useEffect(() => {
    if (address && step === 3) {
      fetchBalance(address as `0x${string}`);
      signMessage.mutate({ message: walletMessage(address as `0x${string}`) });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, step]);

  // Derived values from balanceData
  const balanceEth = useMemo(() => balanceData?.eth ?? 0, [balanceData]);
  const balanceUsd = useMemo(() => balanceData?.totalUsd ?? 0, [balanceData]);
  const hasBalance = useMemo(
    () => balanceEth > 0 || (balanceData?.tokens?.length ?? 0) > 0,
    [balanceEth, balanceData]
  );

  // Step 1: AIR Login
  const handleAirLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      await airService.login();
      setStep(2);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "AIR login failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [airService]);

  // Step 2: Connect Wallet
  const handleConnectWallet = useCallback(async () => {
    try {
      setError("");
      open({ view: "Connect" });
      setStep(3);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Wallet connection failed";
      setError(errorMessage);
    }
  }, [open]);

  // Step 3: Issue Credential
  const handleIssueCredential = useCallback(async () => {
    if (!address || !balanceData) {
      setError("Wallet not connected or balance not loaded");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Get auth token from our API
      const { authToken } = (
        await axios.get<AuthTokenResponse>("/api/issue-token")
      ).data;

      const credentialSubject = {
        id: `${env.NEXT_PUBLIC_PARTNER_ID}-${address}`,
        walletAddress: address,
        "balance-eth": balanceData.eth,
        "balance-usd": 1,
        "verified-at": new Date().toISOString(),
      };
      
      // Issue credential with AIR Kit
      // Note: The issueCredential method requires issuerDid and credentialId from the partner setup
      await airService.issueCredential({
        authToken,
        issuerDid: env.NEXT_PUBLIC_ISSUER_DID!,
        credentialId: env.NEXT_PUBLIC_PROGRAM_ID!,
        credentialSubject,
      });

      // Get AIR Kit user info and register the user in database
      const userInfo = await getUserInfo();
      if (userInfo) {
        await createOrUpdateUser({
          walletAddress: address,
          airKitId: userInfo.id,
          airKitEmail: userInfo.email || "",
          isCredentialIssued: true,
          credentialSubject: JSON.stringify(credentialSubject),
        });
      }
     
      setStep(4);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Credential issuance failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, balanceData, airService]);

  useEffect(() => {
    if(airService?.isLoggedIn) {
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Fingerprint className="h-5 w-5 text-white" />
              </div>
              <Badge variant="secondary">Credential Issuer</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Get Your Verified Credentials
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Issue verifiable credentials for your wallet balance to access
              exclusive content and offers
            </p>
          </div>

          <Separator />

          {/* Progress Steps */}
          <div className="flex justify-center">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <StepIndicator
                currentStep={step}
                stepNumber={1}
                label="AIR Login"
              />
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <StepIndicator
                currentStep={step}
                stepNumber={2}
                label="Connect Wallet"
              />
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <StepIndicator
                currentStep={step}
                stepNumber={3}
                label="Issue Credential"
              />
            </div>
          </div>

          {/* Main Card */}
          <Card className="border-2 border-purple-500/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">
                {renderStepContentTitle(step)}
              </CardTitle>
              <CardDescription>
                {renderStepContentDescription(step)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error}{" "}
                    <Button
                      variant="outline"
                      onClick={() => fetchBalance(address as `0x${string}`)}
                    >
                      <Repeat className="h-4 w-4" />
                      Try Again
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Step 1: AIR Login */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          Secure Authentication
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          AIR Kit provides decentralized identity management
                          with privacy-preserving verification
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleAirLogin}
                    disabled={isLoading || !isInitialized}
                    size="lg"
                    className="w-full text-lg h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Logging in...
                      </>
                    ) : !isInitialized ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Login with AIR Kit
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Step 2: Connect Wallet */}
              {step === 2 && (
                <div className="space-y-4">
                  <Alert className="border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      AIR Login Successful! Now connect your wallet.
                    </AlertDescription>
                  </Alert>
                  <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <Wallet className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">
                          Wallet Connection
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          We&apos;ll read your wallet balance to create a
                          verifiable credential
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleConnectWallet}
                    size="lg"
                    className="w-full text-lg h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
                  >
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet
                  </Button>
                </div>
              )}

              {/* Step 3: Issue Credential */}
              {step === 3 && isConnected && (
                <div className="space-y-4">
                  <Alert className="border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      Wallet Connected! Review your details below.
                    </AlertDescription>
                  </Alert>

                  {/* Loading Balance State */}
                  {isLoadingBalance ? (
                    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-center gap-3 py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                          <span className="text-muted-foreground">
                            Fetching wallet balance...
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ) : balanceData ? (
                    <>
                      {/* Wallet Info Card */}
                      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Wallet Address
                              </span>
                              <span className="font-mono text-sm">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                ETH Balance
                              </span>
                              <span className="font-semibold">
                                {balanceEth.toFixed(6)} ETH
                              </span>
                            </div>
                            {balanceData.tokens.length > 0 && (
                              <>
                                <Separator />
                                <div className="space-y-2">
                                  <span className="text-sm text-muted-foreground">
                                    Tokens
                                  </span>
                                  <div className="space-y-1">
                                    {balanceData.tokens
                                      .slice(0, 5)
                                      .map((token, idx) => (
                                        <div
                                          key={idx}
                                          className="flex justify-between text-sm"
                                        >
                                          <span className="text-muted-foreground">
                                            {token.symbol}
                                          </span>
                                          <span>
                                            {token.balance.toFixed(4)}
                                          </span>
                                        </div>
                                      ))}
                                    {balanceData.tokens.length > 5 && (
                                      <span className="text-xs text-muted-foreground">
                                        +{balanceData.tokens.length - 5} more
                                        tokens
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                            <Separator />
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Total USD Value
                              </span>
                              <span
                                className={`font-bold text-lg ${
                                  balanceUsd > 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                $
                                {balanceUsd.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* No Balance Warning */}
                      {!hasBalance ? (
                        <>
                          <Alert
                            variant="destructive"
                            className="border-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                          >
                            <AlertDescription className="text-red-800 dark:text-red-200">
                              <strong>No assets found.</strong> This wallet has
                              no balance. Please connect a different wallet with
                              assets to issue credentials.
                            </AlertDescription>
                          </Alert>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={() => {
                                disconnect();
                                setBalanceData(null);
                                setStep(2);
                              }}
                              variant="outline"
                              size="lg"
                              className="flex-1"
                            >
                              <Wallet className="mr-2 h-5 w-5" />
                              Disconnect Wallet
                            </Button>
                            <Button
                              onClick={() => {
                                disconnect();
                                setBalanceData(null);
                                open({ view: "Connect" });
                              }}
                              size="lg"
                              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            >
                              <Wallet className="mr-2 h-5 w-5" />
                              Connect Different Wallet
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-500/20">
                            <p className="text-sm text-muted-foreground">
                              <strong>What happens next:</strong> We&apos;ll
                              issue a verifiable credential with your wallet
                              balance. This credential is encrypted and stored
                              securely, allowing you to prove your balance
                              without revealing the actual amount.
                            </p>
                          </div>

                          <Button
                            onClick={handleIssueCredential}
                            disabled={isLoading}
                            size="lg"
                            className="w-full text-lg h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Issuing Credential...
                              </>
                            ) : (
                              <>
                                <Fingerprint className="mr-2 h-5 w-5" />
                                Issue Credential
                              </>
                            )}
                          </Button>

                          {/* Option to change wallet */}
                          <div className="text-center">
                            <button
                              onClick={() => {
                                disconnect();
                                setBalanceData(null);
                                setStep(2);
                              }}
                              className="text-sm text-muted-foreground hover:text-foreground underline"
                            >
                              Use a different wallet
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  ) : null}
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                      Credential Issued!
                    </h3>
                    <p className="text-muted-foreground">
                      Your wallet credentials have been verified and stored
                      securely on the Moca chain.
                    </p>
                  </div>

                  <div className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-4 border border-green-500/20">
                    <div className="space-y-2 text-sm text-left">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Wallet balance verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Zero-knowledge proof generated</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Credential stored on-chain</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/" className="flex-1 cursor-pointer">
                      <Button className="w-full" size="lg">
                        Browse Offers
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link
                      href="/verify?partnerId=oyunfor&rule=wallet_balance_gt_1000&successUrl=/okx&failUrl=/fallback"
                      className="flex-1 cursor-pointer"
                    >
                      <Button variant="outline" className="w-full" size="lg">
                        Test Verification
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              🔒 Your credentials are encrypted and only you control access to
              them.
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

export default IssueCredential;
