import { collection, doc, limit, onSnapshot, orderBy, query, serverTimestamp, writeBatch } from 'firebase/firestore'
import { firestore, isFirebaseConfigured } from './firebase'

const toIso = (value) => value?.toDate ? value.toDate().toISOString() : value

export function subscribeToFirestore({ onBathrooms, onHistory, onError }) {
  if (!isFirebaseConfigured || !firestore) return () => {}

  const unsubscribeBathrooms = onSnapshot(collection(firestore, 'bathrooms'), (snapshot) => {
    onBathrooms(snapshot.docs.map((item) => ({ id: item.id, ...item.data(), lastUpdate: toIso(item.data().lastUpdate) })))
  }, onError)

  const historyQuery = query(collection(firestore, 'readings'), orderBy('recordedAt', 'desc'), limit(50))
  const unsubscribeHistory = onSnapshot(historyQuery, (snapshot) => {
    const readings = snapshot.docs.map((item) => ({ id: item.id, ...item.data(), recordedAt: toIso(item.data().recordedAt) })).reverse()
    onHistory(readings)
  }, onError)

  return () => { unsubscribeBathrooms(); unsubscribeHistory() }
}

export async function saveBathroomReading(bathroomId, bathroom, sensorData) {
  if (!isFirebaseConfigured || !firestore) return
  const receivedAt = new Date(sensorData.lastUpdate)
  const minuteId = Math.floor(receivedAt.getTime() / 60_000)
  const batch = writeBatch(firestore)

  batch.set(doc(firestore, 'bathrooms', bathroomId), {
    ...bathroom,
    ...sensorData,
    id: bathroomId,
    lastUpdate: serverTimestamp()
  }, { merge: true })

  batch.set(doc(firestore, 'readings', `${bathroomId}-${minuteId}`), {
    bathroomId,
    people: sensorData.people,
    soap_ok: sensorData.soap_ok,
    paper_ok: sensorData.paper_ok,
    air_raw: sensorData.air_raw,
    high_traffic: sensorData.high_traffic,
    door_signals_window: sensorData.door_signals_window,
    people_estimated_window: sensorData.people_estimated_window,
    door_signals_total: sensorData.door_signals_total,
    people_estimated_total: sensorData.people_estimated_total,
    person_inside_pending: sensorData.person_inside_pending,
    last_janitor_reset: sensorData.last_janitor_reset,
    battery_v: sensorData.battery_v,
    recordedAt: serverTimestamp()
  })

  await batch.commit()
}

export const historyToChartData = (readings) => readings.map((reading) => ({
  hour: reading.recordedAt ? new Intl.DateTimeFormat('es-EC', { hour: '2-digit', minute: '2-digit' }).format(new Date(reading.recordedAt)) : '--:--',
  people: reading.people,
  air: reading.air_raw
})).slice(-12)
