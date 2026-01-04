import { rooms } from "./_store.js";

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const code = (url.searchParams.get("roomCode") || "").trim().toUpperCase();

  if (!code) return Response.json({ ok: false, error: "roomCode required" }, { status: 400 });

  const room = rooms.get(code);
  if (!room) return Response.json({ ok: false, error: "Room not found" }, { status: 404 });

  return Response.json({
    ok: true,
    roomCode: room.code,
    players: room.players.map(p => ({ id: p.id, name: p.name })),
    hostId: room.hostId,
  });
}
