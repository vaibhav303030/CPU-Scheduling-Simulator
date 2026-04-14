import { stableSortBy } from './utils.js'

function sanitize(processes) {
  const cleaned = processes.map((p, idx) => ({
    pid: (p.pid || `P${idx + 1}`).trim() || `P${idx + 1}`,
    arrival: Math.max(0, Math.trunc(p.arrival)),
    burst: Math.max(1, Math.trunc(p.burst)),
    priority: Math.max(0, Math.trunc(p.priority)),
    remaining: Math.max(1, Math.trunc(p.burst)),
    startedAt: null,
    completedAt: null,
  }))

  // Ensure unique PIDs by suffixing duplicates (stable).
  const seen = new Map()
  for (const p of cleaned) {
    const n = (seen.get(p.pid) ?? 0) + 1
    seen.set(p.pid, n)
    if (n > 1) p.pid = `${p.pid}_${n}`
  }

  return stableSortBy(cleaned, (p) => p.arrival)
}

function pickNext(ready, opts, currentPid) {
  if (ready.length === 0) return null

  if (opts.algorithm === 'FCFS') {
    // Non-preemptive only; selection by earliest arrival, stable.
    return ready[0]
  }

  if (opts.algorithm === 'SJF') {
    if (opts.preemptive) {
      // SRTF
      const sorted = [...ready].sort((a, b) => {
        if (a.remaining !== b.remaining) return a.remaining - b.remaining
        if (a.arrival !== b.arrival) return a.arrival - b.arrival
        return a.pid.localeCompare(b.pid)
      })
      return sorted[0]
    }
    // Non-preemptive SJF: pick smallest burst among ready
    const sorted = [...ready].sort((a, b) => {
      if (a.burst !== b.burst) return a.burst - b.burst
      if (a.arrival !== b.arrival) return a.arrival - b.arrival
      return a.pid.localeCompare(b.pid)
    })
    return sorted[0]
  }

  // PRIORITY
  const sorted = [...ready].sort((a, b) => {
    // Smaller number = higher priority
    if (a.priority !== b.priority) return a.priority - b.priority
    if (opts.preemptive) {
      // If same priority, prefer current to reduce switching
      if (currentPid && a.pid === currentPid && b.pid !== currentPid) return -1
      if (currentPid && b.pid === currentPid && a.pid !== currentPid) return 1
    }
    if (a.arrival !== b.arrival) return a.arrival - b.arrival
    return a.pid.localeCompare(b.pid)
  })
  return sorted[0]
}

function pushSlice(timeline, label, start, end) {
  if (end <= start) return
  const last = timeline[timeline.length - 1]
  if (last && last.label === label && last.end === start) {
    last.end = end
    return
  }
  timeline.push({ label, start, end })
}

export function simulate(processes, options) {
  const procs = sanitize(processes)
  const opts = options.algorithm === 'FCFS' ? { ...options, preemptive: false } : options

  const timeline = []
  const completed = () => procs.every((p) => p.remaining === 0)

  let t = 0
  let current = null

  while (!completed()) {
    const arrived = procs.filter((p) => p.arrival <= t && p.remaining > 0)

    if (!opts.preemptive) {
      // Non-preemptive: once chosen, run until completion.
      if (!current) {
        const next = pickNext(arrived, opts, null)
        if (!next) {
          // Jump to next arrival (idle gap)
          const nextArrival = Math.min(...procs.filter((p) => p.remaining > 0).map((p) => p.arrival))
          pushSlice(timeline, 'IDLE', t, nextArrival)
          t = nextArrival
          continue
        }
        current = next
        if (current.startedAt === null) current.startedAt = t
      }

      const runFor = current.remaining
      pushSlice(timeline, current.pid, t, t + runFor)
      t += runFor
      current.remaining = 0
      current.completedAt = t
      current = null
      continue
    }

    // Preemptive: decide each time unit.
    const next = pickNext(arrived, opts, current ? current.pid : null)
    if (!next) {
      // If nothing is ready, jump to next arrival (idle).
      const future = procs.filter((p) => p.remaining > 0 && p.arrival > t)
      const nextArrival = future.length ? Math.min(...future.map((p) => p.arrival)) : t + 1
      pushSlice(timeline, 'IDLE', t, nextArrival)
      t = nextArrival
      current = null
      continue
    }

    current = next
    if (current.startedAt === null) current.startedAt = t
    pushSlice(timeline, current.pid, t, t + 1)
    current.remaining -= 1
    t += 1
    if (current.remaining === 0) {
      current.completedAt = t
      current = null
    }
  }

  const perProcess = procs
    .slice()
    .sort((a, b) => a.pid.localeCompare(b.pid))
    .map((p) => {
      const startTime = p.startedAt ?? p.arrival
      const completionTime = p.completedAt ?? startTime
      const turnaroundTime = completionTime - p.arrival
      const waitingTime = turnaroundTime - p.burst
      const responseTime = startTime - p.arrival
      return {
        pid: p.pid,
        arrival: p.arrival,
        burst: p.burst,
        priority: p.priority,
        startTime,
        completionTime,
        turnaroundTime,
        waitingTime,
        responseTime,
      }
    })

  const makespan = timeline.length ? timeline[timeline.length - 1].end : 0
  return { timeline, perProcess, makespan }
}

