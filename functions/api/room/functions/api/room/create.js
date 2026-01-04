import { rooms, makeCode, makeId } from "./_store.js";

export async function onRequestPost({ request }) {
  const { name } = await request.json().catch(() => ({}));

  const cleanName = String(name || "").trim().slice(0, 20);
  if (!cleanName) {
    return Response.json({ ok: false, error: "Name required" }, { status: 400 });
  }

  // Create unique room code
  let code = makeCode(4);
  for (let i = 0; i < 10 && rooms.has(code); i++) code = makeCode(4);

  const playerId = makeId();
  const room = {
    code,
    createdAt: Date.now(),
    hostId: playerId,
    players: [{ id: playerId, name: cleanName, joinedAt: Date.now() }],
  };

  rooms.set(code, room);

  return Response.json({
    ok: true,
    roomCode: code,
    playerId,
    host: true,
  });
}
