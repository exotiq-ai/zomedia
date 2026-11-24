export const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;
export const DOCUMENT_ACCEPT = '.pdf,.docx,.pptx,.txt,.fdx';

export function documentError(file) {
  if (!file || !file.size) return 'Choose a document to upload.';
  if (file.size > MAX_DOCUMENT_BYTES) return 'Choose a document smaller than 4 MB.';
  if (!/\.(pdf|docx|pptx|txt|fdx)$/i.test(file.name)) return 'Use a PDF, DOCX, PPTX, TXT or FDX document.';
  return '';
}
