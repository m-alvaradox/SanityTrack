import { Bell, Menu } from 'lucide-react'
import { useApp } from '../context/sanityContext'

export default function Header({ onMenu }) {
  const { alerts, connectionStatus } = useApp()
  const pending = alerts.filter((item) => item.status === 'pending').length
  const connectionLabel = { connected: 'MQTT conectado', connecting: 'Conectando MQTT', offline: 'MQTT sin conexión', error: 'Error MQTT', mock: 'Datos simulados' }[connectionStatus]
  return <header className="topbar"><button className="icon-button menu-button" onClick={onMenu} aria-label="Abrir menú"><Menu /></button><div><span className="eyebrow">Panel de control</span><h1>Monitoreo inteligente</h1></div><div className="header-actions"><span className={`connection ${connectionStatus}`} title={connectionLabel}><i />{connectionLabel}</span><div className="notification"><Bell size={20} />{pending > 0 && <b>{pending}</b>}</div><div className="avatar">ST</div></div></header>
}
