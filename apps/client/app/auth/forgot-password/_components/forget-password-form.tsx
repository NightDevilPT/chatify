import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

const formSchema = z.object({
	email: z.string().email("error.invalidEmail"),
});

type FormData = z.infer<typeof formSchema>;

export function ForgetPasswordForm({
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
		// Add your forget password logic here
		console.log("Forget password email submitted:", data.email);
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
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-6">
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
								{t("general.submit")}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
