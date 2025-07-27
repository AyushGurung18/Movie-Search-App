export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const key = url.pathname.replace(/^\/+/, ''); // remove leading slashes

    try {
      const object = await env.MY_BUCKET.get(key);
      if (!object) {
        return new Response('File not found', { status: 404 });
      }

      const headers = new Headers();
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Content-Type', getMimeType(key));

      return new Response(object.body, { headers });
    } catch (err) {
      return new Response('Internal error: ' + err.message, { status: 500 });
    }
  },
};

function getMimeType(key) {
  if (key.endsWith('.m3u8')) return 'application/vnd.apple.mpegurl';
  if (key.endsWith('.ts')) return 'video/mp2t';
  return 'application/octet-stream';
}
