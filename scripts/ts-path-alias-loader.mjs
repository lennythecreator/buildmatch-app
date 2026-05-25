import path from 'node:path';
import { pathToFileURL } from 'node:url';

const projectRoot = process.cwd();

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith('@/')) {
    const resolvedPath = pathToFileURL(path.join(projectRoot, specifier.slice(2))).href;
    return defaultResolve(resolvedPath, context, defaultResolve);
  }

  return defaultResolve(specifier, context, defaultResolve);
}
