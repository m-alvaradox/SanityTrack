import { hourlyHistory, mockAlerts, mockBathrooms } from '../data/mockData'

const wait = (value) => Promise.resolve(structuredClone(value))

export const dataService = {
  getBathrooms: () => wait(mockBathrooms),
  getAlerts: () => wait(mockAlerts),
  getHistory: () => wait(hourlyHistory)
}
