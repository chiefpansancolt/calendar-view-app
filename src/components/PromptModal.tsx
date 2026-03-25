'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import { lightModalTheme } from '@/src/lib/modalTheme';

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
  title = 'Input Required',
  message,
  defaultValue = '',
  confirmLabel = 'OK',
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
    if (e.key === 'Enter') handleConfirm();
    if (e.key === 'Escape') onCancel();
  }

  return (
    <Modal show={show} size="sm" onClose={onCancel} dismissible theme={lightModalTheme}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {message && <p className="text-sm text-gray-600 mb-3">{message}</p>}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-app-border rounded-md px-2.5 py-2 text-sm outline-none focus:border-app-blue focus:shadow-[0_0_0_2px_#17A7DA22] transition-all"
        />
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!value.trim()}
          className="bg-app-blue text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-app-navy transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm border border-app-border bg-white text-app-dark hover:bg-app-gray transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </ModalFooter>
    </Modal>
  );
}
