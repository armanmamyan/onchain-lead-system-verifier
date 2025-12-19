/**
 * Parses a rule string to extract the balance threshold
 * @param ruleString - Rule in format "wallet_balance_gt_{amount}"
 * @returns The numeric threshold value (default: 1000)
 */
export const parseRule = (ruleString: string): number => {
  const parts = ruleString.split("_");
  const threshold = parts[parts.length - 1];
  return parseInt(threshold) || 1000;
};

/**
 * Builds a verifier URL with custom parameters
 * @param options - Verification parameters
 * @returns Complete verifier URL with query parameters
 */
export const buildVerifierUrl = (options: {
  partnerId?: string;
  rule?: string;
  successUrl?: string;
  failUrl?: string;
} = {}): string => {
  const {
    partnerId = "oyunfor",
    rule = "wallet_balance_gt_1000",
    successUrl = "/okx",
    failUrl = "/fallback",
  } = options;

  const params = new URLSearchParams({
    partnerId,
    rule,
    successUrl,
    failUrl,
  });

  return `/verify?${params.toString()}`;
};

/**
 * Default verifier URL for POC testing
 * Uses default parameters: oyunfor partner, $1000 threshold, /okx success, /fallback fail
 */
export const VERIFIER_URL = buildVerifierUrl();