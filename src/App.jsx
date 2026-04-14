import { useMemo, useState } from 'react'
import './App.css'
import { Gantt } from './components/Gantt.jsx'
import { MetricsTable } from './components/MetricsTable.jsx'
import { ProcessTable } from './components/ProcessTable.jsx'
import { simulate } from './sim/scheduler.js'
import { computeAverages } from './sim/metrics.js'

const initialProcesses = [
  { pid: 'P1', arrival: 0, burst: 7, priority: 2 },
  { pid: 'P2', arrival: 2, burst: 4, priority: 1 },
  { pid: 'P3', arrival: 4, burst: 1, priority: 3 },
  { pid: 'P4', arrival: 5, burst: 4, priority: 2 },
]

export default function App() {
  const [processes, setProcesses] = useState(initialProcesses)
  const [algorithm, setAlgorithm] = useState('FCFS')
  const [preemptive, setPreemptive] = useState(false)

  const result = useMemo(() => {
    return simulate(processes, { algorithm, preemptive })
  }, [processes, algorithm, preemptive])

  const averages = useMemo(() => computeAverages(result.perProcess), [result])

  return (
    <div className="page">
      <header className="header">
        <div className="titleBlock">
          <h1>CPU Scheduling Simulator</h1>
          <p className="subtitle">
            Compare <b>preemptive</b> vs <b>non-preemptive</b> scheduling using real
            arrival times, metrics, and a Gantt chart.
          </p>
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <div className="cardHeader">
            <h2>1) Inputs</h2>
            <div className="controls">
              <label className="field">
                <span className="label">Algorithm</span>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                >
                  <option value="FCFS">FCFS</option>
                  <option value="SJF">SJF</option>
                  <option value="PRIORITY">Priority</option>
                </select>
              </label>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={preemptive}
                  onChange={(e) => setPreemptive(e.target.checked)}
                  disabled={algorithm === 'FCFS'}
                />
                <span>Preemptive</span>
              </label>
            </div>
          </div>

          <ProcessTable processes={processes} onChange={setProcesses} />

          <div className="hint">
            <b>Note:</b> For Priority, smaller number means higher priority
            (priority 1 runs before priority 2).
          </div>
        </section>

        <section className="card">
          <div className="cardHeader">
            <h2>2) Gantt chart</h2>
            <div className="pill">
              Total time: <b>{result.makespan}</b>
            </div>
          </div>
          <Gantt timeline={result.timeline} />
        </section>

        <section className="card">
          <div className="cardHeader">
            <h2>3) Metrics</h2>
            <div className="pillRow">
              <div className="pill">
                Avg Waiting: <b>{averages.avgWaiting.toFixed(2)}</b>
              </div>
              <div className="pill">
                Avg Turnaround: <b>{averages.avgTurnaround.toFixed(2)}</b>
              </div>
              <div className="pill">
                Avg Response: <b>{averages.avgResponse.toFixed(2)}</b>
              </div>
            </div>
          </div>

          <MetricsTable metrics={result.perProcess} />
        </section>

        <section className="card">
          <div className="cardHeader">
            <h2>4) Compare & justify</h2>
          </div>
          <div className="twoCol">
            <div>
              <h3 className="h3">When preemptive is beneficial</h3>
              <ul className="bullets">
                <li>
                  Improves <b>response time</b> for interactive/short jobs (e.g.,
                  SRTF or preemptive Priority).
                </li>
                <li>
                  Helps when arrivals happen often and short/high-priority jobs
                  should not wait behind long CPU bursts.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="h3">When non-preemptive is preferable</h3>
              <ul className="bullets">
                <li>
                  Lower overhead: fewer context switches, simpler implementation.
                </li>
                <li>
                  Good when workloads are batch-like and you want predictable
                  execution once a job starts.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>
          Made by @_SUPREME
        </span>
      </footer>
    </div>
  )
}
