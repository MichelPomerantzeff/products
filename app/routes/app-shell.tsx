import { Outlet } from "react-router";

import { AppSidebar } from "~/components/Layout/AppSidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

export default function AppShell() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main>
				<SidebarTrigger />
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
