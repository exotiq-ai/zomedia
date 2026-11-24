import { getStore } from '@netlify/blobs';
import { createUploadHandler, uploadStoreName } from '../lib/contact-upload.mjs';

export default (request, context) => createUploadHandler(getStore, uploadStoreName(context.deploy.context))(request);
export const config = { rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: 'ip' } };
