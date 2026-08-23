import { Outlet } from "react-router";

import { AppSidebar } from "~/components/Layout/AppSidebar/AppSidebar";
import { Header } from "~/components/Layout/Header/Header";
import { SidebarProvider } from "~/components/ui/sidebar";

export default function AppShell() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex w-full flex-col">
        <Header />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
