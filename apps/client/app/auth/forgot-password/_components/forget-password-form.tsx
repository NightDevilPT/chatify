"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ChatifyLogo from "@/components/shared/atoms/logo";
import { useForgotPassword } from "@/hooks/forget-password/useForgetPassword";
import Loading from "@/components/shared/atoms/loading";

const formSchema = z.object({
	email: z.string().email("error.invalidEmail"),
});

type FormData = z.infer<typeof formSchema>;

export function ForgetPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { t } = useTranslation();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		watch,
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	const { mutate: forgotPassword, isPending } = useForgotPassword({
		onSuccess: (response) => {
			if (response.status === "success") {
				toast.success(t("forgot.successMessage"));
				router.push("/auth/login");
			} else {
				const apiError = response as any;
				toast.error(t(`error.${apiError.message}`));
			}
		},
		onError: (error: any) => {
			toast.error(t(`error.${error?.message}`));
		},
	});

	const onSubmit = (data: FormData) => {
		forgotPassword({ email: data.email });
	};

	return (
		<div className={cn("flex flex-col gap-6 w-xl", className)} {...props}>
			<Card>
				<ChatifyLogo description={t("general.beBolBeSocial")} />
				<Separator />
				<CardHeader>
					<CardTitle>{t("forgot.title")}</CardTitle>
					<CardDescription>{t("forgot.description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-6"
					>
						<div className="grid">
							<div className="flex items-center mb-3">
								<Label htmlFor="email">
									{t("general.email")}
								</Label>
							</div>
							<Input
								id="email"
								type="email"
								placeholder={t("general.emailPlaceholder")}
								{...register("email")}
							/>
							{errors.email && (
								<Label className="text-xs text-destructive">
									{t(errors.email.message || "")}
								</Label>
							)}
						</div>
						<Button
							type="submit"
							className="w-full bg-primary text-foreground"
							disabled={isSubmitting}
						>
							{isPending ? (
								<Loading
									size="small"
									dotBackgroundColor="bg-foreground"
								/>
							) : (
								t("general.submit")
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
