import { useMemo } from 'react'
import { clampInt, normalizePid } from '../sim/utils.js'

const MAX_INT = 1_000_000

export function ProcessTable({ processes, onChange }) {
  const canRemove = processes.length > 1

  const pidSuggestions = useMemo(() => {
    const pids = new Set(processes.map((p) => p.pid.trim()).filter(Boolean))
    return Array.from(pids)
  }, [processes])

  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>PID</th>
            <th>Arrival</th>
            <th>Burst</th>
            <th>Priority</th>
            <th className="right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p, idx) => (
            <tr key={`${idx}-${p.pid}`}>
              <td>
                <input
                  value={p.pid}
                  list="pid-list"
                  onChange={(e) => {
                    const next = [...processes]
                    next[idx] = { ...p, pid: normalizePid(e.target.value, `P${idx + 1}`) }
                    onChange(next)
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={p.arrival}
                  min={0}
                  onChange={(e) => {
                    const next = [...processes]
                    next[idx] = { ...p, arrival: clampInt(Number(e.target.value), 0, MAX_INT) }
                    onChange(next)
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={p.burst}
                  min={1}
                  onChange={(e) => {
                    const next = [...processes]
                    next[idx] = { ...p, burst: clampInt(Number(e.target.value), 1, MAX_INT) }
                    onChange(next)
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={p.priority}
                  min={0}
                  onChange={(e) => {
                    const next = [...processes]
                    next[idx] = { ...p, priority: clampInt(Number(e.target.value), 0, MAX_INT) }
                    onChange(next)
                  }}
                />
              </td>
              <td className="right">
                <button
                  className="btn"
                  onClick={() => {
                    const next = processes.filter((_, i) => i !== idx)
                    onChange(next.length ? next : processes)
                  }}
                  disabled={!canRemove}
                  title={canRemove ? 'Remove row' : 'Keep at least 1 process'}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <datalist id="pid-list">
        {pidSuggestions.map((pid) => (
          <option key={pid} value={pid} />
        ))}
      </datalist>

      <div className="rowActions">
        <button
          className="btn primary"
          onClick={() => {
            const nextIndex = processes.length + 1
            onChange([
              ...processes,
              { pid: `P${nextIndex}`, arrival: 0, burst: 1, priority: 0 },
            ])
          }}
        >
          Add process
        </button>
        <button
          className="btn"
          onClick={() => {
            onChange([
              { pid: 'P1', arrival: 0, burst: 7, priority: 2 },
              { pid: 'P2', arrival: 2, burst: 4, priority: 1 },
              { pid: 'P3', arrival: 4, burst: 1, priority: 3 },
              { pid: 'P4', arrival: 5, burst: 4, priority: 2 },
            ])
          }}
        >
          Load sample
        </button>
        <button className="btn" onClick={() => onChange([{ pid: 'P1', arrival: 0, burst: 1, priority: 0 }])}>
          Reset
        </button>
      </div>
    </div>
  )
}

