import {
	index,
	layout,
	route,
	type RouteConfig,
} from "@react-router/dev/routes";

export default [
	layout("routes/app-layout.tsx", [
		index("routes/home.tsx"),
		route("categorias/:slug", "routes/categoria.tsx"),
		route("settings", "routes/settings.tsx"),
		route("help", "routes/help.tsx"),
	]),
	route("sign-in/*", "routes/sign-in.tsx"),
	route("sign-up/*", "routes/sign-up.tsx"),
] satisfies RouteConfig;
