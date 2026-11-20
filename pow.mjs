import {createHash} from 'node:crypto';

// The venue's challenge is SHA-256("<challenge>:<decimal nonce>").
// A valid digest starts with the required number of zero bits.
export function solveProof(challenge, bits, maxAttempts = 20_000_000) {
  if (typeof challenge !== 'string' || !Number.isInteger(bits) || bits < 1 || bits > 26) {
    throw new Error('Unsupported proof-of-work challenge');
  }
  for (let nonce = 0; nonce < maxAttempts; nonce++) {
    const digest = createHash('sha256').update(`${challenge}:${nonce}`).digest();
    let valid = true;
    for (let bit = 0; bit < bits; bit++) {
      if (digest[bit >> 3] & (0x80 >> (bit & 7))) { valid = false; break; }
    }
    if (valid) return String(nonce);
  }
  throw new Error('Proof-of-work exceeded its bounded search; retry later');
}
