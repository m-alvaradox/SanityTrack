import { Bell, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/sanityContext'

export default function Header({ onMenu }) {
  const { alerts, connectionStatus } = useApp()
  const navigate = useNavigate()
  const pending = alerts.filter((item) => item.status === 'pending').length
  const connectionLabel = { connected: 'MQTT conectado', connecting: 'Conectando MQTT', offline: 'MQTT sin conexión', error: 'Error MQTT', mock: 'Datos simulados' }[connectionStatus]
  return <header className="topbar"><button type="button" className="icon-button menu-button" onClick={onMenu} aria-label="Abrir menú"><Menu /></button><div><span className="eyebrow">Panel de control</span><h1>Monitoreo inteligente</h1></div><div className="header-actions"><span className={`connection ${connectionStatus}`} title={connectionLabel}><i />{connectionLabel}</span><button type="button" className="notification" onClick={() => navigate('/alerts')} title="Ir a Alertas" aria-label={`Ver alertas${pending > 0 ? `, ${pending} pendientes` : ''}`}><Bell size={20} />{pending > 0 && <b>{pending}</b>}</button><div className="avatar">ST</div></div></header>
}
