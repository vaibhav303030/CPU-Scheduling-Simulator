// JavaScript version: this file keeps shared constants and (optional) JSDoc typedefs.

export const ALGORITHMS = /** @type {const} */ ({
  FCFS: 'FCFS',
  SJF: 'SJF',
  PRIORITY: 'PRIORITY',
})

/**
 * @typedef {'FCFS' | 'SJF' | 'PRIORITY'} Algorithm
 * @typedef {{ pid: string, arrival: number, burst: number, priority: number }} ProcessInput
 * @typedef {{ label: string, start: number, end: number }} TimelineSlice
 * @typedef {{
 *  pid: string,
 *  arrival: number,
 *  burst: number,
 *  priority: number,
 *  startTime: number,
 *  completionTime: number,
 *  turnaroundTime: number,
 *  waitingTime: number,
 *  responseTime: number
 * }} PerProcessMetrics
 * @typedef {{ algorithm: Algorithm, preemptive: boolean }} SimulationOptions
 * @typedef {{ timeline: TimelineSlice[], perProcess: PerProcessMetrics[], makespan: number }} SimulationResult
 */


