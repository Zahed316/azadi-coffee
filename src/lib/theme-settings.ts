import type { CSSProperties } from "react";
import { defaultDesignSettings, designPresets, type DesignSettings } from "@/lib/settings/design-presets";

export type FontSettings = DesignSettings["typography"] & {
  persianFont?: string;
  englishFont?: string;
  uploadedFonts?: Array<{ name: string; url: string; format: "woff2" | "woff" | "truetype" }>;
};

export type LandingPageSettings = {
  heroTitle?: string;
  heroText?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
};

export type HeaderFooterSettings = {
  brand?: string;
  description?: string;
  navigation?: Array<{ label: string; href: string }>;
  contact?: {
    address?: string;
    phone?: string;
    hours?: string;
  };
};

function mergeThemeSettings(value: Partial<DesignSettings> | null | undefined): DesignSettings {
  if (!value) {
    return defaultDesignSettings;
  }

  return {
    ...defaultDesignSettings,
    ...value,
    colors: { ...defaultDesignSettings.colors, ...value.colors },
    typography: { ...defaultDesignSettings.typography, ...value.typography },
    shape: { ...defaultDesignSettings.shape, ...value.shape },
    styles: { ...defaultDesignSettings.styles, ...value.styles },
  };
}

export function getThemeSettings() {
  return defaultDesignSettings;
}

export function getLandingSettings(_locale: "fa" | "en" = "fa"): LandingPageSettings {
  return {};
}

export function getFontSettings() {
  return defaultDesignSettings.typography;
}

export function getDesignPresets() {
  return designPresets;
}

export function themeSettingsToCssVariables(settings: DesignSettings): CSSProperties {
  const vars: Record<string, string | number> = {};

  Object.entries(settings.colors).forEach(([key, value]) => {
    vars[`--${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`] = value;
  });

  Object.entries(settings.shape).forEach(([key, value]) => {
    const suffix = key.includes("Radius") || key === "radius" ? "px" : "";
    vars[`--${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`] = `${value}${suffix}`;
  });

  vars["--site-font-family"] = settings.typography.customFontName
    ? `"${settings.typography.customFontName}", ${settings.typography.fontFamily}`
    : settings.typography.fontFamily;
  vars["--site-font-family-fa"] = settings.typography.persianFont
    ? `"${settings.typography.persianFont}", ${vars["--site-font-family"]}`
    : vars["--site-font-family"];
  vars["--site-font-family-en"] = settings.typography.englishFont
    ? `"${settings.typography.englishFont}", ${vars["--site-font-family"]}`
    : vars["--site-font-family"];
  vars["--shadow-card"] = `0 ${Math.round(settings.shape.shadowIntensity / 3)}px ${settings.shape.shadowIntensity}px rgba(0, 0, 0, ${Math.min(settings.shape.shadowIntensity / 180, 0.24)})`;
  vars["--spacing-scale"] = String(settings.shape.spacingScale);

  return vars as CSSProperties;
}
