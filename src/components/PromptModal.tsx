"use client";

import { lightModalTheme } from "@/src/lib/modalTheme";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { useEffect, useRef, useState } from "react";

interface Props {
	show: boolean;
	title?: string;
	message?: string;
	defaultValue?: string;
	confirmLabel?: string;
	onConfirm: (value: string) => void;
	onCancel: () => void;
}

export default function PromptModal({
	show,
	title = "Input Required",
	message,
	defaultValue = "",
	confirmLabel = "OK",
	onConfirm,
	onCancel,
}: Props) {
	const [value, setValue] = useState(defaultValue);
	const inputRef = useRef<HTMLInputElement>(null);

	// Sync value when defaultValue changes (e.g. rename pre-fills existing name)
	useEffect(() => {
		if (show) {
			setValue(defaultValue);
			setTimeout(() => inputRef.current?.select(), 50);
		}
	}, [show, defaultValue]);

	function handleConfirm() {
		const trimmed = value.trim();
		if (!trimmed) return;
		onConfirm(trimmed);
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") handleConfirm();
		if (e.key === "Escape") onCancel();
	}

	return (
		<Modal show={show} size="sm" onClose={onCancel} dismissible theme={lightModalTheme}>
			<ModalHeader>{title}</ModalHeader>
			<ModalBody>
				{message && <p className="mb-3 text-sm text-gray-600">{message}</p>}
				<input
					ref={inputRef}
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={handleKeyDown}
					className="border-app-border focus:border-app-blue w-full rounded-md border px-2.5 py-2 text-sm transition-all outline-none focus:shadow-[0_0_0_2px_#17A7DA22]"
				/>
			</ModalBody>
			<ModalFooter>
				<button
					type="button"
					onClick={handleConfirm}
					disabled={!value.trim()}
					className="bg-app-blue hover:bg-app-navy cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
				>
					{confirmLabel}
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="border-app-border text-app-dark hover:bg-app-gray cursor-pointer rounded-md border bg-white px-4 py-2 text-sm transition-colors"
				>
					Cancel
				</button>
			</ModalFooter>
		</Modal>
	);
}
