/**
 * Minimal mock for astro:content — used only during vitest runs.
 * The real module is a build-time virtual module unavailable outside the Astro build context.
 */
export async function getCollection(): Promise<[]> {
  return [];
}
