/**
 * Smart fetch utility that routes requests through a scraping proxy (e.g. ScrapingBee)
 * if an API key is available in environment variables. Otherwise, falls back to regular fetch.
 * This helps bypass bot block CDNs (Akamai, Cloudflare) on telecom sites for Stage 2.
 */
export async function smartFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const scrapingBeeKey = process.env.SCRAPINGBEE_API_KEY;
  
  if (scrapingBeeKey) {
    console.log(`[ProxyFetcher] Routing request through ScrapingBee for: ${url}`);
    
    // Construct ScrapingBee proxy URL
    // We disable javascript rendering by default to keep it fast, but you can toggle it
    const proxyUrl = `https://app.scrapingbee.com/api/v1/?api_key=${scrapingBeeKey}&url=${encodeURIComponent(url)}&render_js=false`;
    
    // Forward the fetch request to the proxy.
    // Note: ScrapingBee manages most headers internally; we forward Accept if the
    // caller set one. Use the Headers API so any HeadersInit shape (object/array/
    // Headers) is handled correctly instead of unsafe index access.
    const incoming = new Headers(options.headers);
    return fetch(proxyUrl, {
      method: options.method || 'GET',
      headers: {
        Accept: incoming.get('Accept') ?? 'text/html',
      },
    });
  }

  // Fallback to regular fetch (Stage 1 / local development)
  // Ensure we set a realistic user agent to avoid basic blocks
  const headers = new Headers(options.headers);
  if (!headers.has('User-Agent')) {
    headers.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  }

  return fetch(url, {
    ...options,
    headers
  });
}
