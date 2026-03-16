self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SET_TOKEN') {
    event.waitUntil(
      caches.open('auth').then((cache) =>
        event.data.token
          ? cache.put('/_token', new Response(event.data.token))
          : cache.delete('/_token')
      )
    )
  }
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Only intercept API media requests
  if (!url.pathname.match(/^\/api\/tasks\/[^/]+\/(video|audio)$/)) {
    return
  }
  
  event.respondWith(
    caches.open('auth')
      .then((cache) => cache.match('/_token'))
      .then((response) => response?.text())
      .then((token) => {
        if (!token) return fetch(event.request)
        
        return fetch(new Request(event.request.url, {
          method: event.request.method,
          headers: {
            ...Object.fromEntries(event.request.headers),
            Authorization: `Bearer ${token}`,
          },
        }))
      })
  )
})
