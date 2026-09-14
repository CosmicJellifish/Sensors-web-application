"use client";

import { useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const icons = {
	chevron: "https://www.figma.com/api/mcp/asset/286d1535-7ca0-42bc-9eaa-3de5b215dcd0.svg",
	check: "https://www.figma.com/api/mcp/asset/62b8232d-7432-4f4c-a54d-e9ecd4aa3198.svg",
	radio: "https://www.figma.com/api/mcp/asset/4d3ddf92-a9cc-436d-bf8f-67ea750f5c73.svg",
	info: "https://www.figma.com/api/mcp/asset/43aaef2c-2607-4fbe-9c1d-6c866d4413a1.svg",
	download: "https://www.figma.com/api/mcp/asset/623b0f4b-93b7-4418-92e2-e60fafc862a2.svg",
	avatar: "https://www.figma.com/api/mcp/asset/d3d457ed-3a8e-4d75-b84c-2466d5382212.svg",
	overview: "https://www.figma.com/api/mcp/asset/72cb9a49-d688-43c8-ab43-2776396e43e6.svg",
	bluetooth: "https://www.figma.com/api/mcp/asset/021823b4-bd60-448f-afad-6a0ba2b546a9.svg",
	live: "https://www.figma.com/api/mcp/asset/04341a4d-559e-4f5c-9092-a0759438e2a9.svg",
	history: "https://www.figma.com/api/mcp/asset/31cc35b7-b5c6-4160-8521-92311dcbe679.svg",
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

const previewRows = [
	["2023-10-24T10:00:01Z", "12.4", "1.02", "22.1*"],
	["2023-10-24T10:00:02Z", "12.5", "1.04", "22.1*"],
	["2023-10-24T10:00:03Z", "12.3", "0.98", "22.2*"],
	["2023-10-24T10:00:04Z", "12.6", "1.05", "22.2*"],
	["2023-10-24T10:00:05Z", "12.4", "1.01", "22.3*"],
];

function Sidebar({ announce }: { announce: (message: string) => void }) {
	return <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col bg-gradient-to-b from-[#2757d2] from-[15.385%] to-[#abc1f8] to-[76.923%] shadow-[0_1px_1px_rgba(0,0,0,0.05)] lg:flex"><div className="h-[104px] px-6 pt-8"><h1 className="text-[20px] font-bold leading-7 tracking-[-0.5px] text-white">Electrochemical<br />Sensor Monitor</h1><p className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-black">PRECISION DATA SUITE</p></div><div className="relative h-[119px] w-full"><Icon name="avatar" className="absolute left-2 top-[18px] size-[92px]" /><span className="absolute left-[82px] top-7 text-[16px] leading-5 text-white">Account Name</span><button type="button" onClick={() => announce("Logged out")} className="absolute left-[104px] top-[65px] rounded-[15px] bg-[#941313] px-2 text-[13px] leading-[17px] text-white">Log out</button></div><nav aria-label="Primary navigation" className="flex flex-col">{navigation.map((item) => item.label === "Device Settings" ? <Link key={item.label} href={item.href} className="flex items-center gap-4 px-6 py-3 text-[14px] text-white hover:bg-white/10"><Icon name={item.icon} className="size-5" />{item.label}</Link> : item.label === "Data Export" ? <div key={item.label} className="flex items-center gap-4 border-r-4 border-[#272eb2] bg-[rgba(240,243,255,0.5)] px-6 py-3 text-[14px] font-bold text-black"><Icon name={item.icon} className="size-[18px] brightness-0" />{item.label}</div> : <Link key={item.label} href={item.href} className="flex items-center gap-4 px-6 py-3 text-[14px] text-white hover:bg-white/10"><Icon name={item.icon} className="size-5" />{item.label}</Link>)}</nav></aside>;
}

function Checkbox({ label, checked, simulated = false, onChange }: { label: string; checked: boolean; simulated?: boolean; onChange: () => void }) {
	return <label className="flex cursor-pointer items-center gap-2 text-[14px] leading-5"><button type="button" aria-pressed={checked} onClick={onChange} className={`flex size-[18px] items-center justify-center overflow-hidden rounded-[2px] border ${checked ? "border-transparent bg-[#006c49]" : "border-[#bbcabf] bg-white"}`}>{checked ? <Icon name="check" className="size-4" /> : null}</button><span>{label}</span>{simulated ? <em className="text-[12px] text-[#855300]">(Simulated)</em> : null}</label>;
}

export default function DataExportPage() {
	const [message, setMessage] = useState("");
	const [format, setFormat] = useState<"CSV" | "JSON">("CSV");
	const [variables, setVariables] = useState({ input: true, output: true, temperature: true, humidity: false });

	function announce(nextMessage: string) {
		setMessage(nextMessage);
		window.setTimeout(() => setMessage(""), 2500);
	}

	return <main className={`${inter.variable} min-h-dvh bg-[#f9f9ff] font-[family-name:var(--font-inter)] text-[#151c27]`}><Sidebar announce={announce} /><div className="min-h-dvh lg:pl-64"><div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 p-4 sm:p-6"><header className="border-b border-[#bbcabf] pb-[9px]"><h2 className="text-[24px] font-semibold leading-8 tracking-[-0.24px]">Data Export</h2><p className="text-[14px] leading-5 text-[#3c4a42]">Extract and format precision sensor data for external analysis.</p></header>{message ? <p role="status" className="text-sm text-[#006c49]">{message}</p> : null}<section className="grid grid-cols-1 gap-4 xl:grid-cols-12"><div className="flex flex-col gap-5 xl:col-span-4"><section className="border border-[#bbcabf] bg-white p-[17px] shadow-[0_1px_1px_rgba(0,0,0,0.05)]"><h3 className="border-b border-[#bbcabf] pb-2 text-[20px] font-semibold leading-7">Export Parameters</h3><div className="mt-4 space-y-4"><label className="block text-[12px] font-medium leading-4 text-[#3c4a42]">Test Session<select className="mt-1 block h-[38px] w-full border border-[#bbcabf] bg-white px-3 text-[14px] text-[#151c27]"><option>Session Alpha (2023-10-24 10:00)</option></select></label><fieldset><legend className="text-[12px] font-medium leading-4 text-[#3c4a42]">Date Range</legend><div className="mt-1 flex items-center gap-3"><input aria-label="Start date" defaultValue="10/20/2023" className="h-[30px] min-w-0 flex-1 border border-[#bbcabf] px-2 text-[14px]" /><span className="text-[14px] text-[#3c4a42]">to</span><input aria-label="End date" defaultValue="10/24/2023" className="h-[30px] min-w-0 flex-1 border border-[#bbcabf] px-2 text-[14px]" /></div></fieldset><fieldset><legend className="text-[12px] font-medium leading-4 text-[#3c4a42]">Measurement Variables</legend><div className="mt-2 space-y-2"><Checkbox label="Input Current (µA)" checked={variables.input} onChange={() => setVariables({ ...variables, input: !variables.input })} /><Checkbox label="Output Current (mA)" checked={variables.output} onChange={() => setVariables({ ...variables, output: !variables.output })} /><Checkbox label="Temperature (°C)" simulated checked={variables.temperature} onChange={() => setVariables({ ...variables, temperature: !variables.temperature })} /><Checkbox label="Humidity (%)" simulated checked={variables.humidity} onChange={() => setVariables({ ...variables, humidity: !variables.humidity })} /></div></fieldset><fieldset><legend className="text-[12px] font-medium leading-4 text-[#3c4a42]">Export Format</legend><div className="mt-2 flex gap-4"><label className="flex items-center gap-2 text-[14px]"><input type="radio" name="format" checked={format === "CSV"} onChange={() => setFormat("CSV")} className="accent-[#006c49]" />CSV</label><label className="flex items-center gap-2 text-[14px]"><input type="radio" name="format" checked={format === "JSON"} onChange={() => setFormat("JSON")} className="accent-[#006c49]" />JSON</label></div></fieldset></div></section><div className="flex gap-3 border border-[#855300] border-l-4 bg-[#f0f3ff] p-3 text-[14px] leading-5 text-[#3c4a42]"><Icon name="info" className="size-5 shrink-0" /><p>Simulated environmental values will be flagged in export.</p></div></div><section className="overflow-hidden border border-[#bbcabf] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] xl:col-span-8"><div className="flex items-center justify-between border-b border-[#bbcabf] bg-[#f9f9ff] px-4 py-4"><h3 className="text-[20px] font-semibold leading-7">Data Preview</h3><span className="rounded-[2px] bg-[#e7eefe] px-2 py-1 text-[12px] font-medium leading-4 text-[#3c4a42]">5 rows shown</span></div><div className="overflow-x-auto p-4"><table className="min-w-[620px] w-full border-collapse"><thead className="border-b-2 border-[#bbcabf] text-left text-[12px] font-semibold tracking-[0.6px] text-[#3c4a42]"><tr>{["Timestamp", "Input (µA)", "Output (mA)", "Temp (°C)"].map((heading) => <th key={heading} className="px-3 py-2">{heading}</th>)}</tr></thead><tbody>{previewRows.map((row) => <tr key={row[0]} className="border-b border-[#bbcabf] text-[14px]"><td className="px-3 py-3 font-mono">{row[0]}</td><td className="px-3 py-3 text-right">{row[1]}</td><td className="px-3 py-3 text-right">{row[2]}</td><td className="px-3 py-3 text-right text-[#855300]">{row[3]}</td></tr>)}</tbody></table></div><div className="flex justify-end border-t border-[#bbcabf] bg-[#f0f3ff] p-3"><button type="button" onClick={() => announce(`Downloaded ${format} data`)} className="flex items-center gap-2 bg-[#10b981] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#0d9f70]"><Icon name="download" className="size-3" />Download Data</button></div></section></section></div></div></main>;
}
