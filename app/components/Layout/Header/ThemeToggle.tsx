import { Moon, Sun } from "lucide-react";

import { Button } from "~/components/ui/button";
import { useTheme } from "~/lib/theme";

export function ThemeToggle() {
	const { isDark, toggleTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={toggleTheme}
			aria-label="Alternar tema claro/escuro"
		>
			{isDark ? <Sun /> : <Moon />}
		</Button>
	);
}
