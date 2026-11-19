/** Reject a broken CMS response before clearing the previous content store.
 * @param {Array<Record<string, any>>} docs
 * @param {string} collection
 */
export function validateDocuments(docs, collection) {
  if (!Array.isArray(docs) || !docs.length) throw new Error(`Sanity ${collection}: empty collection; refusing to publish an empty site`);
  const slugs = new Set();
  for (const doc of docs) {
    if (!doc._id || doc._id.startsWith('drafts.') || doc._id.startsWith('versions.')) throw new Error(`Sanity ${collection}: unpublished record`);
    if (!doc.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(doc.slug)) throw new Error(`Sanity ${collection}: invalid slug for ${doc._id}`);
    const key = collection === 'team' ? `${doc.category}/${doc.slug}` : doc.slug;
    if (slugs.has(key)) throw new Error(`Sanity ${collection}: duplicate slug ${key}`);
    slugs.add(key);
    if (collection === 'books' && (!doc.cover?.asset?._ref || !doc.cover?.alt?.trim())) throw new Error(`Sanity books: cover and alternative text required for ${doc._id}`);
  }
}
