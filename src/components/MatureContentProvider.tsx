"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "plushbroker-mature-content";
const VERIFIED_KEY = "plushbroker-mature-verified";

function isAgeVerified(): boolean {
  return window.localStorage.getItem(VERIFIED_KEY) === "true";
}

type MatureContentContextValue = {
  matureEnabled: boolean;
  confirmOpen: boolean;
  requestEnable: () => void;
  disable: () => void;
  confirmEnable: () => void;
  cancelEnable: () => void;
};

const MatureContentContext = createContext<MatureContentContextValue | null>(null);

export function useMatureContent(): MatureContentContextValue {
  const value = useContext(MatureContentContext);
  if (!value) {
    throw new Error("useMatureContent must be used within MatureContentProvider");
  }
  return value;
}

export function MatureContentProvider({ children }: { children: ReactNode }) {
  const [matureEnabled, setMatureEnabled] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMatureEnabled(window.localStorage.getItem(STORAGE_KEY) === "true");
    setHydrated(true);
  }, []);

  const persist = useCallback((enabled: boolean) => {
    setMatureEnabled(enabled);
    window.localStorage.setItem(STORAGE_KEY, String(enabled));
  }, []);

  const requestEnable = useCallback(() => {
    if (isAgeVerified()) {
      persist(true);
      return;
    }
    setConfirmOpen(true);
  }, [persist]);

  const disable = useCallback(() => {
    persist(false);
  }, [persist]);

  const confirmEnable = useCallback(() => {
    window.localStorage.setItem(VERIFIED_KEY, "true");
    persist(true);
    setConfirmOpen(false);
  }, [persist]);

  const cancelEnable = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  return (
    <MatureContentContext.Provider
      value={{
        matureEnabled: hydrated ? matureEnabled : false,
        confirmOpen,
        requestEnable,
        disable,
        confirmEnable,
        cancelEnable,
      }}
    >
      {children}
      {confirmOpen && <MatureConfirmDialog onConfirm={confirmEnable} onCancel={cancelEnable} />}
    </MatureContentContext.Provider>
  );
}

type DialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

function MatureConfirmDialog({ onConfirm, onCancel }: DialogProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mature-confirm-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Close"
      />

      <div className="glass relative z-10 w-full max-w-sm rounded-2xl p-6 shadow-2xl shadow-black/40">
        <h2 id="mature-confirm-title" className="text-lg font-semibold">
          Mature content
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          Are you 18 or older? Turning this on will reveal mature content such as tags and descriptions.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-text-muted transition-colors hover:bg-surface-overlay hover:text-text"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-accent-hover"
          >
            I&apos;m 18 or older
          </button>
        </div>
      </div>
    </div>
  );
}
