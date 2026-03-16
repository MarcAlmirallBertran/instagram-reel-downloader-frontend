export async function registerAuthSW() {
  if (!('serviceWorker' in navigator)) return

  const registration = await navigator.serviceWorker.register('/auth-sw.js')
  await navigator.serviceWorker.ready

  if (!navigator.serviceWorker.controller) {
    await new Promise((resolve) => {
      navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true })
    })
  }

  return registration
}

export function updateSWToken(token) {
  navigator.serviceWorker?.controller?.postMessage({
    type: 'SET_TOKEN',
    token,
  })
}
