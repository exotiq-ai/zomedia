/** @param {Record<string, any>} book */
export function purchaseOptions(book) {
  if (!book.commerceReviewed || book.isForthcoming) return [];
  const candidates = [
    { format: 'print', label: 'Buy Print', url: book.printPurchaseUrl || book.purchaseUrl, price: book.priceHardcover },
    ...(book.ebookRightsCleared ? [{ format: 'ebook', label: 'Buy eBook', url: book.ebookPurchaseUrl, price: book.priceEbook }] : []),
  ];
  return candidates.filter((option) => {
    try { return new URL(option.url).protocol === 'https:'; } catch { return false; }
  });
}

/** @param {{ claimsApproved?: boolean, stats?: Record<string, number> } | null} settings */
export function approvedImpactStats(settings) {
  if (!settings?.claimsApproved || !settings.stats) return null;
  const stats = settings.stats;
  const keys = ['booksPublished', 'profitsToCommunity', 'creators', 'projects'];
  if (!keys.every((key) => Number.isInteger(stats[key]) && stats[key] >= 0) || stats.profitsToCommunity > 100) return null;
  return stats;
}
