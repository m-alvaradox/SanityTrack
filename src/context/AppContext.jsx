import { useEffect, useMemo, useState } from 'react'
import { dataService } from '../services/dataService'
import { deriveAlerts } from '../utils/alerts'
import { AppContext } from './sanityContext'

export function AppProvider({ children }) {
  const [bathrooms, setBathrooms] = useState([])
  const [storedAlerts, setStoredAlerts] = useState([])
  const [history, setHistory] = useState([])
  const [selectedId, setSelectedId] = useState('bathroom1')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([dataService.getBathrooms(), dataService.getAlerts(), dataService.getHistory()]).then(([bathroomData, alertData, historyData]) => {
      setBathrooms(bathroomData); setStoredAlerts([...deriveAlerts(bathroomData), ...alertData]); setHistory(historyData); setLoading(false)
    })
  }, [])

  const markAttended = (id) => setStoredAlerts((items) => items.map((item) => item.id === id ? { ...item, status: 'attended' } : item))
  const selectedBathroom = bathrooms.find((item) => item.id === selectedId) ?? bathrooms[0]
  const value = useMemo(() => ({ bathrooms, alerts: storedAlerts, history, selectedId, setSelectedId, selectedBathroom, markAttended, loading }), [bathrooms, storedAlerts, history, selectedId, selectedBathroom, loading])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
