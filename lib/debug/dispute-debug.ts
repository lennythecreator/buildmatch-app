interface DisputeDebugPayload {
  [key: string]: unknown;
}

function shouldLogDisputeDebug() {
  return typeof __DEV__ !== 'undefined' && __DEV__;
}

export function logDisputeDebug(label: string, payload: DisputeDebugPayload) {
  if (!shouldLogDisputeDebug()) {
    return;
  }

  console.log(`[dispute-debug] ${label}`, payload);
}
