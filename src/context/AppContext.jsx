import { useEffect, useMemo, useState } from 'react'
import { getBathroomMetadata } from '../config/bathrooms'
import { isFirebaseConfigured } from '../services/firebase'
import { historyToChartData, saveBathroomReading, subscribeToFirestore } from '../services/firestoreService'
import { subscribeToBathroom } from '../services/mqttService'
import { deriveAlerts } from '../utils/alerts'
import { AppContext } from './sanityContext'

export function AppProvider({ children }) {
  const [bathrooms, setBathrooms] = useState([])
  const [storedAlerts, setStoredAlerts] = useState([])
  const [history, setHistory] = useState([])
  const [selectedId, setSelectedId] = useState('bathroom1')
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [mqttError, setMqttError] = useState(null)
  const [mqttLastMessageAt, setMqttLastMessageAt] = useState(null)

  useEffect(() => {
    if (isFirebaseConfigured) return
    import('../services/dataService').then(({ dataService }) => Promise.all([dataService.getBathrooms(), dataService.getAlerts(), dataService.getHistory()])).then(([bathroomData, alertData, historyData]) => {
      setBathrooms(bathroomData); setStoredAlerts([...deriveAlerts(bathroomData), ...alertData]); setHistory(historyData); setLoading(false)
    })
  }, [])

  useEffect(() => subscribeToBathroom({
    onStatus: setConnectionStatus,
    onError: (error) => setMqttError(error.message),
    onData: (bathroomId, sensorData) => {
      setMqttError(null)
      setMqttLastMessageAt(sensorData.lastUpdate)
      setBathrooms((items) => {
        const currentBathroom = items.find((bathroom) => bathroom.id === bathroomId) ?? getBathroomMetadata(bathroomId)
        const nextBathroom = { ...currentBathroom, ...sensorData }
        const updated = items.some((bathroom) => bathroom.id === bathroomId)
          ? items.map((bathroom) => bathroom.id === bathroomId ? nextBathroom : bathroom)
          : [...items, nextBathroom]
        saveBathroomReading(bathroomId, currentBathroom, sensorData).catch((error) => setMqttError(`Firestore: ${error.message}`))
        const generated = deriveAlerts(updated)
        setStoredAlerts((current) => {
          const generatedIds = new Set(generated.map((alert) => alert.id))
          const retained = current.filter((alert) => alert.id.startsWith(`${bathroomId}-`) ? generatedIds.has(alert.id) || alert.status === 'attended' : true)
          const existingIds = new Set(retained.map((alert) => alert.id))
          return [...generated.filter((alert) => !existingIds.has(alert.id)), ...retained]
        })
        return updated
      })
    }
  }), [])

  useEffect(() => subscribeToFirestore({
    onBathrooms: (remoteBathrooms) => {
      setBathrooms(remoteBathrooms.map((remote) => ({ ...getBathroomMetadata(remote.id), ...remote })))
      setStoredAlerts((current) => {
        const generated = deriveAlerts(remoteBathrooms)
        const attended = current.filter((alert) => alert.status === 'attended')
        return [...generated.filter((alert) => !attended.some((item) => item.id === alert.id)), ...attended]
      })
      setLoading(false)
    },
    onHistory: (readings) => setHistory(historyToChartData(readings)),
    onError: (error) => { setMqttError(`Firestore: ${error.message}`); setLoading(false) }
  }), [])

  const markAttended = (id) => setStoredAlerts((items) => items.map((item) => item.id === id ? { ...item, status: 'attended' } : item))
  const selectedBathroom = bathrooms.find((item) => item.id === selectedId) ?? bathrooms[0]
  const value = useMemo(() => ({ bathrooms, alerts: storedAlerts, history, selectedId, setSelectedId, selectedBathroom, markAttended, loading, connectionStatus, mqttError, mqttLastMessageAt }), [bathrooms, storedAlerts, history, selectedId, selectedBathroom, loading, connectionStatus, mqttError, mqttLastMessageAt])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
