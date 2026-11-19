import { useState, useEffect } from 'react';

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    // 1. Check if already running in standalone mode (installed)
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      setIsInstalled(isStandalone);
    };

    checkInstalled();
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkInstalled);

    // 2. Listen for beforeinstallprompt event (Chromium browsers)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[PWA] HireFit successfully installed!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 4. Online / Offline listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 5. Service Worker update event
    const handleServiceWorkerUpdate = (event) => {
      if (event.detail && event.detail.waitingWorker) {
        setWaitingWorker(event.detail.waitingWorker);
        setIsUpdateAvailable(true);
      }
    };
    window.addEventListener('swUpdateAvailable', handleServiceWorkerUpdate);

    return () => {
      mediaQuery.removeEventListener('change', checkInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('swUpdateAvailable', handleServiceWorkerUpdate);
    };
  }, []);

  // Method to prompt user to install
  const promptInstall = async () => {
    if (!deferredPrompt) {
      return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
    return outcome === 'accepted';
  };

  // Method to reload and apply new Service Worker update
  const applyUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  // Check iOS device
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  return {
    isInstallable,
    isInstalled,
    isOffline,
    isUpdateAvailable,
    isIOS,
    promptInstall,
    applyUpdate
  };
}
