import type { ReactNode } from "react";

export type PanelTone = "paper" | "warm" | "ink";

export type StackPanel = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  tone?: PanelTone;
  children: ReactNode;
};

export function PagePanel({ children, tone = "paper" }: { children: ReactNode; tone?: PanelTone }) {
  const toneClass =
    tone === "ink"
      ? "bg-ink text-paper"
      : tone === "warm"
        ? "bg-warm-paper text-ink"
        : "bg-paper text-ink";

  return (
    <div className={`h-full min-h-[640px] overflow-y-auto ${toneClass}`}>
      <div className="flex min-h-full flex-col justify-between p-6 md:p-8 lg:p-10">{children}</div>
    </div>
  );
}
