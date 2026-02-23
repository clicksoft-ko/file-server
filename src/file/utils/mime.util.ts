const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/tiff': 'tiff',
  'application/pdf': 'pdf',
  'application/json': 'json',
  'application/xml': 'xml',
  'application/zip': 'zip',
  'text/plain': 'txt',
  'text/html': 'html',
  'text/css': 'css',
};

const EXT_TO_MIME: Record<string, string> = Object.fromEntries(
  Object.entries(MIME_TO_EXT).map(([mime, ext]) => [ext, mime]),
);

export function mimeToExtension(mimetype: string): string {
  return MIME_TO_EXT[mimetype] ?? mimetype.split('/')[1] ?? 'bin';
}

export function extensionToMime(ext: string): string {
  return EXT_TO_MIME[ext] ?? 'application/octet-stream';
}
