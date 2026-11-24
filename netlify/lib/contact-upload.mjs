import { randomUUID } from 'node:crypto';
import { documentError } from '../../src/lib/contact-upload.mjs';

const reply = (status, data) => Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
export const uploadStoreName = (deployContext) => deployContext === 'production' ? 'contact-documents' : 'contact-documents-preview';

// Deliberately write-only. Downloads require the authenticated Netlify dashboard.
export function createUploadHandler(getStore, storeName = 'contact-documents') {
  return async (request) => {
    if (request.method !== 'POST') return reply(405, { error: 'Method not allowed.' });
    if (request.headers.get('origin') !== new URL(request.url).origin) return reply(403, { error: 'Submit from the contact page.' });
    if (Number(request.headers.get('content-length')) > 4 * 1024 * 1024 + 65536) return reply(413, { error: 'Choose a document smaller than 4 MB.' });
    let data;
    try { data = await request.formData(); } catch { return reply(400, { error: 'Invalid upload.' }); }
    if (data.get('bot-field')) return reply(400, { error: 'Invalid upload.' });
    const file = data.get('document');
    if (!(file instanceof File)) return reply(400, { error: 'Choose a document to upload.' });
    const error = documentError(file);
    if (error) return reply(file.size > 4 * 1024 * 1024 ? 413 : 400, { error });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const extension = file.name.split('.').pop().toLowerCase();
    const prefix = new TextDecoder().decode(bytes.slice(0, 8));
    if ((extension === 'pdf' && !prefix.startsWith('%PDF-')) ||
        (['docx', 'pptx'].includes(extension) && !(bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 3 && bytes[3] === 4)) ||
        (['txt', 'fdx'].includes(extension) && bytes.includes(0))) return reply(400, { error: 'The document does not match its file type.' });
    const filename = file.name.replace(/[^a-zA-Z0-9._ -]/g, '_').replace(/^\.+/, '').slice(-120) || `document.${extension}`;
    const key = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}/${filename}`;
    try {
      await getStore(storeName).set(key, bytes.buffer, { metadata: { filename, size: file.size, uploadedAt: new Date().toISOString() } });
    } catch { return reply(503, { error: 'The document could not be uploaded. Please try again.' }); }
    return reply(201, { reference: `${storeName}/${key}` });
  };
}
