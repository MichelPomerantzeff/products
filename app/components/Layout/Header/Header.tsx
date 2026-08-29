import { Show, UserButton, useUser } from "@clerk/react-router";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "~/components/Layout/ThemeToggle/ThemeToggle";

const USER_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#0b57f5"/><stop offset="100%" stop-color="#3fc6f7"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><circle cx="50" cy="40" r="17" fill="white"/><rect x="18" y="62" width="64" height="50" rx="32" fill="white"/></svg>`;

const fallbackAvatarBoxStyle = {
	backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(USER_ICON_SVG)}")`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	backgroundRepeat: "no-repeat",
	borderRadius: "9999px",
};

const fallbackAvatarImageStyle = { visibility: "hidden" as const };

export function Header() {
	const { user } = useUser();

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

	return (
		<header className="border-b py-3">
			<div className="flex shrink-0 items-center justify-between gap-2 max-w-7xl mx-auto px-2">
				<div className="flex items-center gap-2">
					<div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<Sparkles className="size-4" />
					</div>
					<span className="truncate font-heading text-sm font-semibold">
						Product extractor
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Show when="signed-in">
						<div className="flex items-center gap-2 rounded-md px-2 py-1">
							<UserButton
								showName
								appearance={{ elements: avatarElements }}
								userProfileProps={{
									appearance: { elements: avatarElements },
								}}
							/>
						</div>
					</Show>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
