import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';

const projectRoot = process.cwd();

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith('@/')) {
    const requestedPath = path.join(projectRoot, specifier.slice(2));
    const resolvedFilePath = existsSync(requestedPath) ? requestedPath : `${requestedPath}.ts`;
    const resolvedPath = pathToFileURL(resolvedFilePath).href;
    return defaultResolve(resolvedPath, context, defaultResolve);
  }

  if (specifier.startsWith('.') && !path.extname(specifier) && context.parentURL?.startsWith('file:')) {
    const parentDirectory = path.dirname(fileURLToPath(context.parentURL));
    const requestedPath = path.resolve(parentDirectory, specifier);
    const resolvedFilePath = existsSync(requestedPath) ? requestedPath : `${requestedPath}.ts`;

    if (existsSync(resolvedFilePath)) {
      return defaultResolve(pathToFileURL(resolvedFilePath).href, context, defaultResolve);
    }
  }

  return defaultResolve(specifier, context, defaultResolve);
}
