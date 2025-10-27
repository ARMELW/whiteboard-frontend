/**
 * Constants for subscription plan limits
 */

/**
 * Represents unlimited access for a specific feature or limit
 * @example
 * if (plan.limits.scenes === PLAN_LIMIT_UNLIMITED) {
 *   // User has unlimited scenes
 * }
 */
export const PLAN_LIMIT_UNLIMITED = -1;

/**
 * Represents no cloud storage (local only)
 * @example
 * if (plan.limits.storage === PLAN_LIMIT_NO_CLOUD_STORAGE) {
 *   // User can only save locally
 * }
 */
export const PLAN_LIMIT_NO_CLOUD_STORAGE = 0;

/**
 * Helper function to check if a limit is unlimited
 */
export function isUnlimited(limit: number): boolean {
  return limit === PLAN_LIMIT_UNLIMITED;
}

/**
 * Helper function to format a limit value for display
 */
export function formatLimit(limit: number, unit?: string): string {
  if (limit === PLAN_LIMIT_UNLIMITED) {
    return 'Illimité';
  }
  if (limit === PLAN_LIMIT_NO_CLOUD_STORAGE && unit === 'storage') {
    return 'Local uniquement';
  }
  return unit ? `${limit} ${unit}` : String(limit);
}

/**
 * Helper function to get a displayable infinity symbol for unlimited
 */
export function getUnlimitedDisplay(limit: number): string {
  return limit === PLAN_LIMIT_UNLIMITED ? '∞' : String(limit);
}
