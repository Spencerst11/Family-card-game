// Simple in-memory room store.
// NOTE: This is good for early testing. We'll upgrade to Durable Objects later
// so rooms never reset and can support realtime gameplay cleanly.

globalThis.__FCG__ = globalThis.__FCG__ || { rooms: new Map() };

export const rooms = globalThis.__FCG__.rooms;

export function makeCode(len = 4) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export function makeId() {
  return (crypto.randomUUID && crypto.randomUUID()) || (Date.now().toString(36) + Math.random().toString(36).slice(2));
}
