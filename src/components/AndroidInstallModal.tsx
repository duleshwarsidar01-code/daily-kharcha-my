import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  X,
  Smartphone,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    }
  };

  // Direct link to PWABuilder with current URL encoded
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Install Kharach on Android / Mobile
              </h2>
              <p className="text-xs text-slate-500">
                Direct Android APK & Home Screen Installation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Option 1: Direct 1-Click Install Button (if browser prompt available) */}
          {isInstallable && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Instant App Install Ready
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Click to install Kharach directly onto your device launcher
                  </p>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App</span>
                </button>
              </div>
            </div>
          )}

          {/* Option 2: Step-by-Step Android Chrome Guide (Creates native WebAPK) */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Android Phone me Install Karne Ka Tarika (WebAPK)
              </h3>
            </div>

            <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-decimal list-inside pl-1">
              <li>
                Apne mobile ke <strong>Google Chrome</strong> browser me ye app kholein.
              </li>
              <li>
                Chrome ke upar daayein kone me <strong>3 dots (⋮)</strong> menu par tap karein.
              </li>
              <li>
                Menu me <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> par click karein.
              </li>
              <li>
                Android automatic iska <strong>Native APK</strong> bana kar aapke mobile ki Home Screen par app icon add kar dega!
              </li>
            </ol>

            {/* Share / Copy App Link */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                App URL (Mobile me kholne ke liye copy karein):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Option 3: Download Standalone .APK File via PWABuilder / Bubblewrap */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Generate Direct .APK Package (PWABuilder / Google Bubblewrap)
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Agar aapko distribution ke liye raw <code>.apk</code> ya <code>.aab</code> file chahiye (Play Store ya side-loading ke liye), Microsoft PWABuilder hamare manifest aur icons ko use karke turant compiled APK generate kar deta hai:
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <span>Download APK via PWABuilder</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <span className="text-[11px] text-slate-400 text-center sm:text-left">
                Free, 100% official Microsoft & Google PWA tool
              </span>
            </div>
          </div>

          {/* Features badge */}
          <div className="flex items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Offline-First</span>
            </div>
            <span>·</span>
            <div>Zero Storage Weight (&lt; 2MB)</div>
            <span>·</span>
            <div>Fast Realtime Tracking</div>
          </div>
        </div>
      </div>
    </div>
  );
};
