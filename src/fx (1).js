// src/fx.js
// Reference exchange rate and guards for the quotation tool.
// Edit FX_CONFIG when the reference rate is refreshed (review at least every 3 months),
// then commit and redeploy.
//
// Conversion itself stays deterministic in App.jsx (it happens before the AI sees any numbers).
// This file only holds the reference rate and the checks that catch a stale or mistyped rate.

export const FX_CONFIG = {
  // IDR per 1 USD
  usdIdr: 17900,
  // Date this reference rate was set (YYYY-MM-DD)
  asOf: '2026-10-06',
  // Internal only: where the figure came from
  source: 'USD/IDR spot, Katadata Databoks / Investing.com, 6 Oct 2026',
  // Warn when the entered rate differs from the reference by this much (0.05 = 5%)
  driftWarnPct: 0.05,
  // Warn when the reference rate itself is older than this many days
  staleAfterDays: 90,
}

/** Signed difference between an entered rate and the reference rate. Positive = rupiah weaker than reference. */
export function rateDrift(enteredRate, cfg = FX_CONFIG) {
  const entered = Number(enteredRate)
  if (!Number.isFinite(entered) || entered <= 0) return { driftPct: 0, breached: false }
  const driftPct = (entered - cfg.usdIdr) / cfg.usdIdr
  return { driftPct, breached: Math.abs(driftPct) >= cfg.driftWarnPct }
}

/** How many days old the reference rate is. */
export function referenceAgeDays(now = new Date(), cfg = FX_CONFIG) {
  const set = new Date(`${cfg.asOf}T00:00:00Z`)
  return Math.floor((now.getTime() - set.getTime()) / 86400000)
}

export function referenceIsStale(now = new Date(), cfg = FX_CONFIG) {
  return referenceAgeDays(now, cfg) > cfg.staleAfterDays
}
