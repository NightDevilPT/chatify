"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; // Assuming you're using `sonner` for toast notifications

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ChatifyLogo from "@/components/shared/atoms/logo";
import { PasswordInput } from "@/components/ui/password-input";
import { useLogin } from "@/hooks/login/useLogin";
import { useRouter } from "next/navigation";
import Loading from "@/components/shared/atoms/loading";

// Define form validation schema
const formSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
	});

	// Using the login hook
	const { mutate: loginUser, isPending } = useLogin({
		onSuccess: (response) => {
			if (response.status === "success") {
				toast.success(
					t(`login.${response.message}`) || "Login successful!"
				);
				router.push("/");
			}
		},
		onError: (error) => {
			console.log("Login error:", error);
			toast.error(
				t(`error.${error.message}`) || "Login failed. Please try again."
			);
		},
	});

	// On submit, pass the form data to the login mutation
	const onSubmit = (data: FormData) => {
		loginUser(data); // Trigger the login mutation with email and password
	};

	return (
		<div className={cn("flex flex-col gap-6 w-xl", className)} {...props}>
			<Card>
				<ChatifyLogo description={t("general.beBolBeSocial")} />
				<Separator />
				<CardHeader>
					<CardTitle>{t("login.title")}</CardTitle>
					<CardDescription>{t("login.description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-6">
							{/* Email Input */}
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
										{errors.email.message}
									</Label>
								)}
							</div>

							{/* Password Input */}
							<div className="grid">
								<div className="flex items-center mb-3">
									<Label htmlFor="password">
										{t("general.password")}
									</Label>
								</div>
								<PasswordInput
									id="password"
									placeholder={t(
										"general.passwordPlaceholder"
									)}
									{...register("password")}
								/>
								{errors.password && (
									<Label className="text-xs w-full text-destructive">
										{errors.password.message}
									</Label>
								)}
								<Link
									href="/auth/forgot-password"
									className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
								>
									{t("general.forgotPassword")}
								</Link>
							</div>

							{/* Submit Button */}
							<div className="flex flex-col gap-3">
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
										t("general.login")
									)}
								</Button>
								{/* <Button
									variant="secondary"
									className="w-full"
									type="button"
								>
									{t("general.continueWithGoogle")}
								</Button> */}
							</div>
						</div>

						{/* Redirect to sign up */}
						<div className="mt-4 text-center text-sm">
							{t("general.dontHaveAccount")}{" "}
							<Link
								href="/auth/signup"
								className="underline underline-offset-4"
							>
								{t("general.signUp")}
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
