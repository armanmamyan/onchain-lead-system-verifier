"use client";

import {
  AirService,
  BUILD_ENV,
} from "@mocanetwork/airkit";
import { memo, useEffect, useState } from "react";
import { AirkitContext } from "@/contexts/AirkitContext";
import { env } from "@/lib/env";

export const defaultAirkitOptions: Parameters<
  typeof AirService.prototype.init
>[0] = {
  buildEnv: BUILD_ENV.SANDBOX,
  enableLogging: true,
  skipRehydration: false,
  preloadCredential: true,
};

// Create singleton outside of component to avoid ref issues
let airServiceInstance: AirService | null = null;

const getAirService = () => {
  if (airServiceInstance === null) {
    airServiceInstance = new AirService({
      partnerId: env.NEXT_PUBLIC_PARTNER_ID,
    });
  }
  return airServiceInstance;
};

export const AirkitProvider = memo(
  ({ children }: { children: React.ReactNode }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initAttempted, setInitAttempted] = useState(false);
    const airService = getAirService();

   

    useEffect(() => {
      // Prevent double initialization in React Strict Mode
      if (initAttempted) {
        return;
      }

      setInitAttempted(true);

      const init = async () => {
        try {
          if (airService.isInitialized) {
            setIsInitialized(true);
            return;
          }

          await airService.init(defaultAirkitOptions);
          airService.preloadCredential().catch((err) => {
            console.warn("⚠️ Preload credential failed (non-critical):", err);
          });

          setIsInitialized(true);
        } catch (error) {
          console.error("❌ Error initializing AIR Kit:", error);
          setError(error instanceof Error ? error.message : "Unknown error");
          setIsInitialized(true);
        }
      };

      init();

    }, [initAttempted, airService]);


    if (error) {
      console.error("Provider Error:", error);
    }


    return (
      <AirkitContext.Provider value={{airService, isInitialized}}>{children}</AirkitContext.Provider>
    );
  }
);

AirkitProvider.displayName = "AirkitProvider";
