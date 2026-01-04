export async function onRequestPost({ env, request }) {
  const stub = env.ROOM_MANAGER.get(
    env.ROOM_MANAGER.idFromName("global")
  );

  return stub.fetch("https://room/create", {
    method: "POST",
    body: await request.text()
  });
}
