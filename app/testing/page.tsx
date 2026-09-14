"use client";

import { useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const icons = {
	filter: "https://www.figma.com/api/mcp/asset/6db87d33-7eca-42a1-beae-cdb1e4c8c8f3.svg",
	moreFilters: "https://www.figma.com/api/mcp/asset/f440595d-867b-42ce-96e1-21ff1988ae5e.svg",
	compare: "https://www.figma.com/api/mcp/asset/439b8210-4d34-4f8c-b066-30ab3403a0b1.svg",
	export: "https://www.figma.com/api/mcp/asset/9acf034a-8aba-4884-8e1c-fb2f177eb682.svg",
	overview: "https://www.figma.com/api/mcp/asset/72cb9a49-d688-43c8-ab43-2776396e43e6.svg",
	bluetooth: "https://www.figma.com/api/mcp/asset/021823b4-bd60-448f-afad-6a0ba2b546a9.svg",
	live: "https://www.figma.com/api/mcp/asset/04341a4d-559e-4f5c-9092-a0759438e2a9.svg",
	history: "https://www.figma.com/api/mcp/asset/31cc35b7-b5c6-4160-8521-92311dcbe679.svg",
	download: "https://www.figma.com/api/mcp/asset/4ebc6288-2cf8-4599-a111-4a9519e32bab.svg",
	settings: "https://www.figma.com/api/mcp/asset/45382f25-26b7-4921-bb26-6f6e23131a84.svg",
	avatar: "https://www.figma.com/api/mcp/asset/6574306a-2c62-4793-891b-5bdc0de81b54.svg",
	chart: "https://www.figma.com/api/mcp/asset/ca45db86-e1ce-40e7-9f93-663f097843ad.svg",
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

const sessions = [
	{ name: ["Sweat", "Test 01"], date: ["Oct", "24,", "2023"], duration: ["45m"], environment: ["Simulated", "Sweat"], device: ["Hub", "01"], status: "Completed", tone: "success" },
	{ name: ["Lactate", "Calibration", "B"], date: ["Oct", "23,", "2023"], duration: ["2h", "15m"], environment: ["Buffer Sol", "(pH 7.4)"], device: ["Hub", "02"], status: "Completed", tone: "success" },
	{ name: ["Glucose", "Run 4"], date: ["Oct", "21,", "2023"], duration: ["1h", "30m"], environment: ["In Vivo"], device: ["Hub", "01"], status: "Warning: Baseline Shift", tone: "warning" },
	{ name: ["Stress", "Test Temp"], date: ["Oct", "19,", "2023"], duration: ["10m"], environment: ["Oven 37C"], device: ["Alpha", "Proto"], status: "Terminated", tone: "danger" },
	{ name: ["Stability", "Run A"], date: ["Oct", "18,", "2023"], duration: ["24h", "0m"], environment: ["Ambient"], device: ["Hub", "02"], status: "Completed", tone: "success" },
];

function Lines({ values }: { values: string[] }) {
	return <span className="flex flex-col">{values.map((value) => <span key={value}>{value}</span>)}</span>;
}

function Status({ tone, children }: { tone: string; children: string }) {
	const colors = tone === "warning" ? "bg-[rgba(254,166,25,0.2)] text-[#684000]" : tone === "danger" ? "bg-[rgba(186,26,26,0.1)] text-[#ba1a1a]" : "bg-[rgba(0,108,73,0.1)] text-[#006c49]";
	return <span className={`inline-flex max-w-[92px] rounded-full px-2 py-1 text-[12px] font-medium leading-4 ${colors}`}>{children}</span>;
}

export default function TestHistoryPage() {
	const [message, setMessage] = useState("");
	const [selectedSession, setSelectedSession] = useState(sessions[0]);

	function announce(nextMessage: string) {
		setMessage(nextMessage);
		window.setTimeout(() => setMessage(""), 2500);
	}

	return (
		<main className={`${inter.variable} min-h-dvh bg-[#f9f9ff] font-[family-name:var(--font-inter)] text-[#151c27]`}>
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col bg-gradient-to-b from-[#2757d2] from-[15.385%] to-[#abc1f8] to-[76.923%] shadow-[0_1px_1px_rgba(0,0,0,0.05)] lg:flex">
				<div className="h-[98px] px-6 pt-8"><h1 className="text-[20px] font-bold leading-7 tracking-[-0.5px] text-white">Electrochemical<br />Sensor Monitor</h1><p className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-black">PRECISION DATA SUITE</p></div>
				<div className="relative h-[129px] w-full"><Icon name="avatar" className="absolute left-2 top-[18px] size-[92px]" /><span className="absolute left-[82px] top-7 text-[16px] leading-5 text-white">Account Name</span><button type="button" onClick={() => announce("Logged out")} className="absolute left-[104px] top-[65px] rounded-[15px] bg-[#941313] px-2 text-[13px] leading-[17px] text-white">Log out</button></div>
				<nav aria-label="Primary navigation" className="flex flex-col">{navigation.map((item) => item.label === "Test History" ? <div key={item.label} className="flex items-center gap-4 border-r-4 border-[#272eb2] bg-[rgba(240,243,255,0.5)] px-6 py-3 text-[14px] font-bold text-black"><Icon name={item.icon} className="size-[18px] brightness-0" />{item.label}</div> : <Link key={item.label} href={item.href} className="flex items-center gap-4 px-6 py-3 text-[14px] text-white hover:bg-white/10"><Icon name={item.icon} className="size-5" />{item.label}</Link>)}</nav>
			</aside>

			<div className="min-h-dvh lg:pl-64"><div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 p-4 sm:p-6">
				<header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
					<div><h2 className="text-[30px] font-bold leading-10 tracking-[-0.72px] sm:text-[36px] sm:leading-[44px]">Test History</h2><p className="text-[15px] leading-6 text-[#3c4a42] sm:text-[16px]">Review and analyze past sensor sessions.</p></div>
					<div className="flex flex-wrap gap-3"><Filter label="Last 7 Days" /><Filter label="All Environments" /><Filter label="All Devices" /></div>
				</header>
				{message ? <p role="status" className="text-sm text-[#006c49]">{message}</p> : null}

				<section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
					<article className="overflow-hidden rounded-lg border border-[#bbcabf] bg-[#f9f9ff] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
						<div className="flex items-center justify-between border-b border-[#bbcabf] px-4 py-4"><h3 className="text-[20px] font-semibold leading-7">Recent Sessions</h3><button type="button" onClick={() => announce("More filters opened")} className="flex items-center gap-1 text-[12px] font-medium text-[#3c4a42]"><Icon name="moreFilters" className="h-[7px] w-[11px]" />More Filters</button></div>
						<div className="overflow-x-auto"><table className="min-w-[720px] w-full border-collapse text-left"><thead className="bg-[#f0f3ff] text-[12px] font-medium tracking-[0.6px] text-[#3c4a42]"><tr>{["Test Name", "Date", "Duration", "Environment", "Device", "Status", "Action"].map((heading) => <th key={heading} className="px-4 py-3 font-medium">{heading}</th>)}</tr></thead><tbody>{sessions.map((session) => <tr key={session.name.join(" ")} className="border-t border-[#bbcabf] align-top"><td className="px-4 py-5 text-[16px] font-medium leading-6"> <button type="button" onClick={() => setSelectedSession(session)} className="text-left hover:text-[#006c49]"><Lines values={session.name} /></button></td><td className="px-4 py-3 text-[16px] leading-6 text-[#3c4a42]"><Lines values={session.date} /></td><td className="px-4 py-6 text-[16px] leading-6 text-[#3c4a42]"><Lines values={session.duration} /></td><td className="px-4 py-5 text-[16px] leading-6 text-[#3c4a42]"><Lines values={session.environment} /></td><td className="px-4 py-5 text-[16px] leading-6 text-[#3c4a42]"><Lines values={session.device} /></td><td className="px-4 py-5"><Status tone={session.tone}>{session.status}</Status></td><td className="px-4 py-6 text-right"><button type="button" onClick={() => { setSelectedSession(session); announce(`${session.name.join(" ")} selected`); }} className="text-[12px] font-semibold tracking-[0.6px] text-[#006c49]">VIEW</button></td></tr>)}</tbody></table></div>
					</article>

					<aside className="overflow-hidden rounded-lg border border-[#bbcabf] bg-[#f9f9ff] shadow-[0_1px_3px_rgba(0,0,0,0.05)]"><div className="flex items-start justify-between border-b border-[#bbcabf] p-4"><div><h3 className="text-[20px] font-semibold leading-7">{selectedSession.name.join(" ")}</h3><p className="text-[12px] font-medium leading-4 text-[#3c4a42]">Oct 24, 2023 • 14:30 - 15:15</p></div><Status tone="success">Completed</Status></div><div className="space-y-4 p-4"><div className="grid grid-cols-2 gap-3">{[["Environment", "Simulated", "Sweat"], ["Device", "Hub 01"], ["Duration", "45m"], ["Peak Current", "12.4 µA"]].map(([label, ...values]) => <div key={label} className="min-h-[70px] border border-[#bbcabf] bg-white p-3"><p className="text-[12px] font-medium leading-4 text-[#3c4a42]">{label}</p><p className="mt-1 text-[14px] font-medium leading-5"><Lines values={values} /></p></div>)}</div><div><h4 className="mb-2 text-[12px] font-semibold leading-4 tracking-[0.6px] text-[#3c4a42]">CHRONOAMPEROMETRY</h4><div className="h-[192px] border border-[#bbcabf] bg-white p-2"><Icon name="chart" className="size-full" /></div></div><div><h4 className="mb-2 text-[12px] font-semibold leading-4 tracking-[0.6px] text-[#3c4a42]">OPERATOR NOTES</h4><p className="min-h-[100px] bg-[#f0f3ff] p-3 text-[14px] leading-5 text-[#3c4a42]">Test completed successfully without baseline drift. Sensor pre-conditioning time was standard (5 mins). Ready for batch analysis.</p></div></div><div className="flex gap-3 border-t border-[#bbcabf] p-4"><button type="button" onClick={() => announce("Comparison ready")} className="flex-1 border border-[#bbcabf] bg-[#f9f9ff] py-2 text-[12px] font-semibold tracking-[0.6px]"><Icon name="compare" className="mr-2 inline-block h-[11px] w-[11px]" />COMPARE</button><button type="button" onClick={() => announce("Session exported")} className="flex-1 bg-[#006c49] py-2 text-[12px] font-semibold tracking-[0.6px] text-white"><Icon name="export" className="mr-2 inline-block h-[10px] w-[10px]" />EXPORT</button></div></aside>
				</section>
			</div></div>
		</main>
	);
}

function Filter({ label }: { label: string }) {
	return <button type="button" className="relative flex min-w-[160px] items-center justify-between border border-[#bbcabf] bg-[#f9f9ff] px-[13px] py-[9px] text-left text-[16px] leading-6 text-[#3c4a42] hover:bg-white"><span>{label}</span><Icon name="filter" className="size-4" /></button>;
}
