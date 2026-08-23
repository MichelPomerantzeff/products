import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import type { Category } from "~/lib/categories-store";

export function DeleteCategoryDialog({
	category,
	open,
	onOpenChange,
}: {
	category: Category;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const handleConfirm = () => {
		// No `remove` mutation in Convex yet — this just closes the dialog until
		// that's wired up (UI-only per docs/specs/editar-excluir-categorias-ui.md).
		onOpenChange(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete "{category.label}"?</AlertDialogTitle>
					<AlertDialogDescription>This can't be undone.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm}>Delete</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
