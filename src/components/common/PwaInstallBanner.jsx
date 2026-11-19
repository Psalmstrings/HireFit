import React, { useState, useEffect } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { Download, RefreshCw, WifiOff, X, Share } from 'lucide-react';

const PwaInstallBanner = () => {
  const {
    isInstallable,
    isInstalled,
    isOffline,
    isUpdateAvailable,
    isIOS,
    promptInstall,
    applyUpdate
  } = usePWA();

  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const dismissedUntil = localStorage.getItem('hirefit_pwa_dismissed');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShowIOSGuide(false);
    // Dismiss for 7 days
    localStorage.setItem('hirefit_pwa_dismissed', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await promptInstall();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {/* 1. Offline Mode Alert */}
      {isOffline && (
        <div className="pwa-offline-alert" role="status" aria-live="polite">
          <div className="pwa-offline-content">
            <WifiOff size={16} />
            <span>You are currently offline. Viewing cached data.</span>
          </div>
        </div>
      )}

      {/* 2. New Version Available Alert */}
      {isUpdateAvailable && (
        <aside className="pwa-update-bar" aria-label="Application update available">
          <div className="pwa-update-content">
            <RefreshCw size={16} className="spin-icon" />
            <span>A new version of HireFit is available!</span>
            <button
              type="button"
              className="pwa-update-btn"
              onClick={applyUpdate}
            >
              Update Now
            </button>
          </div>
        </aside>
      )}

      {/* 3. Install App Prompt Banner */}
      {!isInstalled && !dismissed && (isInstallable || (isIOS && !window.navigator.standalone)) && (
        <aside className="pwa-install-banner" aria-label="Install HireFit App">
          <div className="pwa-banner-left">
            <img src="/pwa-192x192.png" alt="HireFit App" className="pwa-banner-icon" />
            <div className="pwa-banner-text">
              <h4 className="pwa-banner-title">Install HireFit App</h4>
              <p className="pwa-banner-desc">Fast access, offline CV viewing & native app experience</p>
            </div>
          </div>

          <div className="pwa-banner-actions">
            <button
              type="button"
              className="pwa-btn-install"
              onClick={handleInstallClick}
            >
              <Download size={15} />
              <span>Install App</span>
            </button>
            <button
              type="button"
              className="pwa-btn-dismiss"
              onClick={handleDismiss}
              aria-label="Dismiss install banner"
            >
              <X size={16} />
            </button>
          </div>
        </aside>
      )}

      {/* 4. iOS Safari Add to Home Screen Instructions Modal */}
      {showIOSGuide && (
        <div className="pwa-ios-modal-overlay" onClick={() => setShowIOSGuide(false)}>
          <div className="pwa-ios-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pwa-ios-header">
              <img src="/pwa-192x192.png" alt="HireFit" className="pwa-ios-logo" />
              <div>
                <h3>Install on iPhone & iPad</h3>
                <p>Add HireFit to your Home Screen in 2 steps</p>
              </div>
              <button
                type="button"
                className="pwa-ios-close"
                onClick={() => setShowIOSGuide(false)}
              >
                <X size={18} />
              </button>
            </div>

            <ol className="pwa-ios-steps">
              <li>
                <span>1</span>
                <div>Tap the <strong>Share</strong> button <Share size={15} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> in Safari's toolbar.</div>
              </li>
              <li>
                <span>2</span>
                <div>Scroll down and select <strong>"Add to Home Screen"</strong>.</div>
              </li>
            </ol>

            <button
              type="button"
              className="pwa-btn-install"
              style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
              onClick={() => setShowIOSGuide(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallBanner;
