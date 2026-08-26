export const SRC = {
  personal:   { label: 'Personal',   pill: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-500'   },
  earlehouse: { label: 'Earlehouse', pill: 'bg-violet-100 text-violet-700',   dot: 'bg-violet-500' },
  rise8:      { label: 'Rise8',      pill: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  imessage:   { label: 'iMessage',   pill: 'bg-green-100 text-green-700',     dot: 'bg-green-500'  },
  manual:     { label: 'Manual',     pill: 'bg-stone-200 text-stone-500',     dot: 'bg-stone-400'  },
};

export const SRC_OPTIONS = [
  { value: '',           label: '— none —'   },
  { value: 'personal',   label: 'Personal'   },
  { value: 'earlehouse', label: 'Earlehouse' },
  { value: 'rise8',      label: 'Rise8'      },
  { value: 'imessage',   label: 'iMessage'   },
  { value: 'manual',     label: 'Manual'     },
];

export const PRI = {
  1: { dot: 'bg-red-400',   label: '🔴 High'   },
  2: { dot: 'bg-amber-400', label: '🟡 Medium' },
  3: { dot: 'bg-stone-300', label: '⚪ Low'    },
};
