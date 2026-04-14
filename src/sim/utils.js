export function clampInt(value, min, max) {
  if (!Number.isFinite(value)) return min
  const v = Math.trunc(value)
  return Math.min(max, Math.max(min, v))
}

export function normalizePid(pid, fallback) {
  const trimmed = pid.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

export function stableSortBy(arr, key) {
  return arr
    .map((v, i) => ({ v, i }))
    .sort((a, b) => {
      const ka = key(a.v)
      const kb = key(b.v)
      if (ka !== kb) return ka - kb
      return a.i - b.i
    })
    .map((x) => x.v)
}

export function hashColor(label) {
  // Deterministic pleasant-ish colors per pid.
  let h = 2166136261
  for (let i = 0; i < label.length; i++) {
    h ^= label.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const hue = Math.abs(h) % 360
  return `hsl(${hue} 70% 55%)`
}

