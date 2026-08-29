import {
	index,
	layout,
	type RouteConfig,
	route,
} from "@react-router/dev/routes";

export default [
	layout("routes/auth-guard.tsx", [
		layout("routes/app-shell.tsx", [
			index("routes/home.tsx"),
			route("categories/:slug", "routes/category.tsx"),
		]),
	]),
	route("sign-in/*", "routes/sign-in.tsx"),
	route("sign-up/*", "routes/sign-up.tsx"),
] satisfies RouteConfig;
