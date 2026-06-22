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
const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  formType: "general" | "proposal" | "wedding";
  placeholder?: string;
  id?: string;
  "aria-labelledby"?: string;
  "aria-required"?: boolean;
}

export function DatePicker({
  value,
  onChange,
  hasError,
  formType,
  placeholder = "Select a date",
  id,
  "aria-labelledby": ariaLabelledBy,
  "aria-required": ariaRequired,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [viewDate, setViewDate] = useState(() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() };
  });
  const [focusedDateStr, setFocusedDateStr] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    fetchBlockedDates().then(setBlockedDates);
  }, []);

  // When value changes externally (and calendar is closed), sync view month
  useEffect(() => {
    if (value && !open) {
      const [y, m] = value.split("-").map(Number);
      setViewDate({ year: y, month: m - 1 });
    }
  }, [value, open]);

  // Close on outside click
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

  // Return focus to trigger when calendar closes
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus();
    }
  }, [open]);

  // Focus the correct day button after viewDate or focusedDateStr changes
  useEffect(() => {
    if (!open || !focusedDateStr || !gridRef.current) return;
    const btn = gridRef.current.querySelector<HTMLButtonElement>(
      `[data-date="${focusedDateStr}"]`
    );
    btn?.focus();
  }, [open, focusedDateStr, viewDate]);

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

  const openCalendar = () => {
    const initial = value || todayStr;
    const [y, m] = initial.split("-").map(Number);
    setViewDate({ year: y, month: m - 1 });
    setFocusedDateStr(initial);
    setOpen(true);
  };

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

  const handleCalendarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (!focusedDateStr) return;

    const [fy, fm, fd] = focusedDateStr.split("-").map(Number);
    let newDate: Date | null = null;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        newDate = new Date(fy, fm - 1, fd - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        newDate = new Date(fy, fm - 1, fd + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        newDate = new Date(fy, fm - 1, fd - 7);
        break;
      case "ArrowDown":
        e.preventDefault();
        newDate = new Date(fy, fm - 1, fd + 7);
        break;
      case "PageUp":
        e.preventDefault();
        newDate = new Date(fy, fm - 2, fd);
        // Clamp to last day of the month if the day doesn't exist
        if (newDate.getMonth() !== (fm - 2 + 12) % 12) {
          newDate = new Date(fy, fm - 1, 0);
        }
        break;
      case "PageDown":
        e.preventDefault();
        newDate = new Date(fy, fm, fd);
        if (newDate.getMonth() !== fm % 12) {
          newDate = new Date(fy, fm + 1, 0);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isPast(focusedDateStr) && !isBlocked(focusedDateStr)) {
          onChange(focusedDateStr);
          setOpen(false);
        }
        return;
      default:
        return;
    }

    if (newDate) {
      const newStr = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}-${String(newDate.getDate()).padStart(2, "0")}`;
      setFocusedDateStr(newStr);
      if (newDate.getFullYear() !== viewDate.year || newDate.getMonth() !== viewDate.month) {
        setViewDate({ year: newDate.getFullYear(), month: newDate.getMonth() });
      }
    }
  };

  const monthHeadingId = id ? `${id}-month` : "dp-month-heading";

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby={ariaLabelledBy}
        aria-required={ariaRequired || undefined}
        onClick={() => (open ? setOpen(false) : openCalendar())}
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
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={monthHeadingId}
          onKeyDown={handleCalendarKeyDown}
          className="absolute z-50 mt-1.5 left-0 bg-cream border border-sage rounded-xl shadow-xl p-4 w-72"
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous month"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sage-light text-charcoal transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span id={monthHeadingId} className="font-serif text-charcoal font-medium text-sm">
              {MONTHS[viewDate.month]} {viewDate.year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sage-light text-charcoal transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-1" role="row">
            {DAYS_SHORT.map((d, i) => (
              <div
                key={d}
                role="columnheader"
                aria-label={DAYS_FULL[i]}
                className="text-center text-[11px] font-semibold text-warm-gray py-1 uppercase tracking-wide"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div
            ref={gridRef}
            role="grid"
            aria-label={`${MONTHS[viewDate.month]} ${viewDate.year}`}
            className="grid grid-cols-7 gap-px"
          >
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} role="gridcell" />;
              const dateStr = toDateStr(day);
              const past = isPast(dateStr);
              const blocked = isBlocked(dateStr);
              const selected = value === dateStr;
              const isToday = dateStr === todayStr;
              const disabled = past || blocked;

              const ariaLabel = [
                `${MONTHS[viewDate.month]} ${day}, ${viewDate.year}`,
                selected ? "selected" : null,
                blocked ? "unavailable" : null,
                past ? "past date" : null,
                isToday && !selected ? "today" : null,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <div key={dateStr} role="gridcell">
                  <button
                    type="button"
                    data-date={dateStr}
                    disabled={disabled}
                    tabIndex={focusedDateStr === dateStr ? 0 : -1}
                    onClick={() => handleDayClick(day)}
                    aria-label={ariaLabel}
                    aria-selected={selected || undefined}
                    aria-disabled={disabled || undefined}
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
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div
            aria-hidden="true"
            className="mt-3 pt-3 border-t border-sage-light flex items-center gap-4 flex-wrap"
          >
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
