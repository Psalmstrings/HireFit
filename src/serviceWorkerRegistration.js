// Service Worker registration helper for HireFit PWA

export function register(config = {}) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          // Check for updates periodically (e.g. every hour)
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available; notify app
                  console.log('[PWA] New content is available; update ready.');
                  window.dispatchEvent(
                    new CustomEvent('swUpdateAvailable', {
                      detail: { waitingWorker: registration.waiting }
                    })
                  );
                  if (config && config.onUpdate) {
                    config.onUpdate(registration);
                  }
                } else {
                  // Content is cached for offline use
                  console.log('[PWA] Content is cached for offline use.');
                  if (config && config.onSuccess) {
                    config.onSuccess(registration);
                  }
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('[PWA] Error during service worker registration:', error);
          if (config && config.onError) {
            config.onError(error);
          }
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
