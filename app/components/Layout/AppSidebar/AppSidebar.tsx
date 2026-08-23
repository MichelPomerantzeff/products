import { Show, UserButton, useUser } from "@clerk/react-router";
import { HelpCircle, Search, Settings, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInput,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "~/components/ui/sidebar";
import { categories } from "~/lib/categories";

const USER_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#0b57f5"/><stop offset="100%" stop-color="#3fc6f7"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><circle cx="50" cy="40" r="17" fill="white"/><rect x="18" y="62" width="64" height="50" rx="32" fill="white"/></svg>`;

const fallbackAvatarBoxStyle = {
	backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(USER_ICON_SVG)}")`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	borderRadius: "9999px",
};

const fallbackAvatarImageStyle = { visibility: "hidden" as const };

export function AppSidebar() {
	const location = useLocation();
	const { user } = useUser();
	const userButtonWrapperRef = useRef<HTMLDivElement>(null);

	const openUserMenu = () => {
		userButtonWrapperRef.current?.querySelector("button")?.click();
	};

	const hasCustomImage = user?.hasImage ?? false;

	const avatarBoxStyle = hasCustomImage ? undefined : fallbackAvatarBoxStyle;
	const avatarImageStyle = hasCustomImage
		? undefined
		: fallbackAvatarImageStyle;

	const avatarElements = {
		avatarBox: avatarBoxStyle,
		avatarImage: avatarImageStyle,
		userButtonAvatarBox: avatarBoxStyle,
		userButtonAvatarImage: avatarImageStyle,
		userPreviewAvatarBox: avatarBoxStyle,
		userPreviewAvatarImage: avatarImageStyle,
	};
	const email = user?.primaryEmailAddress?.emailAddress;
	const displayName = user?.fullName || email?.split("@")[0] || "...";

	const [query, setQuery] = useState("");

	const filteredCategories = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return categories;
		return categories.filter((category) =>
			category.label.toLowerCase().includes(normalized),
		);
	}, [query]);

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							render={<NavLink to="/" />}
							size="lg"
							className="gap-2.5"
						>
							<div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
								<Sparkles className="size-4" />
							</div>
							<div className="grid flex-1 text-left leading-tight">
								<span className="truncate font-heading text-sm font-semibold">
									Product extractor
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<div className="group-data-[collapsible=icon]:hidden">
					<div className="relative">
						<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
						<SidebarInput
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Buscar categoria..."
							className="pl-7"
							aria-label="Buscar categoria"
						/>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent className="justify-between">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{filteredCategories.map((category) => {
								const to = `/categorias/${category.slug}`;
								const isActive = location.pathname === to;
								return (
									<SidebarMenuItem key={category.slug}>
										<SidebarMenuButton
											render={<NavLink to={to} />}
											isActive={isActive}
											tooltip={category.label}
										>
											<category.icon />
											<span>{category.label}</span>
										</SidebarMenuButton>
										<SidebarMenuBadge>{category.count}</SidebarMenuBadge>
									</SidebarMenuItem>
								);
							})}
							{filteredCategories.length === 0 && (
								<p className="px-2 py-1.5 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
									Nenhuma categoria encontrada.
								</p>
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								render={<NavLink to="/settings" />}
								isActive={location.pathname === "/settings"}
								tooltip="Settings"
							>
								<Settings />
								<span>Settings</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton
								render={<NavLink to="/help" />}
								isActive={location.pathname === "/help"}
								tooltip="Help"
							>
								<HelpCircle />
								<span>Help</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarSeparator className="m-0" />

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" className="gap-2.5">
							<Show when="signed-in">
								<div className="flex w-full items-center gap-2.5">
									<div ref={userButtonWrapperRef}>
										<UserButton
											appearance={{ elements: avatarElements }}
											userProfileProps={{
												appearance: { elements: avatarElements },
											}}
										/>
									</div>
									<button
										type="button"
										className="grid flex-1 text-left leading-tight"
										onClick={openUserMenu}
									>
										<span className="truncate text-sm font-medium">
											{displayName}
										</span>
										<span className="truncate text-xs text-sidebar-foreground/70">
											{email}
										</span>
									</button>
								</div>
							</Show>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
