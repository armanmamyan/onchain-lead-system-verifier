import { NextResponse } from 'next/server';
import * as jose from 'jose';
import { env } from 'process';

export async function GET() {
  try {
    // Format the public key
    const publicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${env.PARTNER_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
    
    // Import the public key
    const publicKey = await jose.importSPKI(publicKeyPEM, env.SIGNING_ALGORITHM!);
    
    // Export as JWK
    const jwk = await jose.exportJWK(publicKey);
    
    // Create JWKS structure
    const jwks = {
      keys: [
        {
          ...jwk,
          kid: env.NEXT_PUBLIC_PARTNER_ID,  // Key ID (your partner ID)
          use: 'sig',                         // Usage: signature
          alg: env.SIGNING_ALGORITHM,        // Algorithm: RS256
        }
      ]
    };
    
    return NextResponse.json(jwks, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error generating JWKS:', error);
    return NextResponse.json(
      { error: 'Failed to generate JWKS' },
      { status: 500 }
    );
  }
}
