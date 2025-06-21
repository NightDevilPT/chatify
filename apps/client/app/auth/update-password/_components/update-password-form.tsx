"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ChatifyLogo from "@/components/shared/atoms/logo";
import { PasswordInput } from "@/components/ui/password-input";
import { useResetPassword } from "@/hooks/update-password/useUpdatePassword";
import Loading from "@/components/shared/atoms/loading";

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
	const router = useRouter();
	const searchParams = useSearchParams();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	const { mutate: resetPassword, isPending } = useResetPassword({
		onSuccess: (response) => {
			if (response.status === "success") {
				toast.success(t(`updatePassword.${response.message}`));
				router.push("/auth/login");
			} else {
				const apiError = response as any;
				toast.error(
					t(`error.${apiError.message || "failedResetPassword"}`)
				);
			}
		},
		onError: (error: any) => {
			toast.error(t(`error.${error?.message || "failedResetPassword"}`));
		},
	});

	const onSubmit = (data: FormData) => {
		const token = searchParams.get("token");
		if (!token) {
			toast.error(t("error.invalidToken"));
			return;
		}
		resetPassword({ token, newPassword: data.newPassword });
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
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-6"
					>
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
									{t(errors.confirmPassword.message || "")}
								</Label>
							)}
						</div>

						<Button
							type="submit"
							className="w-full bg-primary text-foreground"
							disabled={isPending}
						>
							{isPending ? (
								<Loading
									size="small"
									dotBackgroundColor="bg-foreground"
								/>
							) : (
								t("updatePassword.submit")
							)}
						</Button>

						<div className="mt-4 text-center text-sm">
							{t("general.alreadyHaveAccount")}{" "}
							<Link
								href="/auth/login"
								className="underline underline-offset-4"
							>
								{t("general.login")}
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
