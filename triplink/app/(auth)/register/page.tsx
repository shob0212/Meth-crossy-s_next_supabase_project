"use client";

import { ArrowLeft, Image } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TEXT } from "@/lib/constants";

type RegisterStep = "EMAIL" | "VERIFY" | "PROFILE";

export default function RegisterPage() {
	const router = useRouter();
	const t = TEXT.ja;
	const [step, setStep] = useState<RegisterStep>("EMAIL");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [displayName, setDisplayName] = useState("");

	const handleRegister = () => {
		if (!email || !password || password !== confirmPassword) {
			alert("Please check inputs");
			return;
		}
		setStep("VERIFY");
	};

	const handleVerifyOtp = () => {
		if (otp.length === 6) {
			setStep("PROFILE");
		}
	};

	const handleCompleteSetup = () => {
		router.push("/dashboard");
	};

	return (
		<div className="min-h-screen bg-ivory dark:bg-gray-900 flex items-center justify-center p-6 relative">
			<div className="w-full max-w-md animate-fade-in relative z-10">
				<div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mint-300 to-peach-300"></div>

					{step === "EMAIL" && (
						<>
							<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
								{t.register}
							</h2>
							<div className="space-y-4">
								<input
									type="email"
									placeholder={t.email}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200"
								/>
								<input
									type="password"
									placeholder={t.pass}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200"
								/>
								<input
									type="password"
									placeholder={t.confirmPass}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200"
								/>
								<button
									type="button"
									onClick={handleRegister}
									className="w-full bg-mint-400 text-white py-4 rounded-full font-bold shadow-md hover:bg-mint-500 transition-all"
								>
									{t.start}
								</button>
							</div>
						</>
					)}

					{step === "VERIFY" && (
						<>
							<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
								{t.otp}
							</h2>
							<p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
								{t.otpDesc}
							</p>
							<div className="space-y-6">
								<input
									type="text"
									maxLength={6}
									placeholder="000000"
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									className="w-full text-center text-3xl tracking-[0.5em] font-mono bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200"
								/>
								<button
									type="button"
									onClick={handleVerifyOtp}
									className="w-full bg-mint-400 text-white py-4 rounded-full font-bold shadow-md hover:bg-mint-500 transition-all"
								>
									{t.verify}
								</button>
							</div>
						</>
					)}

					{step === "PROFILE" && (
						<>
							<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
								{t.setupProfile}
							</h2>
							<div className="space-y-4">
								<div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600">
									<Image size={32} />
								</div>
								<input
									type="text"
									placeholder={t.name}
									value={displayName}
									onChange={(e) => setDisplayName(e.target.value)}
									className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white p-4 rounded-2xl outline-none focus:ring-2 ring-mint-200"
								/>
								<button
									type="button"
									onClick={handleCompleteSetup}
									className="w-full bg-mint-400 text-white py-4 rounded-full font-bold shadow-md hover:bg-mint-500 transition-all"
								>
									{t.start}
								</button>
							</div>
						</>
					)}
				</div>
			</div>

			<div className="fixed bottom-8 left-6 z-50">
				<button
					type="button"
					onClick={() =>
						step === "EMAIL"
							? router.push("/")
							: setStep((s) => (s === "VERIFY" ? "EMAIL" : "VERIFY"))
					}
					className="w-14 h-14 rounded-full bg-gray-800/10 dark:bg-white/10 backdrop-blur-md border border-gray-800/10 dark:border-white/20 text-gray-800 dark:text-white flex items-center justify-center hover:bg-gray-800/20 dark:hover:bg-white/20 transition-all shadow-lg"
				>
					<ArrowLeft size={24} />
				</button>
			</div>
		</div>
	);
}
