import { defineField, defineType } from 'sanity';

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', description: 'Include titles if they should show, e.g. "Dr. Kexiah Poole".', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name', maxLength: 60 }, validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string', description: 'e.g. "Board Member", "Chief Financial Officer".', validation: (r) => r.required() }),
    defineField({
      name: 'category',
      title: 'Group',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Board of Directors', value: 'board' },
          { title: 'Advisory Board', value: 'advisory' },
          { title: 'Staff', value: 'staff' },
          { title: 'Volunteer', value: 'volunteer' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'bio', type: 'text', rows: 8, description: 'Separate paragraphs with a blank line. Only publish what the person has approved.' }),
    defineField({
      name: 'photo',
      title: 'Headshot',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional. Square or portrait crops work best. Without one, the site shows the person\'s initials.',
      fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string' })],
    }),
    defineField({ name: 'order', type: 'number', description: 'Lower numbers appear first within the group.', initialValue: 100, validation: (r) => r.required().integer().min(0) }),
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
});
