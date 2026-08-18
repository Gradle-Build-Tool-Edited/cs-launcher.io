/**
 * CS Launcher - Cloudflare Worker
 * Static site + stable download routes.
 */

const DOWNLOADS = {
  v1: {
    main: 'https://github.com/Mineradi/CS-LAUNCHER/releases/download/v.1.0.0/CSLauncher.apk',
    mirror1: 'https://github.com/Mineradi/CS-LAUNCHER/releases/download/v.1.0.0/CSLauncher.apk',
    mirror2: 'https://github.com/Mineradi/CS-LAUNCHER/releases/download/v.1.0.0/CSLauncher.apk'
  },
  v2: {
    main: 'https://github.com/craftstudioteam/CS-LAUNCHER-v2/releases/download/v2.10/CS-LAUNCHER-V2.apk',
    mirror1: 'https://github.com/craftstudioteam/CS-LAUNCHER-v2/releases/download/v2.10/CS-LAUNCHER-V2.apk'
  },
  v3: {
    main: 'https://github.com/craftstudioteam/CS-LAUNCHER-v3/releases/download/v3/CS-LAUNCHER-V3.apk',
    mirror1: 'https://github.com/craftstudioteam/CS-LAUNCHER-v3/releases/download/v3/CS-LAUNCHER-V3.apk'
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store'
    }
  });
}

function downloadRoute(url) {
  const parts = url.pathname.split('/').filter(Boolean);
  // /api/download/:version/:mirror
  const version = parts[2];
  const mirror = parts[3];
  const target = DOWNLOADS[version]?.[mirror];
  if (!target) return json({ ok: false, error: 'Download not found' }, 404);

  return Response.redirect(target, 302);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({ ok: true, service: 'CS Launcher', time: new Date().toISOString() });
    }

    if (url.pathname.startsWith('/api/download/')) {
      return downloadRoute(url);
    }

    // Let Cloudflare Assets serve index.html, CSS, JS, launcher pages, etc.
    return env.ASSETS.fetch(request);
  }
};
