# CS Launcher - Cloudflare Workers

## Deploy

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

The Worker serves the site from the project root and handles downloads through:

- `/api/download/v1/main`
- `/api/download/v1/mirror1`
- `/api/download/v2/main`
- `/api/download/v2/mirror1`
- `/api/download/v3/main`
- `/api/download/v3/mirror1`

Health check:

`/api/health`

To change an APK URL, edit `DOWNLOADS` in `worker.js`. The public website does not need its HTML links changed again.
