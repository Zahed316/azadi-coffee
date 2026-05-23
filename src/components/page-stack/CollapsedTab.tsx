import type { StackPanel } from "./PagePanel";

type CollapsedTabProps = {
  panel: StackPanel;
  index: number;
  onSelect: () => void;
};

export function CollapsedTab({ panel, index, onSelect }: CollapsedTabProps) {
  return (
    <button
      type="button"
      aria-expanded={false}
      aria-controls={`${panel.id}-panel`}
      onClick={onSelect}
      className="landing-tab group flex min-h-16 w-full items-center justify-between border-b px-4 py-3 text-right transition md:h-screen md:min-h-0 md:w-16 md:flex-col md:border-b-0 md:border-l md:px-3 md:py-6"
    >
      <span className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-sm font-bold md:[writing-mode:vertical-rl]">{panel.label}</span>
      <span className="hidden h-8 w-px bg-current opacity-40 md:block" />
    </button>
  );
}
