import React, { memo } from "react";

interface LoadingProps {
	/**
	 * Size of the loading dots
	 * @default 'medium'
	 */
	size?: "small" | "medium" | "large";
	/**
	 * Custom class name for additional styling
	 */
	className?: string;

	/**
	 * Background color for the dots
	 * @default 'bg-primary'
	 */
	dotBackgroundColor?: string;
}

/**
 * A customizable loading spinner component with animated bouncing dots
 */
const ChatLoading: React.FC<LoadingProps> = ({
	size = "medium",
	className = "",
	dotBackgroundColor = "bg-primary"
}) => {
	const sizeStyles = {
		small: "w-2 h-2",
		medium: "w-4 h-4",
		large: "w-6 h-6",
	};

	const containerSizeStyles = {
		small: "gap-1",
		medium: "gap-2",
		large: "gap-3",
	};

	return (
		<div
			className={`flex flex-row ${containerSizeStyles[size]}`}
			role="status"
			aria-label="Loading"
		>
			{[...Array(3)].map((_, index) => (
				<div
					key={index}
					className={`
            ${sizeStyles[size]} 
            rounded-full
            animate-bounce
			${dotBackgroundColor}
            ${index === 1 ? "[animation-delay:-0.3s]" : ""}
            ${index === 2 ? "[animation-delay:-0.5s]" : ""}
          `}
				/>
			))}
		</div>
	);
};

export default memo(ChatLoading);
