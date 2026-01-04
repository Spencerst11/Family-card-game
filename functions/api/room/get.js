export async function onRequestGet({ env, request }) {
  const stub = env.ROOM_MANAGER.get(
    env.ROOM_MANAGER.idFromName("global")
  );

  return stub.fetch(request.url);
}
