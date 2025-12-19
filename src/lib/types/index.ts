// Ad Submission Types
export type AdSubmissionStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'ACTIVE' 
  | 'EXPIRED';

export interface AdSubmissionType {
  id: string;
  adName: string;
  adDescription: string;
  maximumIssuance: number;
  accessibleFrom: Date | string;
  accessibleUntil: Date | string;
  contactEmail: string;
  contactPersonName: string;
  status: AdSubmissionStatus;
  createdById?: string | null;
  createdBy?: {
    username: string;
  } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StatsType {
  total: number;
  pending: number;
  approved: number;
  active: number;
  rejected: number;
  expired: number;
}

// Balance data type from Alchemy
export type TokenBalance = {
  symbol: string;
  balance: number;
  usdValue: number;
};

export type BalanceData = {
  totalUsd: number;
  eth: number;
  tokens: TokenBalance[];
};

// NextAuth Types Extension - extend the default types
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    username?: string;
  }
}
