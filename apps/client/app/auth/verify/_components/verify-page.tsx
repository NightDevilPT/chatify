"use client";

import { useState, useEffect } from "react";
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

	useEffect(() => {
		// Simulate API call with timeout
		const verifyToken = async () => {
			// const token = searchParams.get("token");

			// // Check if token exists
			// if (!token) {
			// 	setState(VerificationState.INVALID);
			// 	return;
			// }

			try {
				// Simulate network delay
				await new Promise((resolve) => setTimeout(resolve, 2000));

				// Simulate API response (80% success rate for demo)
				const isSuccess = false;

				if (isSuccess) {
					setState(VerificationState.SUCCESS);
				} else {
					setState(VerificationState.FAILED);
				}
			} catch (error) {
				setState(VerificationState.FAILED);
			}
		};

		verifyToken();
	}, [searchParams]);

	const handleContinue = () => {
		router.push("/login");
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

					{state === VerificationState.FAILED && (
						<div className="flex flex-col items-center gap-4">
							<XCircle className="w-12 h-12 text-destructive" />
							<Label className="text-lg">
								{t("error.failedVerification")}
							</Label>
							<Label className="text-muted-foreground text-center">
								{t("error.invalidToken")}
							</Label>
							<Button
								type="submit"
								className="w-full bg-primary text-foreground"
							>
								{t("general.login")}
							</Button>
						</div>
					)}

					{state === VerificationState.INVALID && (
						<div className="flex flex-col items-center gap-4">
							<XCircle className="w-12 h-12 text-destructive" />
							<Label className="text-lg">
								{t("error.invalidToken")}
							</Label>
							<Label className="text-muted-foreground text-center">
								{t("error.failedVerification")}
							</Label>
							<Button
								variant="outline"
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
