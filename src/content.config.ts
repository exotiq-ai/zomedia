import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
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
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
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
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
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
