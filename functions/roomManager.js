export class RoomManager {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    const data = request.method === "POST"
      ? await request.json().catch(() => ({}))
      : {};

    const rooms = (await this.state.storage.get("rooms")) || {};

    // CREATE ROOM
    if (path === "/create") {
      const name = String(data.name || "").trim();
      if (!name) return Response.json({ ok: false, error: "Name required" }, { status: 400 });

      const code = this.makeCode();
      rooms[code] = {
        code,
        players: [{ id: crypto.randomUUID(), name }]
      };

      await this.state.storage.put("rooms", rooms);

      return Response.json({
        ok: true,
        roomCode: code,
        playerId: rooms[code].players[0].id
      });
    }

    // JOIN ROOM
    if (path === "/join") {
      const code = String(data.roomCode || "").toUpperCase();
      const name = String(data.name || "").trim();
      if (!rooms[code]) return Response.json({ ok: false, error: "Room not found" }, { status: 404 });

      if (rooms[code].players.length >= 7)
        return Response.json({ ok: false, error: "Room full" }, { status: 400 });

      const playerId = crypto.randomUUID();
      rooms[code].players.push({ id: playerId, name });
      await this.state.storage.put("rooms", rooms);

      return Response.json({
        ok: true,
        roomCode: code,
        playerId
      });
    }

    // GET ROOM
    if (path === "/get") {
      const code = url.searchParams.get("roomCode");
      if (!rooms[code]) return Response.json({ ok: false, error: "Room not found" }, { status: 404 });

      return Response.json({
        ok: true,
        roomCode: code,
        players: rooms[code].players
      });
    }

    return new Response("Not found", { status: 404 });
  }

  makeCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }
}
