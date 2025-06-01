"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ChatifyLogo from "@/components/shared/atoms/logo";
import { PasswordInput } from "@/components/ui/password-input";

// Schema: newPassword must be min 8 chars and confirmPassword must match newPassword
const formSchema = z
	.object({
		newPassword: z.string().min(8, "error.passwordLength"),
		confirmPassword: z.string().min(8, "error.passwordLength"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "error.passwordsMustMatch",
		path: ["confirmPassword"],
	});

type FormData = z.infer<typeof formSchema>;

export function UpdatePasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	const onSubmit = (data: FormData) => {
		console.log("Update password submitted:", data);
		// Add your update password logic here
	};

	return (
		<div className={cn("flex flex-col gap-6 w-xl", className)} {...props}>
			<Card>
				<ChatifyLogo description={t("general.beBolBeSocial")} />
				<Separator />
				<CardHeader>
					<CardTitle>{t("updatePassword.title")}</CardTitle>
					<CardDescription>
						{t("updatePassword.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-6">
							<div className="grid">
								<div className="flex items-center mb-3">
									<Label htmlFor="newPassword">
										{t("updatePassword.newPassword")}
									</Label>
								</div>
								<PasswordInput
									id="newPassword"
									placeholder={t(
										"updatePassword.newPasswordPlaceholder"
									)}
									{...register("newPassword")}
								/>
								{errors.newPassword && (
									<Label className="text-xs text-destructive">
										{t(errors.newPassword.message || "")}
									</Label>
								)}
							</div>

							<div className="grid">
								<div className="flex items-center mb-3">
									<Label htmlFor="confirmPassword">
										{t("updatePassword.confirmPassword")}
									</Label>
								</div>
								<PasswordInput
									id="confirmPassword"
									placeholder={t(
										"updatePassword.confirmPasswordPlaceholder"
									)}
									{...register("confirmPassword")}
								/>
								{errors.confirmPassword && (
									<Label className="text-xs text-destructive">
										{t(
											errors.confirmPassword.message || ""
										)}
									</Label>
								)}
							</div>

							<Button
								type="submit"
								className="w-full bg-primary text-foreground"
								disabled={isSubmitting}
							>
								{t("updatePassword.submit")}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
