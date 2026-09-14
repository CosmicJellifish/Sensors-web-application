"use client";

import { useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const icons = {
	export: "https://www.figma.com/api/mcp/asset/c09eeb7a-1540-4b8e-9048-a0537b87cb76.svg",
	play: "https://www.figma.com/api/mcp/asset/ed458928-95c1-4a26-a6c8-6ee3edc6803f.svg",
	input: "https://www.figma.com/api/mcp/asset/6564fd6f-a0c5-42a4-80fa-5573bd023cce.svg",
	trendUp: "https://www.figma.com/api/mcp/asset/6f6c2b4d-467f-4501-bc41-75fef22a9b9e.svg",
	output: "https://www.figma.com/api/mcp/asset/76b8b7a4-bb06-49dd-b0b3-cce0ce2c5dbc.svg",
	temperature: "https://www.figma.com/api/mcp/asset/35db1fcd-8137-4349-9ff4-bf364f1fad67.svg",
	humidity: "https://www.figma.com/api/mcp/asset/179970a4-f58a-40cc-9a2f-e853130dffe2.svg",
	chart: "https://www.figma.com/api/mcp/asset/6ef2ccb4-14b9-41e7-ab04-8b2e750c99fd.svg",
	overview: "https://www.figma.com/api/mcp/asset/da0a8949-03a7-4594-a0a6-678401595d1e.svg",
	bluetooth: "https://www.figma.com/api/mcp/asset/021823b4-bd60-448f-afad-6a0ba2b546a9.svg",
	live: "https://www.figma.com/api/mcp/asset/04341a4d-559e-4f5c-9092-a0759438e2a9.svg",
	history: "https://www.figma.com/api/mcp/asset/31cc35b7-b5c6-4160-8521-92311dcbe679.svg",
	download: "https://www.figma.com/api/mcp/asset/4ebc6288-2cf8-4599-a111-4a9519e32bab.svg",
	settings: "https://www.figma.com/api/mcp/asset/45382f25-26b7-4921-bb26-6f6e23131a84.svg",
	avatar: "https://www.figma.com/api/mcp/asset/d9923319-ad16-4d2f-b5f3-38202d93c4d5.svg",
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

const metrics = [
	{ icon: "input" as IconName, label: "INPUT CURRENT", value: "12.4", unit: "µA", change: "+0.2 µA", chart: "chart" as IconName },
	{ icon: "output" as IconName, label: "OUTPUT CURRENT", value: "11.8", unit: "µA", change: "-0.1 µA", chart: "chart" as IconName },
	{ icon: "temperature" as IconName, label: "TEMPERATURE", value: "25.0", unit: "°C", change: "Stable", chart: "chart" as IconName, simulated: true },
	{ icon: "humidity" as IconName, label: "HUMIDITY", value: "55", unit: "% RH", change: "+1%", chart: "chart" as IconName, simulated: true },
];

function MetricCard({ metric }: { metric: (typeof metrics)[number] }) {
	return (
		<article className="relative min-h-[209px] rounded-lg border border-[#bbcabf] bg-white p-5 shadow-[0_1px_1.5px_rgba(0,0,0,0.02)]">
			<div className="flex items-center gap-2 pr-20">
				<Icon name={metric.icon} className="h-[15px] w-[15px]" />
				<p className="text-[12px] font-medium leading-4 tracking-[0.6px] text-[#3c4a42]">{metric.label}</p>
			</div>
			<span className="absolute right-4 top-4 rounded-full border border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.1)] px-2 py-1 text-[10px] leading-4 text-[#10b981]">
				{metric.simulated ? "Simulated" : "Live via Bluetooth"}
			</span>
			<p className="mt-1 flex items-baseline gap-1 text-[#151c27]">
				<strong className="text-[36px] leading-[44px] tracking-[-0.9px]">{metric.value}</strong>
				<span className="text-[16px] font-medium text-[#3c4a42]">{metric.unit}</span>
			</p>
			<div className="mt-1 h-12 overflow-hidden"><Icon name={metric.chart} className="h-full w-full" /></div>
			<div className="mt-2 flex items-center justify-between border-t border-[#dce2f3] pt-3 text-[10px] leading-5">
				<span className={`flex items-center gap-1 ${metric.simulated ? "text-[#f59e0b]" : "text-[#10b981]"}`}><Icon name="trendUp" className="h-[7px] w-3" />{metric.change}</span>
				<span className="text-[#3c4a42]">Last updated: 2s ago</span>
			</div>
		</article>
	);
}

export default function OverviewPage() {
	const [message, setMessage] = useState("");

	function announce(nextMessage: string) {
		setMessage(nextMessage);
		window.setTimeout(() => setMessage(""), 2500);
	}

	return (
		<main className={`${inter.variable} min-h-dvh bg-[#f9f9ff] font-[family-name:var(--font-inter)] text-[#151c27]`}>
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col bg-gradient-to-b from-[#2757d2] from-[15.385%] to-[#abc1f8] to-[76.923%] shadow-[0_1px_1px_rgba(0,0,0,0.05)] lg:flex">
				<div className="h-[98px] px-6 pt-8"><h1 className="text-[20px] font-bold leading-7 tracking-[-0.5px] text-white">Electrochemical<br />Sensor Monitor</h1><p className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-black">PRECISION DATA SUITE</p></div>
				<div className="relative h-[129px] w-full"><Icon name="avatar" className="absolute left-2 top-[18px] size-[92px]" /><span className="absolute left-[82px] top-7 text-[16px] leading-5 text-white">Account Name</span><button type="button" onClick={() => announce("Logged out") } className="absolute left-[104px] top-[65px] rounded-[15px] bg-[#941313] px-2 text-[13px] leading-[17px] text-white">Log out</button></div>
				<nav aria-label="Primary navigation" className="flex flex-col">{navigation.map((item) => item.label === "Overview" ? <div key={item.label} className="flex items-center gap-4 border-r-4 border-[#272eb2] bg-[rgba(240,243,255,0.5)] px-6 py-3 text-[14px] font-bold text-black"><Icon name={item.icon} className="size-[18px] brightness-0" />{item.label}</div> : <Link key={item.label} href={item.href} className="flex items-center gap-4 px-6 py-3 text-[14px] text-white hover:bg-white/10"><Icon name={item.icon} className="size-5" />{item.label}</Link>)}</nav>
			</aside>

			<div className="min-h-dvh lg:pl-64"><div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 p-4 sm:p-6">
				<header className="flex flex-col gap-5 border-b border-[#bbcabf] pb-6 xl:flex-row xl:items-end xl:justify-between">
					<div><div className="flex flex-wrap items-center gap-3"><h2 className="text-[30px] font-semibold leading-8 tracking-[-0.24px] sm:text-[36px] sm:leading-10">System<br />Overview</h2><span className="rounded border border-[#bbcabf] bg-[#dce2f3] px-2 py-1 text-[12px] font-semibold leading-4 tracking-[0.6px] text-[#3c4a42]">SIMULATED SWEAT<br />TEST</span></div><p className="mt-2 text-[14px] leading-5 text-[#3c4a42]">Potentiostat and environmental sensor monitoring</p></div>
					<div className="flex flex-wrap items-center gap-3"><div className="flex items-center gap-6 border-r border-[#bbcabf] pr-6"><div><p className="text-[12px] font-medium leading-4 tracking-[0.6px] text-[#3c4a42]">ELAPSED TIME</p><p className="font-mono text-[20px] font-bold leading-7">00:12:45</p></div><div><p className="text-[12px] font-medium leading-4 tracking-[0.6px] text-[#3c4a42]">STATUS</p><p className="flex items-center gap-2 pt-1 text-[14px] font-medium leading-5 text-[#006c49]"><span className="size-3 rounded-full bg-[#10b981]" />Connected <span className="text-[12px] text-[#3c4a42]">(Hub 01)</span></p></div></div><button type="button" onClick={() => announce("Data export is ready") } className="rounded-lg border border-[#bbcabf] bg-white px-4 py-2 text-[14px] font-medium leading-5 hover:bg-[#f0f3ff]"><Icon name="export" className="mr-2 inline-block size-3" />Export<br />Data</button><button type="button" onClick={() => announce("New test started") } className="rounded-lg bg-[#10b981] px-4 py-2 text-[14px] font-medium leading-5 text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#0d9f70]"><Icon name="play" className="mr-2 inline-block h-3 w-2" />Start New<br />Test</button></div>
				</header>
				{message ? <p role="status" className="-mb-2 text-sm text-[#006c49]">{message}</p> : null}

				<section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</section>

				<section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(250px,1fr)]">
					<article className="overflow-hidden rounded-lg border border-[#bbcabf] bg-white"><div className="flex items-center justify-between border-b border-[#dce2f3] bg-[#f9f9ff] px-5 py-3"><h3 className="text-[20px] font-semibold leading-7">Current Response Preview</h3><button type="button" onClick={() => announce("Live test opened")} className="text-[12px] font-medium text-[#006c49]">View Live Test →</button></div><div className="h-[360px] p-5 sm:h-[420px]"><img src={icons.chart} alt="Current response chart" className="size-full object-contain" /></div></article>
					<div className="flex flex-col gap-5"><article className="rounded-lg border border-[#bbcabf] bg-white"><h3 className="border-b border-[#dce2f3] bg-[#f9f9ff] px-4 py-3 text-[12px] font-semibold leading-4 tracking-[0.6px] text-[#3c4a42]">SYSTEM STATUS</h3><div className="divide-y divide-[#dce2f3] px-4">{[["◧", "Power", "98% (AC Connected)"], ["⌁", "BLE Signal", "-45 dBm"], ["◉", "Hub CPU Load", "12%"], ["♨", "Hub Temp", "32°C"]].map(([icon, label, value]) => <div key={label} className="flex items-center justify-between py-3 text-[14px]"><span className="flex items-center gap-2 text-[#3c4a42]"><span>{icon}</span>{label}</span><strong className="text-right font-medium">{value}</strong></div>)}</div></article><article className="rounded-lg border border-[#bbcabf] bg-white"><div className="flex items-center justify-between border-b border-[#dce2f3] bg-[#f9f9ff] px-4 py-3"><h3 className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-[#3c4a42]">RECENT EVENTS</h3><button type="button" onClick={() => announce("Showing all events")} className="text-[12px] font-medium text-[#006c49]">View All</button></div><div className="divide-y divide-[#dce2f3] px-4">{[["◉", "Test sequence started", "12 mins ago • Profile: Simulated Sweat"], ["♢", "Device connected", "14 mins ago • Microcontroller Hub 01"], ["⚙", "Calibration complete", "15 mins ago • Auto-routine"], ["△", "Minor voltage drift detected", ""]].map(([icon, title, detail]) => <div key={title} className="flex gap-3 py-3 text-[12px]"><span className="text-[#10b981]">{icon}</span><div><p className="font-medium">{title}</p>{detail ? <p className="text-[#3c4a42]">{detail}</p> : null}</div></div>)}</div></article></div>
				</section>
			</div></div>
		</main>
	);
}
