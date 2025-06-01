import React, { ReactNode } from "react";

const ChatLayout = ({ children }: { children: ReactNode }) => {
	return (
		<main className={`w-full h-full grid grid-cols-[450px_2px_1fr]`}>
			<div className={`w-full h-full grid grid-cols-[65px_2px_1fr]`}>
				<div className={`w-full h-full`}>{/* Chat Navbar */}</div>
				<div className={`w-full h-full bg-secondary`}></div>
				<div className={`w-full h-full`}>{/* Recent User list */}</div>
			</div>
			<div className={`w-full h-full bg-secondary`}></div>
			<div className="w-full h-full grid grid-rows-[60px_2px_1fr_2px_60px]">
				<div className={`w-full h-full`}>
					{/* Selected User Chat Header */}
				</div>
				<div className={`w-full h-full bg-secondary`}></div>
				<div className="w-full h-full">
					{/* Selected User Chat Messages */}
				</div>
				<div className={`w-full h-full bg-secondary`}></div>
				<div className="w-full h-full">
					{/* Selected User Chat Input */}
				</div>
			</div>
		</main>
	);
};

export default ChatLayout;
