import { getAuth } from "@clerk/react-router/server";
import { Outlet, redirect } from "react-router";

import type { Route } from "./+types/auth-guard";

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args);

  if (!userId) {
    throw redirect("/sign-in");
  }

  return null;
}

export default function AuthGuard() {
  return <Outlet />;
}
