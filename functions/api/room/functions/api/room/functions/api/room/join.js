import { rooms, makeId } from "./_store.js";

export async function onRequestPost({ request }) {
  const { name, roomCode } = await request.json().catch(() => ({}));

  const cleanName = String(name || "").trim().slice(0, 20);
  const code = String(roomCode || "").trim().toUpperCase();

  if (!cleanName) return Response.json({ ok: false, error: "Name required" }, { status: 400 });
  if (!code) return Response.json({ ok: false, error: "Room code required" }, { status: 400 });

  const room = rooms.get(code);
  if (!room) return Response.json({ ok: false, error: "Room not found" }, { status: 404 });

  if (room.players.length >= 7) {
    return Response.json({ ok: false, error: "Room is full (7 max)" }, { status: 400 });
  }

  const playerId = makeId();
  room.players.push({ id: playerId, name: cleanName, joinedAt: Date.now() });

  return Response.json({
    ok: true,
    roomCode: code,
    playerId,
    host: room.hostId === playerId,
    players: room.players.map(p => ({ id: p.id, name: p.name })),
  });
}
