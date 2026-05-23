"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { defaultDesignSettings, designPresets, type DesignSettings } from "@/lib/settings/design-presets";
import { resetCustomFont, updateDesignSetting } from "@/lib/settings/design-storage";
import { useDesignSettings } from "./DesignSettingsProvider";

const fontOptions = [
  { label: "Vazirmatn / Inter", value: "\"Vazirmatn\", \"IRANSansX\", \"Inter\", system-ui, sans-serif" },
  { label: "System sans", value: "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif" },
  { label: "Editorial serif", value: "\"Iowan Old Style\", Georgia, \"Times New Roman\", serif" },
  { label: "Modern grotesk", value: "\"Helvetica Neue\", Helvetica, Arial, sans-serif" },
  { label: "Mono utility", value: "\"SF Mono\", ui-monospace, \"JetBrains Mono\", monospace" },
];

const styleOptions = {
  header: ["minimal", "bordered", "floating"],
  footer: ["dark", "light", "bordered"],
  landing: ["stacked", "gallery", "editorial"],
  productCard: ["bordered", "soft", "commercial"],
  blogCard: ["line", "card", "editorial"],
  button: ["square", "soft", "pill"],
} as const;

const colorLabels: Record<keyof DesignSettings["colors"], string> = {
  ink: "Main text / ink",
  paper: "Main background",
  warmPaper: "Secondary background",
  graphite: "Dark surface",
  stone: "Muted text",
  coffee: "Coffee accent",
  line: "Borders",
  success: "Success",
  danger: "Danger",
  tabBackground: "Tab background",
  tabText: "Tab text",
  tabHoverBackground: "Tab hover background",
  tabHoverText: "Tab hover text",
  buttonPrimaryBackground: "Primary button background",
  buttonPrimaryText: "Primary button text",
  buttonSecondaryBackground: "Secondary button background",
  buttonSecondaryText: "Secondary button text",
};

const shapeControls: Array<{ key: keyof DesignSettings["shape"]; label: string; min: number; max: number; step: number }> = [
  { key: "radius", label: "Global radius", min: 0, max: 32, step: 1 },
  { key: "cardRadius", label: "Card radius", min: 0, max: 36, step: 1 },
  { key: "buttonRadius", label: "Button radius", min: 0, max: 999, step: 1 },
  { key: "tabRadius", label: "Tab radius", min: 0, max: 24, step: 1 },
  { key: "shadowIntensity", label: "Shadow intensity", min: 0, max: 48, step: 1 },
  { key: "spacingScale", label: "Spacing scale", min: 0.85, max: 1.25, step: 0.01 },
];

