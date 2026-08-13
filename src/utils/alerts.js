import { getAirQuality } from '../config/airQuality'

const definitions = [
  { type: 'soap', test: (b) => !b.soap_ok, message: 'Jabón no disponible', severity: 'high' },
  { type: 'paper', test: (b) => !b.paper_ok, message: 'Papel higiénico bajo o no disponible', severity: 'high' },
  { type: 'air', test: (b) => getAirQuality(b.air_raw).tone === 'danger', message: 'La calidad del aire requiere atención', severity: 'critical' },
  { type: 'traffic', test: (b) => b.high_traffic, message: 'Alta afluencia de usuarios', severity: 'medium' }
]

export function deriveAlerts(bathrooms) {
  return bathrooms.flatMap((bathroom) => definitions.filter((item) => item.test(bathroom)).map((item) => ({
    id: `${bathroom.id}-${item.type}`, bathroomId: bathroom.id, type: item.type, message: item.message,
    severity: item.severity, status: 'pending', createdAt: bathroom.lastUpdate
  })))
}
