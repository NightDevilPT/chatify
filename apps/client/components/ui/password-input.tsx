import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

const PasswordInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
	const [showPassword, setShowPassword] = React.useState(false);

	return (
		<div className="relative">
			<Input
				type={showPassword ? "text" : "password"}
				className={cn("pr-10", className)}
				ref={ref}
				{...props}
			/>
			<button
				type="button"
				className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
				onClick={() => setShowPassword(!showPassword)}
				aria-label={showPassword ? "Hide password" : "Show password"}
			>
				{showPassword ? (
					<EyeOff className="h-4 w-4" />
				) : (
					<Eye className="h-4 w-4" />
				)}
			</button>
		</div>
	);
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
