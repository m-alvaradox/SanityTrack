import mqtt from 'mqtt'
import { MQTT_CONFIG } from '../config/mqtt'

const EXPECTED_FIELDS = ['soap_ok', 'paper_ok', 'air_raw', 'high_traffic']

const isNonNegativeInteger = (value) => Number.isInteger(value) && value >= 0

export function parseSensorMessage(payload) {
  let data
  try { data = JSON.parse(payload.toString()) } catch { throw new Error('El mensaje MQTT no contiene JSON válido') }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('El mensaje MQTT debe ser un objeto JSON')
  const missing = EXPECTED_FIELDS.filter((field) => !(field in data))
  if (missing.length) throw new Error(`Faltan campos: ${missing.join(', ')}`)
  const people = data.people_estimated_total ?? data.people
  if (!isNonNegativeInteger(people)) throw new Error('people_estimated_total (o people) debe ser un entero no negativo')
  if (typeof data.air_raw !== 'number' || !Number.isFinite(data.air_raw) || data.air_raw < 0) throw new Error('air_raw debe ser un número no negativo')
  for (const field of ['soap_ok', 'paper_ok', 'high_traffic']) {
    if (typeof data[field] !== 'boolean') throw new Error(`${field} debe ser booleano`)
  }
  for (const field of ['door_signals_window', 'people_estimated_window', 'door_signals_total', 'people_estimated_total']) {
    if (field in data && !isNonNegativeInteger(data[field])) throw new Error(`${field} debe ser un entero no negativo`)
  }
  if ('person_inside_pending' in data && typeof data.person_inside_pending !== 'boolean') throw new Error('person_inside_pending debe ser booleano')
  if ('battery_v' in data && (typeof data.battery_v !== 'number' || !Number.isFinite(data.battery_v) || data.battery_v < 0)) throw new Error('battery_v debe ser un número no negativo')

  return {
    people,
    door_signals_window: data.door_signals_window ?? null,
    people_estimated_window: data.people_estimated_window ?? null,
    door_signals_total: data.door_signals_total ?? null,
    people_estimated_total: data.people_estimated_total ?? people,
    person_inside_pending: data.person_inside_pending ?? false,
    last_janitor_reset: data.last_janitor_reset ?? null,
    soap_ok: data.soap_ok,
    paper_ok: data.paper_ok,
    air_raw: data.air_raw,
    battery_v: data.battery_v ?? null,
    high_traffic: data.high_traffic,
    lastUpdate: new Date().toISOString()
  }
}

export function subscribeToBathroom({ onData, onStatus, onError }) {
  if (!MQTT_CONFIG.enabled) { onStatus('mock'); return () => {} }
  onStatus('connecting')
  const client = mqtt.connect(MQTT_CONFIG.brokerUrl, { clientId: `sanitytrack-web-${crypto.randomUUID()}`, clean: true, connectTimeout: 10_000, reconnectPeriod: 5_000 })
  client.on('connect', () => client.subscribe(MQTT_CONFIG.topic, { qos: 0 }, (error) => { if (error) { onStatus('error'); onError(error) } else onStatus('connected') }))
  client.on('reconnect', () => onStatus('connecting'))
  client.on('offline', () => onStatus('offline'))
  client.on('error', (error) => { onStatus('error'); onError(error) })
  client.on('message', (topic, payload) => {
    if (topic !== MQTT_CONFIG.topic) return
    try { onData(MQTT_CONFIG.bathroomId, parseSensorMessage(payload)) } catch (error) { onError(error) }
  })
  return () => client.end(true)
}
