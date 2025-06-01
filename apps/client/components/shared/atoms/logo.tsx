import React from "react";
import { SiLivechat } from "react-icons/si";

const ChatifyLogo = React.memo(({ description }: { description: string }) => {
	return (
		<div className={`w-auto h-full flex justify-center items-center gap-4`}>
			<SiLivechat className="w-11 h-11 bg-primary p-2 rounded-md text-foreground" />
			<span className="text-3xl font-semibold text-foreground grid grid-cols-1">
				<span>
					Chat<span className="text-primary">ify</span>
				</span>
				<span className={"text-xs text-muted-foreground"}>
					{description}
				</span>
			</span>
		</div>
	);
});

export default ChatifyLogo;
