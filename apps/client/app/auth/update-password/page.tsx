import React from "react";
import { UpdatePasswordForm } from "./_components/update-password-form";
import { LanguageSwitcher } from "@/components/shared/atoms/language-switcher";

const page = () => {
	return (
		<div className="w-full h-screen flex justify-center items-center relative">
			<UpdatePasswordForm />
			<LanguageSwitcher
				showText={false}
				className={"absolute right-5 top-5"}
			/>
		</div>
	);
};

export default page;
