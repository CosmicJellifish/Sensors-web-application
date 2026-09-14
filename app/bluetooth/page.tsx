"use client";

import { useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const icons = {
	scan: "https://www.figma.com/api/mcp/asset/f537c529-d4ab-43a6-a36a-cfc44fcae9bc.svg",
	alert: "https://www.figma.com/api/mcp/asset/81dcc72e-5494-4d75-98c1-7a4b7b6bf3e0.svg",
	hub: "https://www.figma.com/api/mcp/asset/7a48d9ad-f0f5-48d7-9bde-2082a8fd404b.svg",
	bluetooth: "https://www.figma.com/api/mcp/asset/d05cad25-da45-4964-8a86-5cf2e75f78a7.svg",
	signal: "https://www.figma.com/api/mcp/asset/71e8b0c4-e68f-4d72-afaa-98d13547f216.svg",
	connected: "https://www.figma.com/api/mcp/asset/92775e45-ce27-4f59-8301-11fc57d0e7be.svg",
	disconnect: "https://www.figma.com/api/mcp/asset/7861d68c-b75e-46ff-a212-007e7efed84b.svg",
	battery: "https://www.figma.com/api/mcp/asset/c11c2f4a-50bb-4609-8da6-e86f79baa3e4.svg",
	active: "https://www.figma.com/api/mcp/asset/cf2a8cfe-0fd3-4f52-b8c8-6bf963c7b18a.svg",
	input: "https://www.figma.com/api/mcp/asset/abb66fc1-6834-4a4b-815a-c26adb9e6b5f.svg",
	output: "https://www.figma.com/api/mcp/asset/bdedfbf9-0fe1-4043-8ca7-2e05db8ad599.svg",
	temperature: "https://www.figma.com/api/mcp/asset/1b7c4ad2-38ac-44b8-b6e2-9b4aec2edb04.svg",
	humidity: "https://www.figma.com/api/mcp/asset/37385885-79e6-4af5-9c19-605e7bd735cb.svg",
	avatar: "https://www.figma.com/api/mcp/asset/d9923319-ad16-4d2f-b5f3-38202d93c4d5.svg",
	overview: "https://www.figma.com/api/mcp/asset/72cb9a49-d688-43c8-ab43-2776396e43e6.svg",
	live: "https://www.figma.com/api/mcp/asset/a9a5091d-586a-4419-8ce0-65f0c668a0d9.svg",
	history: "https://www.figma.com/api/mcp/asset/95a3039f-dc40-447b-a28b-97623ebe4a87.svg",
	export: "https://www.figma.com/api/mcp/asset/09ed0ac5-0b27-4b4f-b3db-c0cdbab9c8b3.svg",
	settings: "https://www.figma.com/api/mcp/asset/49d6feed-e547-494a-a57f-53c7288cf6de.svg",
};

type IconName = keyof typeof icons;

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
	return <img src={icons[name]} alt="" aria-hidden="true" className={`object-contain ${className}`} />;
}

const navItems: { label: string; icon: IconName; href: string }[] = [
	{ label: "Overview", icon: "overview", href: "/overview" },
	{ label: "Bluetooth Devices", icon: "bluetooth", href: "/bluetooth" },
	{ label: "Live Test", icon: "live", href: "/live" },
	{ label: "Test History", icon: "history", href: "/testing" },
	{ label: "Data Export", icon: "export", href: "/export" },
	{ label: "Device Settings", icon: "settings", href: "/settings" },
];

function ChannelCard({
	icon,
	title,
	detail,
	simulated = false,
}: {
	icon: IconName;
	title: string;
	detail: string;
	simulated?: boolean;
}) {
	return (
		<div className={`flex h-[62px] items-center gap-3 rounded border p-[13px] ${simulated ? "border-dashed border-[#bbcabf]" : "border-[#bbcabf]"}`}>
			<div className={`flex size-8 shrink-0 items-center justify-center rounded ${simulated ? "bg-[#dce2f3]" : "bg-[#e7eefe]"}`}>
				<Icon name={icon} className={icon === "temperature" ? "h-[15px] w-[8px]" : "h-[15px] w-[15px]"} />
			</div>
			<div>
				<p className={`text-[14px] font-medium leading-5 ${simulated ? "text-[#3c4a42]" : "text-[#151c27]"}`}>{title}</p>
				<p className={`font-mono text-[12px] leading-4 ${simulated ? "text-[#3c4a42] italic" : "text-[#3c4a42]"}`}>{detail}</p>
			</div>
		</div>
	);
}

