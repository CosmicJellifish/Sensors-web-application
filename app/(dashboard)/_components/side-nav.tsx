"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "./icon";

// Icons are the exact SVGs exported from Figma; see Icon for how they are
// coloured. The nav relies on that to switch between the white (resting) and
// black (active) fills the design uses.
type NavItem = {
  label: string;
  href: string;
  icon: string;
  width: number;
  height: number;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/overview",
    icon: "/icons/nav-overview.svg",
    width: 18,
    height: 18,
  },
  {
    label: "Bluetooth Devices",
    href: "/bluetooth-devices",
    icon: "/icons/nav-bluetooth.svg",
    width: 12.7,
    height: 20,
  },
  {
    label: "Live Test",
    href: "/live-test",
    icon: "/icons/nav-live-test.svg",
    width: 14,
    height: 19,
  },
  {
    label: "Test History",
    href: "/test-history",
    icon: "/icons/nav-test-history.svg",
    width: 18,
    height: 18,
  },
  {
    label: "Data Export",
    href: "/data-export",
    icon: "/icons/nav-data-export.svg",
    width: 16,
    height: 16,
  },
  {
    label: "Device Settings",
    href: "/device-settings",
    icon: "/icons/nav-device-settings.svg",
    width: 20.1,
    height: 20,
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 flex h-dvh w-[256px] shrink-0 flex-col border-r border-hairline bg-[linear-gradient(to_bottom,var(--color-nav-from)_15.385%,var(--color-nav-to)_76.923%)] py-[16px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
    >
      <div className="flex flex-col gap-[4px] px-[24px] pt-[16px] pb-[32px]">
        <p className="text-[20px] leading-[28px] font-bold tracking-[-0.5px] text-white">
          Electrochemical
          <br />
          Sensor Monitor
        </p>
        <p className="text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-black uppercase">
          Precision Data Suite
        </p>
      </div>

      {/* The account block is absolutely positioned in Figma; the offsets below
          are the design's, measured inside a 255×119 box. */}
      <div className="relative h-[119px] w-[255px] shrink-0 overflow-hidden">
        <div className="absolute top-[18px] left-[8px]">
          <Icon
            src="/icons/nav-avatar.svg"
            width={92}
            height={92}
            className="bg-[#d9d9d9]"
          />
        </div>
        <p className="absolute top-[26px] left-[76px] w-[159px] text-center text-[16px] leading-[20px] text-white">
          Account Name
        </p>
        <button
          type="button"
          className="absolute top-[65px] left-[128px] h-[17px] w-[57px] rounded-[15px] bg-logout text-[13px] leading-[17px] text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          Log out
        </button>
      </div>

      <ul className="flex flex-col">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "flex w-full items-center gap-[16px] border-r-4 border-nav-active bg-[rgba(240,243,255,0.5)] px-[24px] py-[12px] text-[14px] leading-[20px] font-bold text-black"
                    : "flex w-full items-center gap-[16px] px-[24px] py-[12px] text-[14px] leading-[20px] text-white hover:bg-white/10"
                }
              >
                <Icon src={item.icon} width={item.width} height={item.height} />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
