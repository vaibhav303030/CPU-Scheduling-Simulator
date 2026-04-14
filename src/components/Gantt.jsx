import { hashColor } from '../sim/utils.js'

export function Gantt({ timeline }) {
  if (timeline.length === 0) {
    return <div className="empty">No timeline to display.</div>
  }

  const total = timeline[timeline.length - 1].end
  const labels = Array.from(new Set(timeline.map((s) => s.label))).filter((l) => l !== 'IDLE')

  return (
    <div className="ganttWrap">
      <div className="ganttBar" role="img" aria-label="Gantt chart">
        {timeline.map((s, i) => {
          const widthPct = total === 0 ? 0 : ((s.end - s.start) / total) * 100
          const bg = s.label === 'IDLE' ? 'rgba(148,163,184,0.35)' : hashColor(s.label)
          return (
            <div
              key={`${i}-${s.label}-${s.start}-${s.end}`}
              className="ganttSlice"
              style={{ width: `${widthPct}%`, background: bg }}
              title={`${s.label} [${s.start} → ${s.end}]`}
            >
              <span className="ganttLabel">{s.label}</span>
            </div>
          )
        })}
      </div>

      <div className="ganttTicks">
        {timeline.map((s, i) => (
          <div key={`tick-${i}-${s.start}`} className="tick">
            <span>{s.start}</span>
          </div>
        ))}
        <div className="tick end">
          <span>{total}</span>
        </div>
      </div>

      <div className="legend">
        <div className="legendItem">
          <span className="swatch" style={{ background: 'rgba(148,163,184,0.35)' }} />
          <span>IDLE</span>
        </div>
        {labels.map((l) => (
          <div key={l} className="legendItem">
            <span className="swatch" style={{ background: hashColor(l) }} />
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

