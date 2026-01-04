export async function onRequestPost({ env, request }) {
  const stub = env.ROOM_MANAGER.get(
    env.ROOM_MANAGER.idFromName("global")
  );

  return stub.fetch("https://room-manager/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text()
  });
}
