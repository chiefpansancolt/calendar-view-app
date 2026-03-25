// Flowbite Modal theme override — forces light mode (removes dark: variants)
export const lightModalTheme = {
  content: {
    inner: 'relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow',
  },
  header: {
    base: 'flex items-start justify-between rounded-t border-b border-gray-200 p-5',
    title: 'text-xl font-medium text-gray-900',
    close: {
      base: 'ms-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900',
      icon: 'h-5 w-5',
    },
  },
  body: {
    base: 'flex-1 overflow-auto p-6',
  },
  footer: {
    base: 'flex items-center gap-2 rounded-b border-t border-gray-200 p-6',
  },
};
