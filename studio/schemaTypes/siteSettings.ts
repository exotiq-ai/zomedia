import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'stats',
      title: 'Homepage numbers ("By the numbers")',
      type: 'object',
      description: 'Only publish figures you can stand behind.',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'booksPublished', title: 'Books published', type: 'number', validation: (r) => r.integer().min(0) }),
        defineField({ name: 'profitsToCommunity', title: 'Profits to community (%)', type: 'number', validation: (r) => r.min(0).max(100) }),
        defineField({ name: 'creators', title: 'Incarcerated creators', type: 'number', validation: (r) => r.integer().min(0) }),
        defineField({ name: 'projects', title: 'Special projects', type: 'number', validation: (r) => r.integer().min(0) }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social media links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', options: { list: ['Facebook', 'Instagram', 'X / Twitter', 'YouTube', 'TikTok', 'LinkedIn'] }, validation: (r) => r.required() }),
            defineField({ name: 'url', type: 'url', validation: (r) => r.required().uri({ scheme: ['https'] }) }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
