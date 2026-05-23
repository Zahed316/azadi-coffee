"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { defaultDesignSettings, type DesignSettings } from "@/lib/settings/design-presets";
import {
  applyDesignSettings,
  persistDesignSettings,
  readStoredDesignSettings,
  subscribeDesignSettings,
} from "@/lib/settings/design-storage";

type DesignSettingsContextValue = {
  settings: DesignSettings;
  setSettings: (settings: DesignSettings) => void;
};

const DesignSettingsContext = createContext<DesignSettingsContextValue | null>(null);

export function DesignSettingsProvider({
  children,
  initialSettings = defaultDesignSettings,
}: {
  children: ReactNode;
  initialSettings?: DesignSettings;
}) {
  const settings = useSyncExternalStore(
    subscribeDesignSettings,
    () => readStoredDesignSettings(initialSettings),
    () => initialSettings,
  );

  useEffect(() => {
    applyDesignSettings(settings);
  }, [settings]);

  const setSettings = useCallback((nextSettings: DesignSettings) => {
    persistDesignSettings(nextSettings);
    applyDesignSettings(nextSettings);
  }, []);

  const value = useMemo(() => ({ settings, setSettings }), [settings, setSettings]);

  return <DesignSettingsContext.Provider value={value}>{children}</DesignSettingsContext.Provider>;
}

export function useDesignSettings() {
  const context = useContext(DesignSettingsContext);
  if (!context) {
    throw new Error("useDesignSettings must be used inside DesignSettingsProvider");
  }

  return context;
}

