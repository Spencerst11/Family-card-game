const FAMILY_PASSWORD = "5Crown";

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // ALWAYS allow API routes
  if (url.pathname.startsWith("/api/")) {
    return context.next();
  }

  // Allow auth endpoints
  if (url.pathname === "/auth" || url.pathname === "/login") {
    return context.next();
  }

  const cookie = context.request.headers.get("Cookie") || "";
  if (cookie.includes("fcg_auth=1")) {
    return context.next();
  }

  return new Response(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Private Card Game</title>
</head>
<body>
  <form method="POST" action="/auth">
    <input type="password" name="password" autofocus />
    <button type="submit">Enter</button>
  </form>
</body>
</html>`, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}