export default function BluetoothDevicesPage() {
	const [connectionState, setConnectionState] = useState<"connected" | "lost" | "disconnected">("lost");
	const [scanMessage, setScanMessage] = useState("");
	const isConnected = connectionState === "connected";

	function handleScan() {
		setScanMessage("Scanning for nearby devices...");
		window.setTimeout(() => setScanMessage("Potentiostat Hub 01 is available."), 700);
	}

	return (
		<main className={`${inter.variable} min-h-dvh bg-[#f9f9ff] font-[family-name:var(--font-inter)] text-[#151c27]`}>
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col bg-gradient-to-b from-[#2757d2] from-[15.385%] to-[#abc1f8] to-[76.923%] shadow-[0_1px_1px_rgba(0,0,0,0.05)] lg:flex">
				<div className="h-[98px] px-6 pt-8">
					<h1 className="text-[20px] font-bold leading-7 tracking-[-0.5px] text-white">
						Electrochemical
						<br />
						Sensor Monitor
					</h1>
					<p className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-black">PRECISION DATA SUITE</p>
				</div>
				<div className="relative h-[129px] w-full">
					<Icon name="avatar" className="absolute left-2 top-[18px] size-[92px]" />
					<span className="absolute left-[82px] top-7 text-[16px] leading-5 text-white">Account Name</span>
					<button type="button" className="absolute left-[104px] top-[65px] rounded-[15px] bg-[#941313] px-2 text-[13px] leading-[17px] text-white">Log out</button>
				</div>
				<nav aria-label="Primary navigation" className="flex flex-col">
					{navItems.map((item) => {
						const active = item.label === "Bluetooth Devices";
						return active ? (
							<div key={item.label} className="flex items-center gap-4 border-r-4 border-[#272eb2] bg-[rgba(240,243,255,0.5)] px-6 py-3 text-[14px] font-bold text-black">
								<Icon name={item.icon} className="h-5 w-[12.7px] brightness-0" />
								{item.label}
							</div>
						) : (
							<Link key={item.label} href={item.href} className="flex items-center gap-4 px-6 py-3 text-[14px] text-white hover:bg-white/10">
								<Icon name={item.icon} className="size-5" />
								{item.label}
							</Link>
						);
					})}
				</nav>
			</aside>

			<div className="min-h-dvh lg:pl-64">
				<div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 p-4 sm:p-6">
					<header className="flex flex-col gap-5 border-b border-[#bbcabf] pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-[37px]">
						<div>
							<h2 className="text-[30px] font-bold leading-10 tracking-[-0.9px] sm:text-[36px] sm:leading-[44px]">Bluetooth Devices</h2>
							<p className="max-w-[672px] text-[15px] leading-6 text-[#3c4a42] sm:text-[16px]">Connect to the Bluetooth-enabled microcontroller hub to begin receiving real-time sensor measurements.</p>
						</div>
						<button type="button" onClick={handleScan} className="flex w-fit items-center gap-2 rounded bg-[#10b981] px-4 py-2.5 text-[14px] font-medium leading-5 text-white hover:bg-[#0d9f70] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]">
							<Icon name="scan" className="h-4 w-[15px]" />
							Scan for Devices
						</button>
					</header>

					{scanMessage ? <p role="status" className="-mt-2 text-sm text-[#006c49]">{scanMessage}</p> : null}

					{connectionState === "lost" ? (
						<div className="flex flex-col gap-4 rounded-lg border border-[rgba(186,26,26,0.2)] bg-[rgba(255,218,214,0.2)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-[17px]">
							<div className="flex items-center gap-3 text-[14px] leading-5 text-[#151c27]">
								<Icon name="alert" className="size-5" />
								<p><strong>Bluetooth connection lost.</strong> Live data collection has paused.</p>
							</div>
							<div className="flex gap-2">
								<button type="button" onClick={() => setConnectionState("connected")} className="rounded border border-[rgba(186,26,26,0.3)] bg-white px-[13px] py-1.5 text-[14px] font-medium leading-5 text-[#ba1a1a]">Reconnect</button>
								<button type="button" onClick={() => setConnectionState("disconnected")} className="rounded border border-[#e5e7eb] bg-white px-[13px] py-1.5 text-[14px] font-medium leading-5 text-[#1f2937]">Return to Simulation</button>
							</div>
						</div>
					) : null}

					<div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
						<section className="flex flex-col gap-5 xl:col-span-4">
							<h3 className="text-[20px] font-semibold leading-7">Available Devices</h3>
							<div className="rounded-lg border border-[#e5e7eb] bg-white p-[17px] shadow-[0_1px_1.5px_rgba(0,0,0,0.05)]">
								<div className="flex items-center gap-3">
									<div className="flex size-10 items-center justify-center rounded-full bg-[#e7eefe]"><Icon name="hub" className="h-[23px] w-6" /></div>
									<div>
										<h4 className="text-[14px] font-semibold leading-5">Potentiostat Hub 01</h4>
										<p className="flex items-center gap-1 text-[12px] font-medium leading-4 text-[#3c4a42]"><Icon name="bluetooth" className="h-3 w-2" /> Type: Hub</p>
									</div>
								</div>
								<div className="mt-4 flex items-center gap-4">
									<div><p className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-[#3c4a42]">Signal</p><p className="flex items-center gap-1 text-[14px] font-medium leading-5"><Icon name="signal" className="size-[13px]" />85%</p></div>
									<div><p className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-[#3c4a42]">Status</p><span className="rounded-full bg-[#e7eefe] px-2 py-0.5 text-[12px] font-medium leading-4 text-[#006c49]">Available</span></div>
								</div>
							</div>
						</section>

						<section className="flex flex-col gap-5 xl:col-span-8">
							<div className="flex items-center justify-between"><h3 className="text-[20px] font-semibold leading-7">Active Connection</h3><span className="flex items-center gap-1 rounded-full border border-[#bbf7d0] bg-[#dcfce7] px-2 py-1 text-[12px] font-medium leading-4 text-[#166534]"><span className="size-2 rounded-full bg-[#22c55e]" />{isConnected ? "Connected" : "Disconnected"}</span></div>
							<div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
								<div className="border-b border-[#bbcabf] bg-[rgba(249,249,255,0.5)] px-6 py-6">
									<div className="flex items-start justify-between gap-4"><div><h4 className="flex items-center gap-2 text-[22px] font-semibold leading-8 sm:text-[24px]"><Icon name="connected" className="h-[15px] w-5" />Potentiostat Hub 01</h4><p className="font-mono text-[14px] leading-5 text-[#3c4a42]">MAC: 00:1A:7D:DA:71:13</p></div><button type="button" onClick={() => setConnectionState("disconnected")} className="flex shrink-0 items-center gap-1 rounded border border-[rgba(186,26,26,0.2)] bg-white px-[13px] py-1.5 text-[14px] text-[#ba1a1a]"><Icon name="disconnect" className="h-[14px] w-[13px]" />Disconnect</button></div>
								</div>
								<div className="grid grid-cols-2 gap-px bg-[#bbcabf] sm:grid-cols-4">
									<Metric label="Signal Strength" value="-42" unit="dBm" /><Metric label="Battery Level" value="80%" icon="battery" /><Metric label="Sampling Rate" value="100" unit="Hz" /><Metric label="Firmware" value="v1.2.4" mono />
								</div>
								<div className="flex items-center justify-between border-b border-[#bbcabf] bg-white px-4 py-4"><span className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-[#3c4a42]">Data-stream Status</span><span className="flex items-center gap-2 rounded border border-[rgba(187,202,191,0.3)] bg-[#f0f3ff] px-2 py-1 font-mono text-[14px] leading-5 text-[#006c49]"><Icon name="active" className="h-3 w-[9px]" />ACTIVE</span></div>
								<div className="bg-[#f9f9ff] p-6"><h5 className="mb-4 text-[12px] font-semibold leading-4 tracking-[0.6px] text-[#3c4a42]">Attached Channels (4)</h5><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><ChannelCard icon="input" title="Potentiostat Input" detail="CH-01 • Active" /><ChannelCard icon="output" title="Potentiostat Output" detail="CH-02 • Active" /><ChannelCard icon="temperature" title="Temperature" detail="Simulated" simulated /><ChannelCard icon="humidity" title="Humidity" detail="Simulated" simulated /></div></div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</main>
	);
}

function Metric({ label, value, unit, icon, mono = false }: { label: string; value: string; unit?: string; icon?: IconName; mono?: boolean }) {
	return <div className="flex min-h-[84px] flex-col gap-1 bg-white p-4"><p className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-[#3c4a42]">{label}</p><div className="flex items-end gap-2">{icon ? <Icon name={icon} className="mb-1 h-5 w-2.5" /> : null}<span className={`${mono ? "font-mono text-[16px]" : "text-[30px] tracking-[-0.32px] sm:text-[32px]"} font-medium leading-8 text-[#151c27]`}>{value}</span>{unit ? <span className="pb-1 text-[14px] leading-5 text-[#3c4a42]">{unit}</span> : null}</div></div>;
}
