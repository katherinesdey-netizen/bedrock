export const SRC = {
  personal:   { label: 'Personal',   pill: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-500'   },
  earlehouse: { label: 'Earlehouse', pill: 'bg-violet-100 text-violet-700',   dot: 'bg-violet-500' },
  rise8:      { label: 'Rise8',      pill: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  imessage:   { label: 'iMessage',   pill: 'bg-green-100 text-green-700',     dot: 'bg-green-500'  },
  manual:     { label: 'Manual',     pill: 'bg-stone-200 text-stone-500',     dot: 'bg-stone-400'  },
  instinct:   { label: 'Instinct',   pill: 'bg-orange-100 text-orange-700',   dot: 'bg-orange-400' },
};

export const SRC_OPTIONS = [
  { value: '',           label: '— none —'   },
  { value: 'personal',   label: 'Personal'   },
  { value: 'earlehouse', label: 'Earlehouse' },
  { value: 'rise8',      label: 'Rise8'      },
  { value: 'imessage',   label: 'iMessage'   },
  { value: 'manual',     label: 'Manual'     },
];

// Area color_key → UI tokens
export const AREA_COLORS = {
  personal:   { dot: 'bg-blue-400',    ring: 'border-l-blue-300',    pill: 'bg-blue-50 text-blue-600'     },
  earlehouse: { dot: 'bg-violet-400',  ring: 'border-l-violet-300',  pill: 'bg-violet-50 text-violet-600' },
  groove:     { dot: 'bg-cyan-400',    ring: 'border-l-cyan-300',    pill: 'bg-cyan-50 text-cyan-600'     },
  alpenborg:  { dot: 'bg-amber-500',   ring: 'border-l-amber-400',   pill: 'bg-amber-50 text-amber-600'   },
  fpll:       { dot: 'bg-red-400',     ring: 'border-l-red-300',     pill: 'bg-red-50 text-red-600'       },
  finance:    { dot: 'bg-emerald-400', ring: 'border-l-emerald-300', pill: 'bg-emerald-50 text-emerald-600'},
};

export const PRI = {
  1: { dot: 'bg-red-400',   label: '🔴 High'   },
  2: { dot: 'bg-amber-400', label: '🟡 Medium' },
  3: { dot: 'bg-stone-300', label: '⚪ Low'    },
};
