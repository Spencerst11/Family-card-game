// Simple password gate for the whole site.
// Change FAMILY_PASSWORD to your chosen password.

const FAMILY_PASSWORD = "5Crown";

function html(title, body) {
  return new Response(
    `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
  <style>
    body{font-family:system-ui,sans-serif;background:#0f172a;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}
    .box{background:#020617;padding:24px;border-radius:12px;width:360px}
    input,button{width:100%;padding:10px;border-radius:8px;border:none;margin-top:12px}
    button{background:#22c55e;color:#000;font-weight:700;cursor:pointer}
    .muted{opacity:.8;font-size:14px;margin-top:10px}
  </style>
</head>
<body>
  <div class="box">
    <h2>${title}</h2>
    ${body}
  </div>
</body>
</html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

// ALWAYS allow API routes to bypass auth
if (url.pathname.startsWith("/api/")) {
  return context.next();
}

// Allow login page itself
if (url.pathname === "/login") {
  return context.next();
}


  
  const cookie = context.request.headers.get("Cookie") || "";
  const authed = cookie.includes("fcg_auth=1");

  if (authed) return context.next();

  // Handle password submit
  if (url.pathname === "/auth" && context.request.method === "POST") {
    const form = await context.request.formData();
    const pw = String(form.get("password") || "");

    if (pw === FAMILY_PASSWORD) {
      // Set a simple auth cookie for 7 days
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": "fcg_auth=1; Path=/; Max-Age=604800; Secure; SameSite=Lax"
        }
      });
    }

    return html("Private Card Game", `
      <form method="POST" action="/auth">
        <input type="password" name="password" placeholder="Password" autofocus />
        <button type="submit">Enter</button>
        <div class="muted">Wrong password — try again.</div>
      </form>
    `);
  }

  // Show login page
  return html("Private Card Game", `
    <form method="POST" action="/auth">
      <input type="password" name="password" placeholder="Password" autofocus />
      <button type="submit">Enter</button>
      <div class="muted">Family-only access.</div>
    </form>
  `);
}
