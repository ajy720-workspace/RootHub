export function normalizeTarget(target: string): string {
  return target.trim().toLowerCase().replace(/[^a-z-]/g, "");
}
