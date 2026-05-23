import type { StackPanel } from "./PagePanel";

type CollapsedTabProps = {
  panel: StackPanel;
  index: number;
  active: boolean;
  onSelect: () => void;
};

export function CollapsedTab({ panel, index, active, onSelect }: CollapsedTabProps) {
  return (
    <button
      type="button"
      aria-expanded={active}
      aria-controls={`${panel.id}-panel`}
      onClick={onSelect}
      className={`group flex min-h-16 w-full items-center justify-between border-b border-ink px-4 py-3 text-right transition md:min-h-[calc(100vh-4rem)] md:w-16 md:flex-col md:border-b-0 md:border-l md:px-3 md:py-6 ${
        active ? "bg-ink text-paper md:hidden" : "bg-paper text-ink hover:bg-ink hover:text-paper"
      }`}
    >
      <span className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm font-bold md:[writing-mode:vertical-rl]">{panel.label}</span>
      <span className="hidden h-8 w-px bg-current opacity-40 md:block" />
    </button>
  );
}
