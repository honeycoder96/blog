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

const OG_WIDTH  = 1200;
const OG_HEIGHT = 630;

const OG_COLORS = {
  bg:       '#0d0d0d',
  title:    '#f9fafb',
  muted:    '#6b7280',
  subtle:   '#4b5563',
  border:   '#374151',
} as const;

// Titles longer than this threshold use a smaller font size to avoid overflow
const TITLE_LONG_THRESHOLD = 60;
const TITLE_FONT_SIZE = { normal: '56px', long: '44px' } as const;

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
          padding: '72px 80px',
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
                      fontSize: '18px',
                      color: OG_COLORS.muted,
                      letterSpacing: '0.15em',
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
                      fontSize: data.title.length > TITLE_LONG_THRESHOLD
                        ? TITLE_FONT_SIZE.long
                        : TITLE_FONT_SIZE.normal,
                      fontWeight: 700,
                      color: OG_COLORS.title,
                      lineHeight: 1.15,
                      maxWidth: '960px',
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
                gap: '24px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '14px',
                      color: OG_COLORS.muted,
                      border: `1px solid ${OG_COLORS.border}`,
                      padding: '6px 14px',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontWeight: 400,
                    },
                    children: data.category,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { color: OG_COLORS.subtle, fontSize: '14px' },
                    children: data.author,
                  },
                },
                ...(data.readingTime
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { color: OG_COLORS.subtle, fontSize: '14px' },
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
