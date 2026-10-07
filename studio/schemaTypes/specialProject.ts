import { defineField, defineType } from 'sanity';

export const specialProject = defineType({
  name: 'specialProject',
  title: 'Special project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 60 }, validation: (r) => r.required() }),
    defineField({ name: 'tagline', type: 'string', description: 'One line under the title.', validation: (r) => r.max(120) }),
    defineField({ name: 'description', type: 'text', rows: 4, validation: (r) => r.max(400) }),
    defineField({
      name: 'status',
      type: 'string',
      options: { layout: 'radio', list: [{ title: 'Active (live)', value: 'active' }, { title: 'Coming soon', value: 'placeholder' }] },
      initialValue: 'placeholder',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'externalUrl', title: 'Link (when live)', type: 'url', validation: (r) => r.uri({ scheme: ['https'] }) }),
    defineField({ name: 'heroImage', title: 'Image (optional)', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alternative text' })] }),
    defineField({ name: 'order', type: 'number', initialValue: 100, validation: (r) => r.required().integer().min(0) }),
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'status', media: 'heroImage' } },
});
