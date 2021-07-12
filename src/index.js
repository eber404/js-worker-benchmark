import { Worker } from 'worker_threads'
import color from './consoleColors.js'

const fiboWorker = new Worker('./src/worker.js')

const NUMBER = 35 // higher = slowly execution
const HOW_MANY_ROUNDS = 10 // higher = slowly execution

const msPerRound = []
let currentRound = 0

let START_TIME = Date.now()
fiboWorker.postMessage(NUMBER)

fiboWorker.on('message', () => {
  if (currentRound === HOW_MANY_ROUNDS) {
    const firstRoundExecutionTime = msPerRound.shift()
    const averageExecutionTime =
      msPerRound.reduce((total, value) => (total += value)) / currentRound

    const lowestTime = msPerRound.reduce((prev, next) =>
      prev < next ? prev : next
    )

    console.log()
    console.log(
      'Número de execuções',
      color.FgBlue + currentRound + color.FgWhite
    )
    console.log(
      'Tempo (ms) de execução do primeiro round',
      color.FgRed + firstRoundExecutionTime + color.FgWhite
    )
    console.log(
      'Tempo (ms) médio por execução',
      color.FgYellow + averageExecutionTime.toFixed(3) + color.FgWhite
    )
    console.log(
      `Menor tempo (ms) de execução ${color.FgGreen + lowestTime.toFixed(3)}`
    )
  } else {
    const END_TIME = Date.now()
    const currentRoundExecTime = (END_TIME - START_TIME) / 1000

    msPerRound.push(currentRoundExecTime)
    currentRound++

    START_TIME = Date.now()
    fiboWorker.postMessage(NUMBER)
  }
})

fiboWorker.on('error', (error) => {
  console.log(error)
})
