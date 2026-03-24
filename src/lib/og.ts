import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { siteConfig } from '../config/site';

/** Input data for Open Graph image generation. */
export interface OgData {
  title: string;
  category: string;
  author: string;
  readingTime?: number | null;
}

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const OG_COLORS = {
  bg: '#0d0d0d',
  title: '#f9fafb',
  muted: '#6b7280',
  subtle: '#4b5563',
  border: '#374151',
} as const;

// Titles longer than this threshold use a smaller font size to avoid overflow
const TITLE_LONG_THRESHOLD = 60;
const TITLE_FONT_SIZE = { normal: '56px', long: '44px' } as const;
const TITLE_LINE_HEIGHT = 1.15;
const TITLE_MAX_WIDTH = '960px';

const OG_PADDING = '72px 80px';

const OG_FONT_SIZE = {
  url: '18px',
  meta: '14px',
} as const;

const OG_META_GAP = '24px';

const OG_BADGE = {
  padding: '6px 14px',
  borderRadius: '999px',
  border: '1px',
} as const;

const OG_LETTER_SPACING = {
  url: '0.15em',
  badge: '0.1em',
} as const;

// Load fonts once per build process (cached in module scope)
let interRegular: ArrayBuffer | null = null;
let interBold: ArrayBuffer | null = null;

async function getFonts() {
  if (!interRegular) {
    const buf = await readFile(
      resolve('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff'),
    );
    interRegular = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }
  if (!interBold) {
    const buf = await readFile(
      resolve('node_modules/@fontsource/inter/files/inter-latin-700-normal.woff'),
    );
    interBold = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }
  return { interRegular, interBold };
}

/** Generates a 1200×630 PNG Open Graph image for a blog or series post. */
export async function generateOgImage(data: OgData): Promise<Buffer> {
  const { interRegular, interBold } = await getFonts();

  const svg = await satori(
    // satori accepts a plain object tree; cast to avoid ReactNode type mismatch
    {
      type: 'div',
      props: {
        style: {
          width: `${OG_WIDTH}px`,
          height: `${OG_HEIGHT}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: OG_COLORS.bg,
          padding: OG_PADDING,
          fontFamily: 'Inter',
        },
        children: [
          // Top: site name
          {
            type: 'div',
            props: {
              style: { display: 'flex' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: OG_FONT_SIZE.url,
                      color: OG_COLORS.muted,
                      letterSpacing: OG_LETTER_SPACING.url,
                      textTransform: 'uppercase',
                      fontWeight: 400,
                    },
                    children: siteConfig.siteUrl.replace(/^https?:\/\//, ''),
                  },
                },
              ],
            },
          },
          // Middle: title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                alignItems: 'center',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize:
                        data.title.length > TITLE_LONG_THRESHOLD
                          ? TITLE_FONT_SIZE.long
                          : TITLE_FONT_SIZE.normal,
                      fontWeight: 700,
                      color: OG_COLORS.title,
                      lineHeight: TITLE_LINE_HEIGHT,
                      maxWidth: TITLE_MAX_WIDTH,
                    },
                    children: data.title,
                  },
                },
              ],
            },
          },
          // Bottom: category + author + reading time
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: OG_META_GAP,
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: OG_FONT_SIZE.meta,
                      color: OG_COLORS.muted,
                      border: `${OG_BADGE.border} solid ${OG_COLORS.border}`,
                      padding: OG_BADGE.padding,
                      borderRadius: OG_BADGE.borderRadius,
                      textTransform: 'uppercase',
                      letterSpacing: OG_LETTER_SPACING.badge,
                      fontWeight: 400,
                    },
                    children: data.category,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { color: OG_COLORS.subtle, fontSize: OG_FONT_SIZE.meta },
                    children: data.author,
                  },
                },
                ...(data.readingTime
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { color: OG_COLORS.subtle, fontSize: OG_FONT_SIZE.meta },
                          children: `${data.readingTime} min read`,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        ],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- satori first arg is a plain object, not ReactNode
    } as any,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        { name: 'Inter', data: interRegular!, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBold!, weight: 700, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } });
  return Buffer.from(resvg.render().asPng());
}
