"use client";

import { useState } from "react";
import Link from "next/link";
import { Hammersmith_One, Inter } from "next/font/google";

// Fonts come from the Figma design (Inter for body, Hammersmith One for the
// card heading). Scoped to this page so the app-wide Geist stack is untouched.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hammersmith = Hammersmith_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hammersmith",
});

type FieldErrors = {
  username?: string;
  password?: string;
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">(
    "idle",
  );

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!username.trim()) next.username = "Username is required.";
    if (!password) next.password = "Password is required.";
    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    // No backend yet: simulate the request boundary so the loading state is real.
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("submitted");
  }

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
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="username"
            className="mt-[36px] block text-[24px] leading-[20px] text-white"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? "username-error" : undefined}
            className="mt-[19px] block h-[54px] w-full rounded-[15px] bg-[rgba(24,7,71,0.41)] px-[16px] text-[20px] text-white caret-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          />
          {errors.username ? (
            <p
              id="username-error"
              role="alert"
              className="mt-[6px] text-[14px] text-[#ffd9d9]"
            >
              {errors.username}
            </p>
          ) : null}

          <label
            htmlFor="password"
            className="mt-[78px] block text-[24px] leading-[20px] text-white"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="mt-[21px] block h-[54px] w-full rounded-[15px] bg-[rgba(24,7,71,0.41)] px-[16px] text-[20px] text-white caret-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          />
          {errors.password ? (
            <p
              id="password-error"
              role="alert"
              className="mt-[6px] text-[14px] text-[#ffd9d9]"
            >
              {errors.password}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-[43px] mx-auto block h-[51px] w-[260px] max-w-full rounded-[15px] bg-[#32428e] text-[24px] leading-[20px] text-white transition-colors hover:bg-[#3a4ca6] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none disabled:opacity-70"
          >
            {status === "submitting" ? "Signing In…" : "Sign In"}
          </button>

          <Link
            href="/reset"
            className="mt-[28px] block h-[20px] w-full rounded text-center text-[24px] leading-[20px] text-white underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
          >
            Reset Password
          </Link>

          <p aria-live="polite" className="sr-only">
            {status === "submitted" ? "Signed in." : ""}
          </p>
        </form>
      </section>
    </main>
  );
}
