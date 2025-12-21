// lib/utils/jwt.ts
import { env } from "@/lib/env";
import * as jose from "jose";

type Scope = "verify" | "issue";

export interface JwtPayload {
  partnerId: string;
  scope: Scope;
  [key: string]: unknown;
}

export const signJwt = async (payload: JwtPayload): Promise<string> => {
  try {
    // Format the private key properly
    const formattedKey = formatPrivateKey(env.PARTNER_PRIVATE_KEY);
    
    console.log('🔑 Importing private key...');
    console.log('Key preview:', formattedKey.substring(0, 50) + '...');
    
    const privateKey = await jose.importPKCS8(
      formattedKey,
      env.SIGNING_ALGORITHM
    );

    console.log('✅ Private key imported successfully');

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: env.SIGNING_ALGORITHM,
        kid: env.NEXT_PUBLIC_PARTNER_ID,
      })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(privateKey);

    console.log('✅ JWT signed successfully');
    return jwt;
  } catch (error) {
    console.error('❌ JWT signing error:', error);
    throw error;
  }
};

function formatPrivateKey(key: string): string {
  // Remove any whitespace
  const cleanKey = key.replace(/\s+/g, '');
  
  // Check if it already has headers
  if (cleanKey.includes('-----BEGIN')) {
    return cleanKey;
  }
  
  // Add headers
  return `-----BEGIN PRIVATE KEY-----\n${cleanKey}\n-----END PRIVATE KEY-----`;
}