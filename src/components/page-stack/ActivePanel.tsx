import type { StackPanel } from "./PagePanel";
import { PagePanel } from "./PagePanel";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import type { Locale } from "@/lib/i18n";

type ActivePanelProps = {
  panel: StackPanel;
  index: number;
  locale?: Locale;
};

export function ActivePanel({ panel, index, locale = "fa" }: ActivePanelProps) {
  return (
    <section id={`${panel.id}-panel`} className="min-w-0 flex-1 border-l border-ink">
      <PagePanel tone={panel.tone}>
        <header>
          <div className="flex items-start justify-between gap-4">
            <p className={panel.tone === "ink" ? "text-sm font-bold text-white/60" : "text-sm font-bold text-stone"}>
              {String(index + 1).padStart(2, "0")} / {panel.eyebrow}
            </p>
            <LanguageSwitch locale={locale} />
          </div>
          <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">{panel.title}</h2>
        </header>
        <div className="mt-10">{panel.children}</div>
      </PagePanel>
    </section>
  );
}
