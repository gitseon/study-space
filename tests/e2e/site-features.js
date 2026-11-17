import {readFileSync} from 'node:fs';
import path from 'node:path';

// SQLD and the SW test page are switched off in scripts/build_data.py. Their checks run again when they are published.
// If the built manifest cannot be read the site is assumed to have them, so the checks are never skipped silently.
const manifest = (() => {
  try {
    return JSON.parse(readFileSync(path.join(process.env.SITE_DIR || 'dist', 'data', 'manifest.json'), 'utf8'));
  } catch {
    return null;
  }
})();

export const siteHasSqld = manifest ? 'sqld' in manifest.tracks : true;
export const siteHasSwTest = manifest ? !!manifest.swTest : true;
