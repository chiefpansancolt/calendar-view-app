"use client";

import { lightModalTheme } from "@/src/lib/modalTheme";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";

interface Props {
	show: boolean;
	title?: string;
	message: string;
	onClose: () => void;
}

export default function AlertModal({ show, title = "Notice", message, onClose }: Props) {
	return (
		<Modal show={show} size="sm" onClose={onClose} dismissible theme={lightModalTheme}>
			<ModalHeader>{title}</ModalHeader>
			<ModalBody>
				<p className="text-sm text-gray-700">{message}</p>
			</ModalBody>
			<ModalFooter>
				<button
					type="button"
					onClick={onClose}
					className="bg-app-blue hover:bg-app-navy cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors"
				>
					OK
				</button>
			</ModalFooter>
		</Modal>
	);
}
