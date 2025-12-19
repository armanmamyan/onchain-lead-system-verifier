'use client';

import { AirEventData, AirLoginResult, AirService, BUILD_ENV } from "@mocanetwork/airkit";
import { memo, useCallback, useEffect, useState } from "react";
import { AirkitContext } from "@/contexts/AirkitContext";
import { env } from "@/lib/env";

export const defaultAirkitOptions: Parameters<typeof AirService.prototype.init>[0] = {
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

export const AirkitProvider = memo(({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginResult, setLoginResult] = useState<AirLoginResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initAttempted, setInitAttempted] = useState(false);

  // Get the singleton instance
  const airService = getAirService();

  const eventListener = useCallback((eventData: AirEventData) => {
    if (eventData.event === "logged_in") {
      setIsLoggedIn(true);
      setLoginResult(eventData.result);
    } else if (eventData.event === "logged_out") {
      setIsLoggedIn(false);
      setLoginResult(null);
    }
  }, []);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initAttempted) {
      return;
    }
    
    setInitAttempted(true);

    const init = async () => {
      try {
        // Check if already initialized
        if (airService.isInitialized) {
          setIsInitialized(true);
          return;
        }

        // Set up event listener
        console.log('📡 Setting up event listener...');
        airService.on(eventListener);

        // Initialize AIR Kit
        console.log('⚙️ Calling airService.init()...');
        await airService.init(defaultAirkitOptions);
        console.log('✅ airService.init() completed');

        // Preload credentials (don't block on this)
        console.log('📦 Preloading credentials...');
        airService.preloadCredential().catch(err => {
          console.warn('⚠️ Preload credential failed (non-critical):', err);
        });

        // Mark as initialized
        setIsInitialized(true);

      } catch (error) {
        console.error('❌ Error initializing AIR Kit:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        
        // Still mark as initialized so app doesn't hang
        setIsInitialized(true);
      }
    };

    init();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up AIR Kit');
      try {
        airService.off(eventListener);
      } catch (e) {
        console.warn('⚠️ Cleanup warning:', e);
      }
    };
  }, [initAttempted, eventListener, airService]);

  if (error) {
    console.error('Provider Error:', error);
  }

  return (
    <AirkitContext.Provider
      value={{ airService, isInitialized, isLoggedIn, loginResult }}
    >
      {children}
    </AirkitContext.Provider>
  );
});

AirkitProvider.displayName = "AirkitProvider";
