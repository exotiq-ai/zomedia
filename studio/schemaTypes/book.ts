import { defineField, defineType } from 'sanity';

export const book = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required().max(120) }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'The web address of the book page, e.g. "domestic-genocide". Click Generate. Changing it later breaks old links.',
      options: { source: 'title', maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      type: 'string',
      description: 'Use "Author to be announced" if the author is not public yet.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Memoir', value: 'memoir' },
          { title: 'Essays', value: 'essays' },
          { title: 'Anthology', value: 'anthology' },
          { title: 'Poetry', value: 'poetry' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'Shown on the book card and in search results. Aim for 1–2 sentences (max 300 characters).',
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'longDescription',
      title: 'Longer description (optional)',
      type: 'text',
      rows: 8,
      description: 'Extra paragraphs for the book page. Separate paragraphs with a blank line. Leave empty to show only the short description.',
    }),
    defineField({
      name: 'cover',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describe the cover for people who cannot see it, e.g. "Cover of Domestic Genocide: stylized fist over a prison tower".',
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({ name: 'priceHardcover', title: 'Print price', type: 'string', description: 'e.g. $14.95', validation: (r) => r.regex(/^\$\d+(\.\d{2})?$/, { name: 'price' }).error('Use the format $14.95') }),
    defineField({ name: 'priceEbook', title: 'eBook price', type: 'string', description: 'e.g. $4.99', validation: (r) => r.regex(/^\$\d+(\.\d{2})?$/, { name: 'price' }).error('Use the format $4.99') }),
    defineField({
      name: 'purchaseUrl',
      title: 'Where to buy',
      type: 'url',
      description: 'Link to the page where people can buy this book. Leave empty until it is on sale.',
      validation: (r) => r.uri({ scheme: ['https'] }),
    }),
    defineField({ name: 'isForthcoming', title: 'Forthcoming (not published yet)', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', type: 'number', description: 'Lower numbers appear first on the Books page.', initialValue: 100, validation: (r) => r.required().integer().min(0) }),
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'author', media: 'cover', forthcoming: 'isForthcoming' },
    prepare: ({ title, subtitle, media, forthcoming }) => ({ title, subtitle: `${subtitle ?? ''}${forthcoming ? ' · forthcoming' : ''}`, media }),
  },
});
