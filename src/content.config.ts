import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { SANITY_ENABLED, sanityLoader, queries, mappers } from './lib/sanity';

/**
 * Content source switch: with PUBLIC_SANITY_PROJECT_ID set, collections load from Sanity
 * (editors manage them in the Studio — see docs/SANITY.md). Otherwise they load from the
 * Markdown files in src/content, so local dev and CI never depend on the CMS.
 */
const source = (
  name: string,
  markdownDir: string,
  query: string,
  map: (d: any) => { id: string; data: Record<string, unknown>; body?: string }
) => (SANITY_ENABLED ? sanityLoader({ name, query, map }) : glob({ pattern: '**/*.md', base: markdownDir }));

const books = defineCollection({
  loader: source('books', './src/content/books', queries.books, mappers.book),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    category: z.enum(['memoir', 'essays', 'anthology', 'poetry']),
    description: z.string(),
    coverImage: z.string(),
    priceHardcover: z.string(),
    priceEbook: z.string(),
    purchaseUrl: z.string().optional(),
    isForthcoming: z.boolean().default(false),
    order: z.number(),
  }),
});

const team = defineCollection({
  loader: source('team', './src/content/team', queries.team, mappers.team),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    category: z.enum(['staff', 'volunteer', 'board', 'advisory']),
    bio: z.string(),
    photo: z.string().optional(),
    order: z.number(),
  }),
});

const projects = defineCollection({
  loader: source('projects', './src/content/projects', queries.projects, mappers.project),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    tagline: z.string(),
    description: z.string(),
    heroImage: z.string().optional(),
    externalUrl: z.string().optional(),
    status: z.enum(['active', 'placeholder']),
    order: z.number(),
  }),
});

export const collections = { books, team, projects };
