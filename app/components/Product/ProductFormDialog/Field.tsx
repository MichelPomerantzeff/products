export function Field({
	label,
	htmlFor,
	optional,
	hint,
	children,
}: {
	label: string;
	htmlFor: string;
	optional?: boolean;
	hint?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={htmlFor} className="text-sm font-medium">
				{label}
				{optional && (
					<span className="ml-1 font-normal text-muted-foreground">
						(optional)
					</span>
				)}
			</label>
			{children}
			{hint && <span className="text-xs text-muted-foreground">{hint}</span>}
		</div>
	);
}
