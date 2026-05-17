export function MetricsTable({ metrics }) {
  if (metrics.length === 0) {
    return <div className="empty">No metrics to display.</div>
  }

  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>PID</th>
            <th>AT</th>
            <th>BT</th>
            <th>Pr</th>
            <th>Start</th>
            <th>CT</th>
            <th>TAT</th>
            <th>WT</th>
            <th>RT</th>
          </tr>
        </thead>
        <tbody>
        <h1>hiii</h1>
        
          {metrics.map((m) => (
            <tr key={m.pid}>
              <td className="mono">{m.pid}</td>
              <td>{m.arrival}</td>
              <td>{m.burst}</td>
              <td>{m.priority}</td>
              <td>{m.startTime}</td>
              <td>{m.completionTime}</td>
              <td>{m.turnaroundTime}</td>
              <td>{m.waitingTime}</td>
              <td>{m.responseTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="hint">
        Abbreviations: AT=Arrival, BT=Burst, Pr=Priority, CT=Completion, TAT=Turnaround, WT=Waiting, RT=Response.
      </div>
    </div>
  )
}

