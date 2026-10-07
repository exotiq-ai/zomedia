import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) {
  throw new Error('Set SANITY_STUDIO_PROJECT_ID (copy studio/.env.example to studio/.env.local).');
}

/** Documents that exist exactly once and should not show an "add new" button. */
const SINGLETONS = ['siteSettings'];

export default defineConfig({
  name: 'zomedia',
  title: 'Zo Media Productions',
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings')),
            S.divider(),
            S.documentTypeListItem('book').title('Books'),
            S.documentTypeListItem('specialProject').title('Special Projects'),
            S.divider(),
            S.listItem()
              .title('People')
              .child(
                S.list()
                  .title('People')
                  .items([
                    S.listItem().title('Board of Directors').child(S.documentList().title('Board of Directors').filter('_type == "teamMember" && category == "board"').defaultOrdering([{ field: 'order', direction: 'asc' }])),
                    S.listItem().title('Advisory Board').child(S.documentList().title('Advisory Board').filter('_type == "teamMember" && category == "advisory"').defaultOrdering([{ field: 'order', direction: 'asc' }])),
                    S.listItem().title('Staff').child(S.documentList().title('Staff').filter('_type == "teamMember" && category == "staff"').defaultOrdering([{ field: 'order', direction: 'asc' }])),
                    S.listItem().title('Volunteers').child(S.documentList().title('Volunteers').filter('_type == "teamMember" && category == "volunteer"').defaultOrdering([{ field: 'order', direction: 'asc' }])),
                    S.divider(),
                    S.documentTypeListItem('teamMember').title('Everyone'),
                  ])
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: '2025-01-01' }),
  ],
  schema: {
    types: schemaTypes,
    // Hide the singleton from the global "create new" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    // Singletons: no duplicate / delete.
    actions: (input, { schemaType }) =>
      SINGLETONS.includes(schemaType) ? input.filter(({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action)) : input,
  },
});
