import type { CSSProperties } from "react";
import { defaultDesignSettings, designPresets, type DesignSettings } from "@/lib/settings/design-presets";
import { safeApiFetch } from "./api-client";

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

export async function getThemeSettings() {
  const settings = await safeApiFetch<Partial<DesignSettings>>("azadi/v1/theme-settings", defaultDesignSettings);
  return mergeThemeSettings(settings);
}

export async function getLandingPageSettings(locale: "fa" | "en" = "fa") {
  return safeApiFetch<LandingPageSettings>("azadi/v1/landing-settings", {}, { params: { locale } });
}

export const getLandingSettings = getLandingPageSettings;

export async function getFontSettings() {
  return safeApiFetch<FontSettings>("azadi/v1/font-settings", defaultDesignSettings.typography);
}

export async function getDesignPresets() {
  return safeApiFetch("azadi/v1/design-presets", designPresets);
}

export async function getHeaderSettings(locale: "fa" | "en" = "fa") {
  return safeApiFetch<HeaderFooterSettings>("azadi/v1/header-settings", {}, { params: { locale } });
}

export async function getFooterSettings(locale: "fa" | "en" = "fa") {
  return safeApiFetch<HeaderFooterSettings>("azadi/v1/footer-settings", {}, { params: { locale } });
}

export async function getComponentSettings() {
  return safeApiFetch<Record<string, unknown>>("azadi/v1/component-settings", {});
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
