import { useEffect, useMemo, useState } from 'react'
import { dataService } from '../services/dataService'
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

  useEffect(() => {
    Promise.all([dataService.getBathrooms(), dataService.getAlerts(), dataService.getHistory()]).then(([bathroomData, alertData, historyData]) => {
      setBathrooms(bathroomData); setStoredAlerts([...deriveAlerts(bathroomData), ...alertData]); setHistory(historyData); setLoading(false)
    })
  }, [])

  useEffect(() => subscribeToBathroom({
    onStatus: setConnectionStatus,
    onError: (error) => setMqttError(error.message),
    onData: (bathroomId, sensorData) => {
      setMqttError(null)
      setBathrooms((items) => {
        const updated = items.map((bathroom) => bathroom.id === bathroomId ? { ...bathroom, ...sensorData } : bathroom)
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

  const markAttended = (id) => setStoredAlerts((items) => items.map((item) => item.id === id ? { ...item, status: 'attended' } : item))
  const selectedBathroom = bathrooms.find((item) => item.id === selectedId) ?? bathrooms[0]
  const value = useMemo(() => ({ bathrooms, alerts: storedAlerts, history, selectedId, setSelectedId, selectedBathroom, markAttended, loading, connectionStatus, mqttError }), [bathrooms, storedAlerts, history, selectedId, selectedBathroom, loading, connectionStatus, mqttError])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
