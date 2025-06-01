"use client";
import React from "react";
import { LoginForm } from "./_components/login-form";
import { LanguageSwitcher } from "@/components/shared/atoms/language-switcher";

const page = () => {
	return (
		<div className="w-full h-screen flex justify-center items-center relative">
			<LoginForm />
			<LanguageSwitcher
				showText={false}
				className={"absolute right-5 top-5"}
			/>
		</div>
	);
};

export default page;
