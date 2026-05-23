"use client";

import { useState } from "react";
import { ActivePanel } from "./ActivePanel";
import { CollapsedTab } from "./CollapsedTab";
import type { StackPanel } from "./PagePanel";
import type { Locale } from "@/lib/i18n";

export function PageStackLayout({ panels, locale = "fa" }: { panels: StackPanel[]; locale?: Locale }) {
  const [activeId, setActiveId] = useState(panels[0]?.id ?? "");
  const activeIndex = Math.max(
    panels.findIndex((panel) => panel.id === activeId),
    0,
  );
  const activePanel = panels[activeIndex];
  const previousTabs = panels.slice(0, activeIndex);
  const nextTabs = panels.slice(activeIndex + 1);

  return (
    <main className="min-h-screen bg-paper text-ink" lang={locale} dir={locale === "en" ? "ltr" : "rtl"}>
      <div className="hidden h-screen overflow-hidden border-t border-ink md:flex">
        {previousTabs.length > 0 ? (
          <aside className="flex shrink-0 flex-row-reverse">
            {previousTabs.map((panel, index) => (
              <CollapsedTab
                key={panel.id}
                panel={panel}
                index={index}
                onSelect={() => setActiveId(panel.id)}
              />
            ))}
          </aside>
        ) : null}

        <ActivePanel panel={activePanel} index={activeIndex} locale={locale} />

        {nextTabs.length > 0 ? (
          <aside className="flex shrink-0">
            {nextTabs.map((panel, index) => {
              const panelIndex = activeIndex + index + 1;

              return (
                <CollapsedTab
                  key={panel.id}
                  panel={panel}
                  index={panelIndex}
                  onSelect={() => setActiveId(panel.id)}
                />
              );
            })}
          </aside>
        ) : null}
      </div>

      <div className="md:hidden">
        {previousTabs.length > 0 ? (
          <div className="border-b border-ink">
            {previousTabs.map((panel, index) => (
              <CollapsedTab key={panel.id} panel={panel} index={index} onSelect={() => setActiveId(panel.id)} />
            ))}
          </div>
        ) : null}
        <ActivePanel panel={activePanel} index={activeIndex} locale={locale} />
        {nextTabs.length > 0 ? (
          <div className="border-t border-ink">
            {nextTabs.map((panel, index) => {
              const panelIndex = activeIndex + index + 1;

              return (
                <CollapsedTab key={panel.id} panel={panel} index={panelIndex} onSelect={() => setActiveId(panel.id)} />
              );
            })}
          </div>
        ) : null}
      </div>
    </main>
  );
}
