import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { AppProvider } from './context/AppContext'
import Alerts from './pages/Alerts'
import Bathrooms from './pages/Bathrooms'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Monitoring from './pages/Monitoring'
import NotFound from './pages/NotFound'

export default function App() {
  return <BrowserRouter><AppProvider><Routes><Route element={<Layout />}><Route index element={<Dashboard />} /><Route path="monitoring" element={<Monitoring />} /><Route path="alerts" element={<Alerts />} /><Route path="history" element={<History />} /><Route path="bathrooms" element={<Bathrooms />} /><Route path="*" element={<NotFound />} /></Route></Routes></AppProvider></BrowserRouter>
}
