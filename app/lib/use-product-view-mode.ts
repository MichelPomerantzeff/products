import { useEffect, useState } from "react";
import type { ProductViewMode } from "~/components/Product/ProductViewToggle";

const STORAGE_KEY = "product-view-mode";

function readStoredMode(): ProductViewMode {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === "grid" || stored === "list") return stored;
	} catch {
		// localStorage unavailable — default to grid for this session.
	}
	return "grid";
}

export function useProductViewMode() {
	const [mode, setModeState] = useState<ProductViewMode>("grid");

	useEffect(() => {
		setModeState(readStoredMode());
	}, []);

	const setMode = (next: ProductViewMode) => {
		setModeState(next);
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// Best-effort persistence only.
		}
	};

	return [mode, setMode] as const;
}
