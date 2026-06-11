import http from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { POST as postDraft, OPTIONS as optionsDraft } from '../app/api/agreements/draft+api.ts';
import { POST as postPdf, OPTIONS as optionsPdf } from '../app/api/agreements/pdf+api.ts';

function loadEnvFile() {
  if (!existsSync('.env')) {
    return;
  }

  const envLines = readFileSync('.env', 'utf8').split(/\r?\n/);

  for (const line of envLines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#') || !trimmedLine.includes('=')) {
      continue;
    }

    const [key, ...valueParts] = trimmedLine.split('=');

    if (!process.env[key]) {
      process.env[key] = valueParts.join('=');
    }
  }
}

loadEnvFile();

const port = Number.parseInt(process.env.AGREEMENT_API_PORT ?? '8102', 10);

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    request.on('data', (chunk) => chunks.push(chunk));
    request.on('error', reject);
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

async function sendResponse(nodeResponse, webResponse) {
  nodeResponse.writeHead(webResponse.status, Object.fromEntries(webResponse.headers.entries()));
  nodeResponse.end(Buffer.from(await webResponse.arrayBuffer()));
}

async function handleRequest(nodeRequest, nodeResponse) {
  const requestUrl = new URL(nodeRequest.url ?? '/', `http://${nodeRequest.headers.host ?? `localhost:${port}`}`);
  const body = nodeRequest.method === 'POST' ? await readBody(nodeRequest) : undefined;
  const request = new Request(requestUrl, {
    method: nodeRequest.method,
    headers: nodeRequest.headers,
    body,
  });

  if (requestUrl.pathname === '/api/agreements/draft') {
    if (nodeRequest.method === 'OPTIONS') {
      await sendResponse(nodeResponse, optionsDraft());
      return;
    }

    if (nodeRequest.method === 'POST') {
      await sendResponse(nodeResponse, await postDraft(request));
      return;
    }
  }

  if (requestUrl.pathname === '/api/agreements/pdf') {
    if (nodeRequest.method === 'OPTIONS') {
      await sendResponse(nodeResponse, optionsPdf());
      return;
    }

    if (nodeRequest.method === 'POST') {
      await sendResponse(nodeResponse, await postPdf(request));
      return;
    }
  }

  nodeResponse.writeHead(404, { 'Content-Type': 'application/json' });
  nodeResponse.end(JSON.stringify({ error: 'Not found' }));
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error('Agreement API server error:', error);
    response.writeHead(500, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Internal server error' }));
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Agreement API server running at http://0.0.0.0:${port}`);
});
