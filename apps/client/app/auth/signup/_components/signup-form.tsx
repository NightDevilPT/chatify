"use client";

import * as z from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ChatifyLogo from "@/components/shared/atoms/logo";
import { PasswordInput } from "@/components/ui/password-input";
import { useRegister } from "@/hooks/signup/useRegister";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/atoms/loading";

// Match backend DTO validation with Zod
const formSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(20, "Username cannot exceed 20 characters")
		.regex(
			/^[a-zA-Z0-9_]+$/,
			"Username can only contain letters, numbers and underscores"
		),
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export type FormData = z.infer<typeof formSchema>;

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { t } = useTranslation();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});
	const { mutate: registerService, isPending  } = useRegister({
		onSuccess: (response) => {
			if (response.status === "success") {
				toast.success(t("signup.successMessage"));
				router.push("/auth/login");
			}
		},
		onError: (error) => {
			console.log(error.message);
			toast.error(t(`error.${error.message}`, { email: watch("email") }));
		},
	});

	const onSubmit = (data: FormData) => {
		registerService(data);
	};

	return (
		<div className={cn("flex flex-col gap-6 w-xl", className)} {...props}>
			<Card>
				<ChatifyLogo description={t("general.beBolBeSocial")} />
				<Separator />
				<CardHeader>
					<CardTitle>{t("signup.title")}</CardTitle>
					<CardDescription>{t("signup.description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-6"
					>
						<div className="grid gap-4">
							{/* Username */}
							<div className="grid">
								<Label htmlFor="username" className="mb-3">
									{t("general.username")}
								</Label>
								<Input
									id="username"
									placeholder={t(
										"general.usernamePlaceholder"
									)}
									{...register("username")}
								/>
								{errors.username && (
									<Label className="text-xs text-destructive">
										{errors.username.message}
									</Label>
								)}
							</div>

							{/* Email */}
							<div className="grid">
								<Label htmlFor="email" className="mb-3">
									{t("general.email")}
								</Label>
								<Input
									id="email"
									type="email"
									placeholder={t("general.emailPlaceholder")}
									{...register("email")}
								/>
								{errors.email && (
									<Label className="text-xs text-destructive">
										{errors.email.message}
									</Label>
								)}
							</div>

							{/* Password */}
							<div className="grid">
								<Label htmlFor="password" className="mb-3">
									{t("general.password")}
								</Label>
								<PasswordInput
									id="password"
									placeholder={t(
										"general.passwordPlaceholder"
									)}
									{...register("password")}
								/>
								{errors.password && (
									<Label className="text-xs text-destructive">
										{errors.password.message}
									</Label>
								)}
							</div>

							{/* Submit */}
							<div className="flex flex-col gap-3 mt-3">
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
										t("general.signUp", "Sign Up")
									)}
								</Button>
								{/* <Button
									variant="secondary"
									className="w-full"
									type="button"
								>
									{t(
										"general.continueWithGoogle",
										"Continue with Google"
									)}
								</Button> */}
							</div>

							{/* Redirect to login */}
							<div className="mt-4 text-center text-sm">
								{t("general.alreadyHaveAccount")}{" "}
								<Link
									href="/auth/login"
									className="underline underline-offset-4"
								>
									{t("general.login", "Login")}
								</Link>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
