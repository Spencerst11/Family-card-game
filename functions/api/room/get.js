export async function onRequestGet({ env, request }) {
  const stub = env.ROOM_MANAGER.get(
    env.ROOM_MANAGER.idFromName("global")
  );

  const url = new URL(request.url);
  return stub.fetch(`https://room-manager/get${url.search}`);
}
