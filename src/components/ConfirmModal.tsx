"use client";

import { lightModalTheme } from "@/src/lib/modalTheme";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";

interface Props {
	show: boolean;
	title?: string;
	message: string;
	confirmLabel?: string;
	cancelLabel?: string;
	danger?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function ConfirmModal({
	show,
	title = "Confirm",
	message,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	danger = false,
	onConfirm,
	onCancel,
}: Props) {
	return (
		<Modal show={show} size="sm" onClose={onCancel} dismissible theme={lightModalTheme}>
			<ModalHeader>{title}</ModalHeader>
			<ModalBody>
				<p className="text-sm text-gray-700">{message}</p>
			</ModalBody>
			<ModalFooter>
				<button
					type="button"
					onClick={onConfirm}
					className={`cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors ${
						danger ? "bg-red-600 hover:bg-red-700" : "bg-app-blue hover:bg-app-navy"
					}`}
				>
					{confirmLabel}
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="border-app-border text-app-dark hover:bg-app-gray cursor-pointer rounded-md border bg-white px-4 py-2 text-sm transition-colors"
				>
					{cancelLabel}
				</button>
			</ModalFooter>
		</Modal>
	);
}
