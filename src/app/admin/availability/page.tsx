"use client";

import { useState, useEffect, useCallback } from "react";

interface BlockedDate {
  id: string;
  date: string;
  affected_forms: string[];
  reason: string | null;
  created_at: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const FORM_OPTIONS = [
  { key: "general", label: "General Picnic Request" },
  { key: "proposal", label: "Proposal Package" },
  { key: "wedding", label: "Wedding Suite" },
];

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export default function AvailabilityPage() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() };
  });

  // Selected date panel state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [affectedForms, setAffectedForms] = useState<string[]>(["general", "proposal", "wedding"]);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchDates = useCallback(async () => {
    const res = await fetch("/api/blocked-dates");
    if (res.ok) setBlockedDates(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDates();
  }, [fetchDates]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const isPast = (dateStr: string) => dateStr < todayStr;
  const getEntry = (dateStr: string) => blockedDates.find((bd) => bd.date === dateStr);

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
    if (isPast(dateStr)) return;
    const existing = getEntry(dateStr);
    setSelectedDate(dateStr);
    setAffectedForms(existing ? [...existing.affected_forms] : ["general", "proposal", "wedding"]);
    setReason(existing?.reason ?? "");
  };

  const toggleForm = (key: string) => {
    setAffectedForms((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    if (!selectedDate || affectedForms.length === 0) return;
    setSaving(true);
    try {
      await fetch("/api/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, affected_forms: affectedForms, reason: reason || null }),
      });
      await fetchDates();
      setSelectedDate(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedDate) return;
    const entry = getEntry(selectedDate);
    if (!entry) { setSelectedDate(null); return; }
    setDeleting(entry.id);
    try {
      await fetch("/api/blocked-dates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id }),
      });
      await fetchDates();
      setSelectedDate(null);
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteFromList = async (id: string) => {
    setDeleting(id);
    try {
      await fetch("/api/blocked-dates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchDates();
      if (selectedDate && getEntry(selectedDate)?.id === id) setSelectedDate(null);
    } finally {
      setDeleting(null);
    }
  };

  const prevMonth = () =>
    setViewDate(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );

  const nextMonth = () =>
    setViewDate(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );

  const selectedEntry = selectedDate ? getEntry(selectedDate) : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Availability</h1>
        <p className="text-warm-gray mt-1">
          Block dates to prevent them from being selected on booking forms
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* ── Calendar ── */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-charcoal transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="font-serif text-xl text-charcoal">
              {MONTHS[viewDate.month]} {viewDate.year}
            </h2>
            <button
              onClick={nextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-charcoal transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2 border-b border-gray-100 pb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-warm-gray uppercase tracking-wide py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {loading ? (
            <div className="flex items-center justify-center h-48 text-warm-gray text-sm">Loading…</div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;
                const dateStr = toDateStr(day);
                const past = isPast(dateStr);
                const entry = getEntry(dateStr);
                const blocked = !!entry;
                const selected = selectedDate === dateStr;
                const isToday = dateStr === todayStr;

                return (
                  <button
                    key={i}
                    onClick={() => !past && handleDayClick(day)}
                    disabled={past}
                    title={
                      blocked
                        ? `Blocked for: ${entry.affected_forms.join(", ")}${entry.reason ? ` — ${entry.reason}` : ""}`
                        : past
                        ? "Past date"
                        : "Click to block this date"
                    }
                    className={[
                      "relative h-12 w-full flex flex-col items-center justify-center rounded-xl text-sm transition-all",
                      past
                        ? "text-gray-300 cursor-not-allowed"
                        : selected && blocked
                        ? "bg-blush border-2 border-red-300 text-charcoal ring-2 ring-offset-1 ring-red-200"
                        : selected
                        ? "bg-sage-light border-2 border-sage text-charcoal ring-2 ring-offset-1 ring-sage"
                        : blocked
                        ? "bg-blush text-charcoal hover:bg-blush border border-blush-light cursor-pointer"
                        : isToday
                        ? "ring-1 ring-gold text-charcoal hover:bg-gold-light cursor-pointer"
                        : "text-charcoal hover:bg-sage-light cursor-pointer",
                    ].join(" ")}
                  >
                    <span className={isToday && !selected ? "font-semibold" : ""}>{day}</span>
                    {blocked && (
                      <span className="absolute bottom-1 flex gap-px">
                        {entry.affected_forms.slice(0, 3).map((_, fi) => (
                          <span key={fi} className="w-1 h-1 rounded-full bg-red-300 inline-block" />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-5 flex-wrap text-xs text-warm-gray">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-lg bg-blush border border-blush-light inline-block" />
              Blocked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-lg bg-sage-light border border-sage inline-block" />
              Selected
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-lg ring-1 ring-gold bg-white inline-block" />
              Today
            </span>
            <span className="ml-auto text-warm-gray/70">Click any future date to block or unblock it</span>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="space-y-6">
          {/* Selected date form */}
          {selectedDate ? (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg text-charcoal">{formatDate(selectedDate)}</h3>
                  <p className="text-xs text-warm-gray mt-0.5">
                    {selectedEntry ? "Currently blocked" : "Not blocked"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-warm-gray hover:text-charcoal transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <p className="text-sm font-medium text-charcoal">Block for these forms:</p>
                {FORM_OPTIONS.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => toggleForm(key)}
                      className={[
                        "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer",
                        affectedForms.includes(key)
                          ? "bg-gold border-gold"
                          : "border-sage group-hover:border-gold",
                      ].join(" ")}
                    >
                      {affectedForms.includes(key) && (
                        <svg className="w-3 h-3 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-charcoal">{label}</span>
                  </label>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Reason <span className="text-warm-gray font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Already booked, Holiday"
                  className="w-full rounded-lg border border-sage px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving || affectedForms.length === 0}
                  className="flex-1 bg-gold hover:bg-gold-light text-charcoal text-sm font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : selectedEntry ? "Update Block" : "Block Date"}
                </button>
                {selectedEntry && (
                  <button
                    onClick={handleDeleteSelected}
                    disabled={deleting === selectedEntry.id}
                    className="px-3 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
                    title="Remove block"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-sage-light rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-warm-gray">Click a future date on the calendar to block or unblock it</p>
            </div>
          )}

          {/* Blocked dates list */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-serif text-lg text-charcoal mb-4">
              Blocked Dates
              {blockedDates.length > 0 && (
                <span className="ml-2 text-sm font-sans font-normal text-warm-gray">
                  ({blockedDates.length})
                </span>
              )}
            </h3>

            {blockedDates.length === 0 ? (
              <p className="text-sm text-warm-gray">No dates blocked yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {[...blockedDates]
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((bd) => (
                    <div
                      key={bd.id}
                      className={[
                        "flex items-start justify-between gap-2 p-3 rounded-lg border transition-colors cursor-pointer",
                        selectedDate === bd.date
                          ? "border-sage bg-sage-light"
                          : "border-gray-100 hover:border-sage-light hover:bg-gray-50",
                      ].join(" ")}
                      onClick={() => {
                        setSelectedDate(bd.date);
                        setAffectedForms([...bd.affected_forms]);
                        setReason(bd.reason ?? "");
                      }}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-charcoal">{formatDate(bd.date)}</p>
                        <p className="text-xs text-warm-gray mt-0.5">
                          {bd.affected_forms
                            .map((f) => FORM_OPTIONS.find((o) => o.key === f)?.label ?? f)
                            .join(", ")}
                        </p>
                        {bd.reason && (
                          <p className="text-xs text-warm-gray/70 mt-0.5 italic">{bd.reason}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteFromList(bd.id); }}
                        disabled={deleting === bd.id}
                        className="text-warm-gray hover:text-red-500 transition-colors flex-shrink-0 mt-0.5 disabled:opacity-40"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
