export async function onRequest(context) {
  const { request } = context;

  const url = new URL(request.url);
  const targetUrl = `https://app.factory.ai${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set('Host', 'app.factory.ai');

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: headers,
  });

  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  
  return newResponse;
}
