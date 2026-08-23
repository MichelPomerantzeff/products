import { ThemeToggle } from "~/components/Layout/Header/ThemeToggle";
import { SidebarTrigger } from "~/components/ui/sidebar";

export function Header() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-3">
      <SidebarTrigger />
      <ThemeToggle />
    </header>
  );
}
