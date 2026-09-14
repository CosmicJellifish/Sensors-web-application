"use client";

import { useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const icons = {
	pause: "https://www.figma.com/api/mcp/asset/98169763-b425-4f26-a65f-a18af587d4c7.svg",
	stop: "https://www.figma.com/api/mcp/asset/688ca0ff-ebc4-4949-a66b-a3b176de09da.svg",
	avatar: "https://www.figma.com/api/mcp/asset/419b40cb-74f8-4d06-994b-4052486dab6c.svg",
	overview: "https://www.figma.com/api/mcp/asset/72cb9a49-d688-43c8-ab43-2776396e43e6.svg",
	bluetooth: "https://www.figma.com/api/mcp/asset/021823b4-bd60-448f-afad-6a0ba2b546a9.svg",
	live: "https://www.figma.com/api/mcp/asset/04341a4d-559e-4f5c-9092-a0759438e2a9.svg",
	history: "https://www.figma.com/api/mcp/asset/31cc35b7-b5c6-4160-8521-92311dcbe679.svg",
	download: "https://www.figma.com/api/mcp/asset/4ebc6288-2cf8-4599-a111-4a9519e32bab.svg",
	settings: "https://www.figma.com/api/mcp/asset/45382f25-26b7-4921-bb26-6f6e23131a84.svg",
};

type IconName = keyof typeof icons;

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
	return <img src={icons[name]} alt="" aria-hidden="true" className={`object-contain ${className}`} />;
}

const navigation: { label: string; icon: IconName; href: string }[] = [
	{ label: "Overview", icon: "overview", href: "/overview" },
	{ label: "Bluetooth Devices", icon: "bluetooth", href: "/bluetooth" },
	{ label: "Live Test", icon: "live", href: "/live" },
	{ label: "Test History", icon: "history", href: "/testing" },
	{ label: "Data Export", icon: "download", href: "/export" },
	{ label: "Device Settings", icon: "settings", href: "/settings" },
];

const streamRows = [
	["10:42:15.00", "12.1", "11.8", "22.4", "45.2"],
	["10:42:14.50", "12.2", "11.7", "22.4", "45.2"],
	["10:42:14.00", "12.1", "11.8", "22.3", "45.3"],
];

function Sidebar({ announce }: { announce: (message: string) => void }) {
	return (
		<aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col bg-gradient-to-b from-[#2757d2] from-[15.385%] to-[#abc1f8] to-[76.923%] shadow-[0_1px_1px_rgba(0,0,0,0.05)] lg:flex">
			<div className="h-[104px] px-6 pt-8"><h1 className="text-[20px] font-bold leading-7 tracking-[-0.5px] text-white">Electrochemical<br />Sensor Monitor</h1><p className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-black">PRECISION DATA SUITE</p></div>
			<div className="relative h-[119px] w-full"><Icon name="avatar" className="absolute left-2 top-[18px] size-[92px]" /><span className="absolute left-[82px] top-7 text-[16px] leading-5 text-white">Account Name</span><button type="button" onClick={() => announce("Logged out")} className="absolute left-[104px] top-[65px] rounded-[15px] bg-[#941313] px-2 text-[13px] leading-[17px] text-white">Log out</button></div>
			<nav aria-label="Primary navigation" className="flex flex-col">{navigation.map((item) => item.label === "Live Test" ? <div key={item.label} className="flex items-center gap-4 border-r-4 border-[#272eb2] bg-[rgba(240,243,255,0.5)] px-6 py-3 text-[14px] font-bold text-black"><Icon name={item.icon} className="size-[18px] brightness-0" />{item.label}</div> : <Link key={item.label} href={item.href} className="flex items-center gap-4 px-6 py-3 text-[14px] text-white hover:bg-white/10"><Icon name={item.icon} className="size-5" />{item.label}</Link>)}</nav>
		</aside>
	);
}

function RangeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
	return <button type="button" onClick={onClick} className={`rounded border px-[13px] py-[5px] text-[12px] font-medium leading-4 ${active ? "border-[#006c49] bg-[rgba(0,108,73,0.1)] text-[#006c49]" : "border-[#bbcabf] text-[#3c4a42]"}`}>{label}</button>;
}

