import { getStore } from '@netlify/blobs';
import { createUploadHandler } from '../lib/contact-upload.mjs';

export default (request) => createUploadHandler(getStore, process.env.CONTEXT === 'production' ? 'contact-documents' : 'contact-documents-preview')(request);
export const config = { rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: 'ip' } };
