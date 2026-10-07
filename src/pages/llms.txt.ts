import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site';

/**
 * /llms.txt — a concise, Markdown summary of the site for language models and
 * answer engines (see https://llmstxt.org). Generated from the same content the
 * pages use, so it never drifts. The longer companion is /llms-full.txt.
 */
export const GET: APIRoute = async () => {
  const books = (await getCollection('books')).sort((a, b) => a.data.order - b.data.order);
  const u = (p: string) => `${SITE.url}${p}`;

  const out = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.longDescription} ${SITE.name} is a subsidiary of the ${SITE.parent.name} (${SITE.parent.shortName}), ${SITE.parent.note}.`,
    '',
    'Zo Media Productions publishes books, develops film and theatre projects, runs the newsletter The Phuckin\' Wire, and shares economic benefit with the incarcerated creators whose work it publishes.',
    '',
    '## Main pages',
    `- [About](${u('/about/')}): Mission, the cooperative model, and the founder's story.`,
    `- [Books](${u('/books/')}): Memoir, essays, poetry, and anthologies by incarcerated authors.`,
    `- [Film Projects](${u('/film-projects/')}): Screenplays, theatrical works, and documentaries.`,
    `- [The Phuckin' Wire](${u('/the-wire/')}): Advocacy journalism written by and for incarcerated people.`,
    `- [Special Projects](${u('/special-projects/')}): Original work at the intersection of art and advocacy.`,
    `- [Support](${u('/support/')}): Donate, volunteer, sponsor, or share the work.`,
    `- [Contact](${u('/contact/')}): Partnerships, press, publishing and film inquiries.`,
    '',
    '## Books',
    ...books.map((b) => `- [${b.data.title}](${u(`/books/${b.id}/`)}): ${b.data.author}. ${b.data.description}`),
    '',
    '## People',
    `- [Staff & Volunteers](${u('/staff-and-volunteers/')})`,
    `- [Board of Directors](${u('/board-of-directors/')})`,
    `- [Advisory Board](${u('/advisory-board/')})`,
    '',
    '## Contact',
    `- Email: ${SITE.email}`,
    `- Phone: ${SITE.phoneDisplay}`,
    `- Mail: ${SITE.legalName}, ${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}`,
    '',
    '## Optional',
    `- [Full site text for LLMs](${u('/llms-full.txt')})`,
    `- [Sitemap](${u('/sitemap-index.xml')})`,
    `- [Privacy Policy](${u('/privacy/')})`,
    '',
  ];

  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
