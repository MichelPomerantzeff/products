import { Show, SignInButton, UserButton } from "@clerk/react-router";

export function Welcome() {
	return (
		<main className="flex flex-col items-center justify-center gap-4 pt-16 pb-4">
			<Show when="signed-out">
				<SignInButton />
			</Show>
			<Show when="signed-in">
				<UserButton />
			</Show>
			Welcome
		</main>
	);
}