"use client";

import { useState } from "react";
import { ActivePanel } from "./ActivePanel";
import { CollapsedTab } from "./CollapsedTab";
import type { StackPanel } from "./PagePanel";

export function PageStackLayout({ panels }: { panels: StackPanel[] }) {
  const [activeId, setActiveId] = useState(panels[0]?.id ?? "");
  const activeIndex = Math.max(
    panels.findIndex((panel) => panel.id === activeId),
    0,
  );
  const activePanel = panels[activeIndex];

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="hidden h-screen overflow-hidden border-t border-ink md:flex">
        <ActivePanel panel={activePanel} index={activeIndex} />
        <aside className="flex shrink-0 flex-row-reverse">
          {panels.map((panel, index) => (
            <CollapsedTab
              key={panel.id}
              panel={panel}
              index={index}
              active={panel.id === activeId}
              onSelect={() => setActiveId(panel.id)}
            />
          ))}
        </aside>
      </div>

      <div className="md:hidden">
        {panels.map((panel, index) => {
          const active = panel.id === activeId;

          return (
            <section key={panel.id} className="border-b border-ink">
              <CollapsedTab panel={panel} index={index} active={active} onSelect={() => setActiveId(panel.id)} />
              {active ? <ActivePanel panel={panel} index={index} /> : null}
            </section>
          );
        })}
      </div>
    </main>
  );
}
