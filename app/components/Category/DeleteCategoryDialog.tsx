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
import { useCategories } from "~/lib/categories-store";

export function DeleteCategoryDialog({
	category,
	open,
	onOpenChange,
	onDeleted,
}: {
	category: Category;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDeleted?: () => void;
}) {
	const { removeCategory } = useCategories();

	const handleConfirm = () => {
		removeCategory(category.id);
		onOpenChange(false);
		onDeleted?.();
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
					<AlertDialogAction variant="destructive" onClick={handleConfirm}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
