import type { DemoConfig } from './types';

type DemoModule = Record<string, DemoConfig>;

const loaders: Record<string, () => Promise<DemoModule>> = {
  'before-promises': () => import('./before-promises').then((m) => m.default),
};

const cache = new Map<string, DemoModule>();

export async function loadDemo(compositeId: string): Promise<DemoConfig | null> {
  const slashIndex = compositeId.indexOf('/');
  if (slashIndex === -1) return null;

  const blogSlug = compositeId.substring(0, slashIndex);
  const demoKey = compositeId.substring(slashIndex + 1);

  let demos = cache.get(blogSlug);
  if (!demos) {
    const loader = loaders[blogSlug];
    if (!loader) return null;
    demos = await loader();
    cache.set(blogSlug, demos);
  }

  return demos[demoKey] ?? null;
}
