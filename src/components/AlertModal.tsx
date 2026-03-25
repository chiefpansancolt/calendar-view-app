'use client';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { lightModalTheme } from '@/src/lib/modalTheme';

interface Props {
  show: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

export default function AlertModal({ show, title = 'Notice', message, onClose }: Props) {
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
          className="bg-app-blue text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-app-navy transition-colors cursor-pointer"
        >
          OK
        </button>
      </ModalFooter>
    </Modal>
  );
}
