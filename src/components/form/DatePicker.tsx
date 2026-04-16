"use client";

import { useState, useRef, useEffect } from "react";

interface BlockedDate {
  date: string;
  affected_forms: string[];
}

// Module-level cache so all pickers on the same page share one fetch
let _cache: BlockedDate[] | null = null;
let _promise: Promise<BlockedDate[]> | null = null;

function fetchBlockedDates(): Promise<BlockedDate[]> {
  if (_cache !== null) return Promise.resolve(_cache);
  if (!_promise) {
    _promise = fetch("/api/blocked-dates")
      .then((r) => r.json())
      .then((data: BlockedDate[]) => {
        _cache = data;
        return data;
      })
      .catch(() => []);
  }
  return _promise;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  formType: "general" | "proposal" | "wedding";
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  hasError,
  formType,
  placeholder = "Select a date",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [viewDate, setViewDate] = useState(() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() };
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBlockedDates().then(setBlockedDates);
  }, []);

  // When value changes, jump calendar to that month
  useEffect(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      setViewDate({ year: y, month: m - 1 });
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const isBlocked = (dateStr: string) =>
    blockedDates.some(
      (bd) =>
        bd.date === dateStr &&
        (bd.affected_forms.includes(formType) || bd.affected_forms.includes("all"))
    );

  const isPast = (dateStr: string) => dateStr < todayStr;

  const formatDisplay = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return `${MONTHS[m - 1]} ${d}, ${y}`;
  };

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDay = new Date(viewDate.year, viewDate.month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const toDateStr = (day: number) =>
    `${viewDate.year}-${String(viewDate.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const handleDayClick = (day: number) => {
    const dateStr = toDateStr(day);
    if (isPast(dateStr) || isBlocked(dateStr)) return;
    onChange(dateStr);
    setOpen(false);
  };

  const prevMonth = () =>
    setViewDate(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );

  const nextMonth = () =>
    setViewDate(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          "w-full rounded-lg border px-4 py-2.5 text-sm flex items-center justify-between gap-2 bg-white transition-colors focus:outline-none",
          hasError
            ? "border-red-400 focus:border-red-500"
            : open
            ? "border-gold"
            : "border-sage hover:border-sage-dark focus:border-gold",
        ].join(" ")}
      >
        <span className={value ? "text-charcoal" : "text-warm-gray"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-180 text-gold" : "text-warm-gray"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 left-0 bg-cream border border-sage rounded-xl shadow-xl p-4 w-72">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sage-light text-charcoal transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-serif text-charcoal font-medium text-sm">
              {MONTHS[viewDate.month]} {viewDate.year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sage-light text-charcoal transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold text-warm-gray py-1 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-px">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = toDateStr(day);
              const past = isPast(dateStr);
              const blocked = isBlocked(dateStr);
              const selected = value === dateStr;
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={i}
                  type="button"
                  disabled={past || blocked}
                  onClick={() => handleDayClick(day)}
                  title={blocked ? "This date is unavailable" : undefined}
                  className={[
                    "w-full aspect-square flex items-center justify-center rounded-lg text-sm transition-colors",
                    selected
                      ? "bg-gold text-charcoal font-semibold shadow-sm"
                      : blocked
                      ? "bg-blush text-warm-gray/40 cursor-not-allowed"
                      : past
                      ? "text-warm-gray/30 cursor-not-allowed"
                      : isToday
                      ? "ring-1 ring-gold text-charcoal font-medium hover:bg-gold hover:text-charcoal cursor-pointer"
                      : "text-charcoal hover:bg-sage-light cursor-pointer",
                  ].join(" ")}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 pt-3 border-t border-sage-light flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs text-warm-gray">
              <span className="w-3 h-3 rounded-sm bg-blush inline-block border border-blush" />
              Unavailable
            </span>
            <span className="flex items-center gap-1.5 text-xs text-warm-gray">
              <span className="w-3 h-3 rounded-sm bg-gold inline-block" />
              Selected
            </span>
            <span className="flex items-center gap-1.5 text-xs text-warm-gray">
              <span className="w-3 h-3 rounded-sm ring-1 ring-gold inline-block bg-cream" />
              Today
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
