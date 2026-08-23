import { Sparkles } from "lucide-react";
import { ThemeToggle } from "~/components/Layout/ThemeToggle/ThemeToggle";
import { Button } from "~/components/ui/button";
import { SidebarTrigger } from "~/components/ui/sidebar";

export function Header() {
	return (
		<header className="flex shrink-0 items-center justify-between gap-2 border-b p-2">
			<SidebarTrigger />
			<Button
				variant="ghost"
				className="flex items-center gap-2 md:hidden py-4"
			>
				<div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
					<Sparkles className="size-3" />
				</div>
				<div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
					<span className="truncate font-heading text-sm font-semibold">
						Product extractor
					</span>
				</div>
			</Button>
			<ThemeToggle />
		</header>
	);
}
