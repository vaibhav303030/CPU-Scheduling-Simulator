export function computeAverages(rows) {
  if (rows.length === 0) {
    return { avgWaiting: 0, avgTurnaround: 0, avgResponse: 0 }
  }
  const sum = rows.reduce(
    (acc, r) => {
      acc.waiting += r.waitingTime
      acc.turnaround += r.turnaroundTime
      acc.response += r.responseTime
      return acc
    },
    { waiting: 0, turnaround: 0, response: 0 },
  )
  return {
    avgWaiting: sum.waiting / rows.length,
    avgTurnaround: sum.turnaround / rows.length,
    avgResponse: sum.response / rows.length,
  }
}

