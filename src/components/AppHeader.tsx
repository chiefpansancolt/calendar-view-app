'use client';

import Image from 'next/image';
import ClientDropdown from './ClientDropdown';

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
    <header className="bg-white border-b border-app-border sticky top-0 z-30 shadow-sm no-print">
      <div className="px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Meeting Calendar" width={32} height={32} className="rounded-md" />
          <div>
            <span className="font-bold text-gray-900 text-base leading-tight block">Meeting Calendar</span>
            <span className="text-xs text-gray-500 leading-tight block">{subtitle}</span>
          </div>
        </div>

        {/* Client selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide hidden sm:block">Client:</span>
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
        {children && (
          <div className="flex items-center gap-3 flex-wrap">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
