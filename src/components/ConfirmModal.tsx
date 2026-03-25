'use client';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { lightModalTheme } from '@/src/lib/modalTheme';

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
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
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
          className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors cursor-pointer text-white ${
            danger
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-app-blue hover:bg-app-navy'
          }`}
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm border border-app-border bg-white text-app-dark hover:bg-app-gray transition-colors cursor-pointer"
        >
          {cancelLabel}
        </button>
      </ModalFooter>
    </Modal>
  );
}
