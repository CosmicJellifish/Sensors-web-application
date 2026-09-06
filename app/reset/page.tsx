import Link from "next/link";
import { Hammersmith_One, Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hammersmith = Hammersmith_One({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-hammersmith",
});

export default function ResetPasswordPage() {
	return (
		<main
			className={`${inter.variable} ${hammersmith.variable} flex min-h-dvh flex-col items-center bg-[linear-gradient(to_bottom,#2757d2_15.385%,#abc1f8_76.923%)] py-[16px] font-[family-name:var(--font-inter)]`}
		>
			<header className="flex w-full flex-col items-center gap-[4px] px-[24px] pt-[16px] pb-[32px] text-center">
				<h1 className="text-[24px] leading-[28px] font-bold tracking-[-0.5px] text-white">
					Electrochemical
					<br />
					Sensor Monitor
				</h1>
				<p className="text-[14px] leading-[16px] font-semibold tracking-[0.6px] text-black uppercase">
					Precision Data Suite
				</p>
			</header>

			<section className="w-[523px] max-w-full rounded-[25px] bg-[rgba(0,46,116,0.44)] px-[26px] pb-[67px]">
				<h2 className="py-[12px] text-center text-[36px] leading-[51px] text-white font-[family-name:var(--font-hammersmith)]">
					Enter a New Password
				</h2>

				<form>
					<label
						htmlFor="new-password"
						className="mt-[36px] block text-[24px] leading-[20px] text-white"
					>
						New Password:
					</label>
					<input
						id="new-password"
						name="new-password"
						type="password"
						autoComplete="new-password"
						className="mt-[19px] block h-[54px] w-full rounded-[15px] bg-[rgba(24,7,71,0.41)] px-[16px] text-[20px] text-white caret-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
					/>

					<label
						htmlFor="confirm-password"
						className="mt-[78px] block text-[24px] leading-[20px] text-white"
					>
						Re-enter New Password
					</label>
					<input
						id="confirm-password"
						name="confirm-password"
						type="password"
						autoComplete="new-password"
						className="mt-[21px] block h-[54px] w-full rounded-[15px] bg-[rgba(24,7,71,0.41)] px-[16px] text-[20px] text-white caret-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
					/>

					<button
						type="submit"
						className="mt-[34px] mx-auto block h-[51px] w-[260px] max-w-full rounded-[15px] bg-[#32428e] text-[24px] leading-[20px] text-white transition-colors hover:bg-[#3a4ca6] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
					>
						Reset Password
					</button>

					<Link
						href="/login"
						className="mt-[28px] block h-[20px] w-full rounded text-center text-[24px] leading-[20px] text-white underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
					>
						Back to Login
					</Link>
				</form>
			</section>
		</main>
	);
}
