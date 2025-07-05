"use client";

import { toast } from "sonner";
import { useEffect, useState, useRef } from "react";
import { LoaderCircle, CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import ChatifyLogo from "@/components/shared/atoms/logo";
import { useVerifyEmail } from "@/hooks/verify-user/userVerifyUser";

enum VerificationState {
	LOADING = "loading",
	SUCCESS = "success",
	FAILED = "failed",
	INVALID = "invalid",
}

export function VerifyPage({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { t } = useTranslation();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [state, setState] = useState<VerificationState>(
		VerificationState.LOADING
	);
	const verifiedRef = useRef(false); // Prevent duplicate verification attempts

	const { mutate: verifyEmail } = useVerifyEmail({
		onSuccess: (response) => {
			if (response.status === "success") {
				setState(VerificationState.SUCCESS);
				toast.success(t(`verifyUser.${response.message}`));
			} else {
				setState(VerificationState.FAILED);
				toast.error(t(`verifyUser.${response.message}`));
			}
		},
		onError: (error: any) => {
			const apiError = error.response?.data;
			console.error(
				"Verification Error:",
				apiError?.message || error.message
			);
			setState(VerificationState.FAILED);
			toast.error(
				t(
					`verifyUser.${
						apiError?.message ||
						error.message ||
						"failedVerification"
					}`
				)
			);
		},
	});

	useEffect(() => {
		const token = searchParams.get("token");

		if (!token) {
			setState(VerificationState.INVALID);
			toast.error(t("error.invalidToken"));
			return;
		}

		if (!verifiedRef.current) {
			verifiedRef.current = true; // Mark as attempted
			verifyEmail(token);
		}
	}, [searchParams, verifyEmail, t]);

	const handleContinue = () => {
		router.push("/auth/login");
	};

	return (
		<div
			className={cn(
				"flex flex-col gap-6 w-full max-w-md mx-auto",
				className
			)}
			{...props}
		>
			<Card>
				<ChatifyLogo description={t("general.beBolBeSocial")} />
				<Separator />

				<CardContent className="grid gap-4 py-4">
					{state === VerificationState.LOADING && (
						<div className="flex flex-col items-center gap-4">
							<LoaderCircle className="w-12 h-12 text-primary animate-spin" />
							<Label className="text-lg">
								{t("general.loading")}
							</Label>
						</div>
					)}

					{state === VerificationState.SUCCESS && (
						<div className="flex flex-col items-center gap-4">
							<CheckCircle2 className="w-12 h-12 text-green-500" />
							<Label className="text-lg">
								{t("general.userVerifiedSuccess")}
							</Label>
							<Button
								onClick={handleContinue}
								className="w-full bg-primary text-foreground"
							>
								{t("general.login")}
							</Button>
						</div>
					)}

					{(state === VerificationState.FAILED ||
						state === VerificationState.INVALID) && (
						<div className="flex flex-col items-center gap-4">
							<XCircle className="w-12 h-12 text-destructive" />
							<Label className="text-lg">
								{state === VerificationState.INVALID
									? t("error.invalidToken")
									: t("error.failedVerification")}
							</Label>
							<Label className="text-muted-foreground text-center">
								{state === VerificationState.INVALID
									? t("error.failedVerification")
									: t("error.invalidToken")}
							</Label>
							<Button
								onClick={handleContinue}
								className="w-full bg-primary text-foreground"
							>
								{t("general.login")}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
