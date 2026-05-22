/** Build-safe URL for files in /public (handles PUBLIC_URL / GitHub Pages subpath). */
export function publicAsset(path) {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
