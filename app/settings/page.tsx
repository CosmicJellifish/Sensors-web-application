"use client";

import { useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const icons = {
  overview: "https://www.figma.com/api/mcp/asset/72cb9a49-d688-43c8-ab43-2776396e43e6.svg",
  bluetooth: "https://www.figma.com/api/mcp/asset/021823b4-bd60-448f-afad-6a0ba2b546a9.svg",
  live: "https://www.figma.com/api/mcp/asset/04341a4d-559e-4f5c-9092-a0759438e2a9.svg",
  history: "https://www.figma.com/api/mcp/asset/31cc35b7-b5c6-4160-8521-92311dcbe679.svg",
  download: "https://www.figma.com/api/mcp/asset/4ebc6288-2cf8-4599-a111-4a9519e32bab.svg",
  settings: "https://www.figma.com/api/mcp/asset/45382f25-26b7-4921-bb26-6f6e23131a84.svg",
  avatar: "https://www.figma.com/api/mcp/asset/419b40cb-74f8-4d06-994b-4052486dab6c.svg",
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

function Sidebar({ onMessage }: { onMessage: (message: string) => void }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col bg-gradient-to-b from-[#2757d2] from-[15.385%] to-[#abc1f8] to-[76.923%] shadow-[0_1px_1px_rgba(0,0,0,0.05)] lg:flex">
      <div className="h-[104px] px-6 pt-8"><h1 className="text-[20px] font-bold leading-7 tracking-[-0.5px] text-white">Electrochemical<br />Sensor Monitor</h1><p className="text-[12px] font-semibold leading-4 tracking-[0.6px] text-black">PRECISION DATA SUITE</p></div>
      <div className="relative h-[119px] w-full"><Icon name="avatar" className="absolute left-2 top-[18px] size-[92px]" /><span className="absolute left-[82px] top-7 text-[16px] leading-5 text-white">Account Name</span><button type="button" onClick={() => onMessage("Logged out")} className="absolute left-[104px] top-[65px] rounded-[15px] bg-[#941313] px-2 text-[13px] leading-[17px] text-white">Log out</button></div>
      <nav aria-label="Primary navigation" className="flex flex-col">{navigation.map((item) => item.label === "Device Settings" ? <div key={item.label} className="flex items-center gap-4 border-r-4 border-[#272eb2] bg-[rgba(240,243,255,0.5)] px-6 py-3 text-[14px] font-bold text-black"><Icon name={item.icon} className="size-[18px] brightness-0" />{item.label}</div> : <Link key={item.label} href={item.href} className="flex items-center gap-4 px-6 py-3 text-[14px] text-white hover:bg-white/10"><Icon name={item.icon} className="size-5" />{item.label}</Link>)}</nav>
    </aside>
  );
}

function Panel({ title, marker, children, className = "" }: { title: string; marker: string; children: React.ReactNode; className?: string }) {
  return <section className={`overflow-hidden rounded-lg border border-[#bbcabf] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${className}`}><h2 className="flex items-center gap-2 border-b border-[#bbcabf] px-5 py-3 text-[20px] font-semibold leading-7"><span className="text-[#006c49]">{marker}</span>{title}</h2><div className="p-5">{children}</div></section>;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return <button type="button" aria-pressed={checked} onClick={onChange} className={`relative h-5 w-8 rounded-full transition-colors ${checked ? "bg-[#10b981]" : "bg-[#dce2f3]"}`}><span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-3.5" : "translate-x-0.5"}`} /></button>;
}

export default function DeviceSettingsPage() {
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [simulationMode, setSimulationMode] = useState(false);
  const [message, setMessage] = useState("");

  function announce(nextMessage: string) {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(""), 2500);
  }

  return <main className={`${inter.variable} min-h-dvh bg-[#f9f9ff] font-[family-name:var(--font-inter)] text-[#151c27]`}><Sidebar onMessage={announce} /><div className="min-h-dvh lg:pl-64"><div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-4 p-4 sm:p-6 lg:grid-cols-2">{message ? <p role="status" className="lg:col-span-2 -mb-1 text-sm text-[#006c49]">{message}</p> : null}
    <Panel title="Device Configuration" marker="⚙"><label className="block text-[12px] font-medium leading-4 text-[#3c4a42]">Device Name<input defaultValue="ESM-Alpha-01" className="mt-1 block h-[38px] w-full rounded border border-[#bbcabf] bg-[#f0f3ff] px-3 text-[14px] text-[#151c27] outline-none focus:border-[#006c49]" /></label><div className="mt-4 flex items-center justify-between border-t border-[#dce2f3] pt-4"><div><p className="text-[14px] font-medium">Auto-reconnect</p><p className="text-[12px] leading-4 text-[#3c4a42]">Automatically restore connection on signal loss</p></div><Toggle checked={autoReconnect} onChange={() => setAutoReconnect(!autoReconnect)} /></div></Panel>
    <Panel title="Measurement Prefs" marker="☷"><label className="block text-[12px] font-medium leading-4 text-[#3c4a42]">Sampling Rate (Hz)<select defaultValue="100" className="mt-1 block h-[38px] w-full rounded border border-[#bbcabf] bg-[#f0f3ff] px-3 text-[14px] text-[#151c27]"><option value="100">100 Hz (Standard)</option><option value="50">50 Hz</option><option value="200">200 Hz</option></select></label><fieldset className="mt-4"><legend className="text-[12px] font-medium leading-4 text-[#3c4a42]">Measurement Units</legend><div className="mt-2 flex flex-wrap gap-4 text-[14px]"><label className="flex items-center gap-2"><input type="radio" name="units" defaultChecked className="accent-[#10b981]" />Microamps (µA)</label><label className="flex items-center gap-2"><input type="radio" name="units" className="accent-[#10b981]" />Nanoamps (nA)</label></div></fieldset></Panel>
    <Panel title="Safety & Thresholds" marker="⚠" className="min-h-[322px]"><p className="text-[14px] leading-5 text-[#3c4a42]">Configure current warning thresholds to trigger alerts during live tests.</p><div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"><label className="text-[12px] font-medium leading-4 text-[#3c4a42]">Upper Limit (µA)<input placeholder="Not configured" className="mt-1 block h-[30px] w-full rounded border border-[#bbcabf] bg-[#f0f3ff] px-3 text-[14px]" /></label><label className="text-[12px] font-medium leading-4 text-[#3c4a42]">Lower Limit (µA)<input placeholder="Not configured" className="mt-1 block h-[30px] w-full rounded border border-[#bbcabf] bg-[#f0f3ff] px-3 text-[14px]" /></label></div></Panel>
    <div className="flex flex-col gap-4"><Panel title="Firmware Info" marker="⇩"><div className="divide-y divide-dashed divide-[#bbcabf] text-[12px]"><div className="flex justify-between py-2"><span>Current Version</span><strong>v2.1.0-stable</strong></div><div className="flex justify-between py-2"><span>Serial Number</span><strong>ESM-8839-X2</strong></div></div><button type="button" onClick={() => announce("Checking for updates...")} className="mt-3 h-[30px] w-full rounded border border-[#bbcabf] bg-[#f0f3ff] text-[12px] font-medium hover:bg-white">↻ &nbsp;Check for Updates</button></Panel><Panel title="Advanced" marker="🔧"><div className="flex items-center justify-between"><div><p className="text-[12px] font-semibold">Simulation Mode</p><p className="text-[12px] leading-4 text-[#3c4a42]">Generate mock cyclic voltammetry data</p></div><Toggle checked={simulationMode} onChange={() => setSimulationMode(!simulationMode)} /></div></Panel></div>
  </div></div></main>;
}
