import creator from './creator';
import type { Mermaid } from 'mermaid';

const isServer = typeof window === 'undefined';
if (!isServer && !window.mermaid) {
  console.error('Please import resources mermaid from cdn');
}

export default creator(!isServer ? (window.mermaid as unknown as Mermaid) : undefined);
