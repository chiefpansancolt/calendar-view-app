"use client";

import Image from "next/image";
import ClientDropdown from "./ClientDropdown";

interface AppHeaderProps {
	subtitle: string;
	activeClient: string | null;
	clientList: string[];
	clientDropdownOpen: boolean;
	onClientToggle: () => void;
	onClientClose: () => void;
	onClientSwitch: (name: string) => void;
	onClientNew?: () => void;
	onClientRename?: (name: string) => void;
	onClientDelete?: (name: string) => void;
	children?: React.ReactNode; // extra toolbar items
}

export default function AppHeader({
	subtitle,
	activeClient,
	clientList,
	clientDropdownOpen,
	onClientToggle,
	onClientClose,
	onClientSwitch,
	onClientNew,
	onClientRename,
	onClientDelete,
	children,
}: AppHeaderProps) {
	return (
		<header className="border-app-border no-print sticky top-0 z-30 border-b bg-white shadow-sm">
			<div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
				{/* Logo + title */}
				<div className="flex items-center gap-3">
					<Image
						src="/logo.svg"
						alt="Meeting Calendar"
						width={32}
						height={32}
						className="rounded-md"
					/>
					<div>
						<span className="block text-base leading-tight font-bold text-gray-900">
							Meeting Calendar
						</span>
						<span className="block text-xs leading-tight text-gray-500">
							{subtitle}
						</span>
					</div>
				</div>

				{/* Client selector */}
				<div className="flex items-center gap-2">
					<span className="hidden text-xs font-medium tracking-wide text-gray-400 uppercase sm:block">
						Client:
					</span>
					<ClientDropdown
						activeClient={activeClient}
						clientList={clientList}
						onSwitch={onClientSwitch}
						onNew={onClientNew}
						onRename={onClientRename}
						onDelete={onClientDelete}
						open={clientDropdownOpen}
						onToggle={onClientToggle}
						onClose={onClientClose}
					/>
				</div>

				{/* Extra toolbar items (page-specific) */}
				{children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
			</div>
		</header>
	);
}
