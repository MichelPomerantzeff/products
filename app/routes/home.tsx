import { Show, SignInButton } from "@clerk/react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<main className="min-h-[calc(100vh-48px)] p-6">
			<div>
				<Show when="signed-out">
					<SignInButton>
						<Button variant="ghost">Sign in</Button>
					</SignInButton>
				</Show>
				<Card>
					<CardContent>
						<p>Welcome</p>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