const fileFormats: Record<string, DesignSettings["typography"]["customFontFormat"]> = {
  woff2: "woff2",
  woff: "woff",
  ttf: "truetype",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-ink bg-paper p-5">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

export function DesignDashboard() {
  const { settings, setSettings } = useDesignSettings();
  const [fontError, setFontError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPreset = useMemo(
    () => designPresets.find((preset) => preset.id === settings.presetId)?.name ?? "Custom",
    [settings.presetId],
  );

  const setColor = (key: keyof DesignSettings["colors"], value: string) => {
    setSettings(updateDesignSetting(settings, "colors", key, value));
  };

  const setShape = (key: keyof DesignSettings["shape"], value: string) => {
    setSettings(updateDesignSetting(settings, "shape", key, Number(value)));
  };

  const setStyle = <T extends keyof DesignSettings["styles"]>(key: T, value: DesignSettings["styles"][T]) => {
    setSettings(updateDesignSetting(settings, "styles", key, value));
  };

  const setFontFamily = (value: string) => {
    setSettings({
      ...settings,
      typography: {
        ...settings.typography,
        fontFamily: value,
      },
    });
  };

  const handleFontUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFontError("");

    if (!file) {
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const format = fileFormats[extension];
    const allowedMime = ["font/woff2", "font/woff", "font/ttf", "application/font-woff", "application/x-font-ttf", ""];

    if (!format || !allowedMime.includes(file.type)) {
      setFontError("Upload a valid .woff2, .woff, or .ttf font file.");
      event.target.value = "";
      return;
    }

    if (file.size > 800_000) {
      setFontError("Keep custom fonts under 800 KB for now so local settings remain fast.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const name = file.name.replace(/\.(woff2|woff|ttf)$/i, "").replace(/[^a-zA-Z0-9_-]/g, "-");
      setSettings({
        ...settings,
        typography: {
          ...settings.typography,
          customFontName: name,
          customFontDataUrl: String(reader.result),
          customFontFormat: format,
        },
      });
    };
    reader.onerror = () => setFontError("The font file could not be read.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-warm-paper text-ink" dir="ltr" lang="en">
      <header className="border-b border-ink bg-paper">
        <div className="container-shell flex flex-col gap-4 py-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-stone">Azadi Coffee</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Design settings</h1>
            <p className="mt-3 max-w-2xl text-stone">
              Apply a preset, then tune colours, typography, spacing, tabs, cards, header, footer, and button behavior. Settings are stored locally and applied across Persian and English routes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="button-secondary inline-flex min-h-10 items-center border px-4 py-2 text-sm font-bold" href="/">
              Persian site
            </Link>
            <Link className="button-secondary inline-flex min-h-10 items-center border px-4 py-2 text-sm font-bold" href="/en">
              English site
            </Link>
            <button className="button-primary min-h-10 border px-4 py-2 text-sm font-bold" type="button" onClick={() => setSettings(defaultDesignSettings)}>
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="container-shell grid gap-6 py-8 lg:grid-cols-[320px_1fr]">
        <aside className="grid gap-4 self-start lg:sticky lg:top-24">
          <Section title="Suggested presets">
            <p className="text-sm text-stone">Current: {selectedPreset}</p>
            {designPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSettings(preset.settings)}
                className="border border-ink bg-paper p-4 text-left transition hover:bg-ink hover:text-paper"
              >
                <span className="block font-bold">{preset.name}</span>
                <span className="mt-1 block text-sm opacity-75">{preset.description}</span>
              </button>
            ))}
          </Section>
        </aside>

        <div className="grid gap-6">
          <Section title="Colours">
            <div className="grid gap-4 md:grid-cols-2">
              {(Object.keys(colorLabels) as Array<keyof DesignSettings["colors"]>).map((key) => (
                <label key={key} className="grid gap-2 text-sm font-bold">
                  <span>{colorLabels[key]}</span>
                  <span className="flex items-center gap-3">
                    <input type="color" value={settings.colors[key]} onChange={(event) => setColor(key, event.target.value)} className="h-11 w-16 border border-ink bg-paper" />
                    <input value={settings.colors[key]} onChange={(event) => setColor(key, event.target.value)} className="min-h-11 flex-1 border border-ink bg-paper px-3 font-mono text-sm" />
                  </span>
                </label>
              ))}
            </div>
          </Section>

          <Section title="Typography and fonts">
            <label className="grid gap-2 text-sm font-bold">
              Existing font stack
              <select value={settings.typography.fontFamily} onChange={(event) => setFontFamily(event.target.value)} className="min-h-11 border border-ink bg-paper px-3">
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-3 border border-ink bg-warm-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">Custom font upload</p>
                  <p className="text-sm text-stone">Supports .woff2, .woff, and .ttf. Stored locally for this browser.</p>
                </div>
                <button className="button-secondary border px-4 py-2 text-sm font-bold" type="button" onClick={() => fileInputRef.current?.click()}>
                  Choose font
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept=".woff,.woff2,.ttf,font/woff,font/woff2,font/ttf" onChange={handleFontUpload} className="hidden" />
              {settings.typography.customFontName ? (
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span>Installed: {settings.typography.customFontName}</span>
                  <button type="button" className="underline underline-offset-4" onClick={() => setSettings(resetCustomFont(settings))}>
                    Remove custom font
                  </button>
                </div>
              ) : null}
              {fontError ? <p className="text-sm font-bold text-danger">{fontError}</p> : null}
              <div className="grid gap-2 border-t border-ink pt-4">
                <p className="text-2xl font-bold">Azadi Coffee / قهوه آزادی</p>
                <p className="leading-8 text-stone">Fresh roast subscriptions, cafe supply, and brewing notes should stay readable in English and Persian.</p>
              </div>
            </div>
          </Section>

          <Section title="Shape, spacing, and shadows">
            <div className="grid gap-4 md:grid-cols-2">
              {shapeControls.map((control) => (
                <label key={control.key} className="grid gap-2 text-sm font-bold">
                  <span className="flex justify-between gap-3">
                    {control.label}
                    <span className="font-mono">{settings.shape[control.key]}</span>
                  </span>
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={settings.shape[control.key]}
                    onChange={(event) => setShape(control.key, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </Section>

          <Section title="Component styles">
            <div className="grid gap-4 md:grid-cols-2">
              {(Object.keys(styleOptions) as Array<keyof typeof styleOptions>).map((key) => (
                <label key={key} className="grid gap-2 text-sm font-bold capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                  <select value={settings.styles[key]} onChange={(event) => setStyle(key, event.target.value as never)} className="min-h-11 border border-ink bg-paper px-3">
                    {styleOptions[key].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </Section>

          <Section title="Live preview">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="product-card border bg-paper p-5">
                <p className="text-sm text-stone">Product card</p>
                <h3 className="mt-2 text-2xl font-bold">Azadi Seasonal Espresso</h3>
                <p className="mt-3 text-stone">Balanced chocolate, date, and citrus for daily service.</p>
                <button className="button-primary mt-5 border px-4 py-2 text-sm font-bold" type="button">
                  Add to cart
                </button>
              </div>
              <div className="grid gap-3">
                <button className="landing-tab flex min-h-14 items-center justify-between border px-4 py-3 text-left font-bold" type="button">
                  <span>01</span>
                  <span>White landing tab</span>
                </button>
                <article className="blog-card border-t bg-paper py-5">
                  <p className="text-sm text-stone">Journal / Brewing</p>
                  <h3 className="mt-2 text-2xl font-bold">Dialing in a new roast</h3>
                </article>
              </div>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}
