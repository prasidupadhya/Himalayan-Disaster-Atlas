import { decodeDataset } from './decode-dataset';

self.onmessage = async (event: MessageEvent<{ metadata: unknown; bytes?: ArrayBuffer; compressed: boolean }>) => {
  try { self.postMessage({ data: await decodeDataset(event.data.metadata, event.data.bytes, event.data.compressed) }); }
  catch (error) { self.postMessage({ error: error instanceof Error ? error.message : 'Dataset validation failed' }); }
};
