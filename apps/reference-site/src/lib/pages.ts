import fs from 'node:fs/promises';
import path from 'node:path';
import type { Data } from '@puckeditor/core';

const PAGES_DIR = path.join(process.cwd(), 'src', 'content', 'pages');

export async function loadPage(slug: string): Promise<Data | null> {
  const file = path.join(PAGES_DIR, `${slug}.json`);
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw) as Data;
  } catch (e: any) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
}

export async function listPageSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(PAGES_DIR);
    return entries.filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

const EMPTY_PAGE: Data = { content: [], root: { props: {} } };

export function emptyPage(): Data {
  return EMPTY_PAGE;
}
