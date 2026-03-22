import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { siteConfig } from '../config/site';

export interface OgData {
  title: string;
  category: string;
  author: string;
  readingTime?: number | null;
}

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

export async function generateOgImage(data: OgData): Promise<Buffer> {
  const { interRegular, interBold } = await getFonts();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0d0d0d',
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
                      color: '#6b7280',
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
                      fontSize: data.title.length > 60 ? '44px' : '56px',
                      fontWeight: 700,
                      color: '#f9fafb',
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
                      color: '#6b7280',
                      border: '1px solid #374151',
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
                    style: { color: '#4b5563', fontSize: '14px' },
                    children: data.author,
                  },
                },
                ...(data.readingTime
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { color: '#4b5563', fontSize: '14px' },
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
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interRegular!, weight: 400, style: 'normal' },
        { name: 'Inter', data: interBold!, weight: 700, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  return Buffer.from(resvg.render().asPng());
}