export default function LiveTestPage() {
	const [isPaused, setIsPaused] = useState(false);
	const [isStopped, setIsStopped] = useState(false);
	const [range, setRange] = useState("15m");
	const [message, setMessage] = useState("");

	function announce(nextMessage: string) {
		setMessage(nextMessage);
		window.setTimeout(() => setMessage(""), 2500);
	}

	return (
		<main className={`${inter.variable} min-h-dvh bg-[#f9f9ff] font-[family-name:var(--font-inter)] text-[#151c27]`}>
			<Sidebar announce={announce} />
			<div className="min-h-dvh lg:pl-64"><div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 p-4 sm:p-6">
				<header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><h2 className="text-[30px] font-bold leading-10 tracking-[-0.72px] sm:text-[36px] sm:leading-[44px]">Live Test</h2><p className="text-[15px] leading-6 text-[#3c4a42] sm:text-[16px]">Real-time data acquisition workspace</p><div className="flex flex-wrap items-center gap-4 pt-1"><span className="rounded-full border border-[#bbcabf] bg-[#e7eefe] px-[13px] py-[5px] text-[12px] font-medium leading-4 text-[#3c4a42]">Simulated Sweat Solution</span><span className="rounded-full border border-[#bbcabf] bg-[#e7eefe] px-[13px] py-[5px] font-mono text-[12px] leading-4 text-[#3c4a42]">Elapsed: 00:15:30</span><span className={`flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-medium leading-4 ${isStopped ? "bg-[rgba(186,26,26,0.1)] text-[#ba1a1a]" : "bg-[rgba(16,185,129,0.1)] text-[#10b981]"}`}><span className={`size-2 rounded-full ${isStopped ? "bg-[#ba1a1a]" : "bg-[#10b981]"}`} />{isStopped ? "Stopped" : isPaused ? "Paused" : "Recording"}</span></div></div><div className="flex gap-3"><button type="button" onClick={() => { setIsPaused(!isPaused); announce(isPaused ? "Test resumed" : "Test paused"); }} disabled={isStopped} className="flex items-center gap-2 rounded border border-[#bbcabf] bg-[#f9f9ff] px-[17px] py-[9px] text-[14px] font-medium hover:bg-white disabled:opacity-50"><Icon name="pause" className="size-[9px]" />{isPaused ? "Resume Test" : "Pause Test"}</button><button type="button" onClick={() => { setIsStopped(true); announce("Test stopped"); }} disabled={isStopped} className="flex items-center gap-2 rounded bg-[#ba1a1a] px-4 py-[9px] text-[14px] font-medium text-white hover:bg-[#991b1b] disabled:opacity-50"><Icon name="stop" className="size-[8px]" />Stop Test</button></div></header>
				{message ? <p role="status" className="-mt-4 text-sm text-[#006c49]">{message}</p> : null}

				<section className="rounded-lg border border-[#bbcabf] bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-6"><div className="border-b border-[#bbcabf] pb-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-[20px] font-semibold leading-7">Current Response Over Time</h3><div className="flex gap-2">{["1m", "5m", "15m", "Full"].map((label) => <RangeButton key={label} label={label} active={range === label} onClick={() => setRange(label)} />)}</div></div></div><div className="flex gap-8 py-5"><Stat label="DIFF" value="0.6" /><Stat label="MAX" value="12.8" /><Stat label="MIN" value="11.2" /></div><div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded border border-[#bbcabf] bg-[#f0f3ff] p-4"><div className="absolute inset-0 flex flex-col justify-between py-4 opacity-20">{Array.from({ length: 5 }, (_, index) => <div key={index} className="border-t border-[#6c7a71]" />)}</div><div className="relative flex gap-4 text-[16px] text-[#3c4a42]"><span className="flex items-center gap-2"><span className="size-3 rounded-full bg-[#fea619]" />Input (Yellow)</span><span className="flex items-center gap-2"><span className="size-3 rounded-full bg-[#10b981]" />Output (Green)</span></div></div></section>

				<section className="grid grid-cols-1 gap-6 md:grid-cols-2"><ChartCard title="Temperature" color="yellow" /><ChartCard title="Humidity" color="green" /></section>

				<section className="overflow-hidden rounded-lg border border-[#bbcabf] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"><h3 className="border-b border-[#bbcabf] px-6 py-6 text-[20px] font-semibold leading-7">Real-time Data Stream</h3><div className="overflow-x-auto"><table className="min-w-[760px] w-full border-collapse"><thead className="bg-[#f0f3ff] text-left text-[12px] font-medium tracking-[0.6px] text-[#3c4a42]"><tr>{["TIMESTAMP", "INPUT (µA)", "OUTPUT (µA)", "TEMP (°C)", "HUMIDITY (%)", "STATUS"].map((heading) => <th key={heading} className="px-6 py-3 font-medium">{heading}</th>)}</tr></thead><tbody>{streamRows.map((row) => <tr key={row[0]} className="border-t border-[#bbcabf] text-[14px]"><td className="px-6 py-3 font-mono">{row[0]}</td>{row.slice(1).map((value) => <td key={`${row[0]}-${value}`} className="px-6 py-3">{value}</td>)}<td className="px-6 py-3"><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#10b981]" />OK</span></td></tr>)}</tbody></table></div></section>
			</div></div>
		</main>
	);
}

function Stat({ label, value }: { label: string; value: string }) {
	return <div><p className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-[#3c4a42]">{label}</p><p className="flex items-baseline gap-1 text-[32px] font-medium leading-10 tracking-[-0.32px]">{value}<span className="text-[14px] text-[#3c4a42]">µA</span></p></div>;
}

function ChartCard({ title, color }: { title: string; color: "yellow" | "green" }) {
	const isGreen = color === "green";
	return <article className="relative rounded-lg border border-[#bbcabf] bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]"><div className="border-b border-[#bbcabf] pb-2"><h3 className="text-[20px] font-semibold leading-7">{title}</h3></div><div className={`mt-4 flex h-[160px] items-center justify-center rounded border border-[#bbcabf] bg-[#f0f3ff] text-[16px] ${isGreen ? "text-[#10b981]" : "text-[#fea619]"}`}>[ {isGreen ? "Green" : "Yellow"} Line Chart Placeholder ]</div><span className={`absolute right-6 top-6 rounded border px-[9px] py-[5px] text-[12px] font-semibold tracking-[0.6px] ${isGreen ? "border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.1)] text-[#10b981]" : "border-[rgba(254,166,25,0.2)] bg-[rgba(254,166,25,0.1)] text-[#fea619]"}`}>Simulated Data</span></article>;
}
