import { Bell, Building2, History, LayoutDashboard, Radio, ShieldCheck, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  ['/', 'Dashboard', LayoutDashboard], ['/monitoring', 'Monitoreo', Radio], ['/alerts', 'Alertas', Bell],
  ['/history', 'Historial', History], ['/bathrooms', 'Baños', Building2]
]

export default function Sidebar({ open, onClose }) {
  return <aside className={`sidebar ${open ? 'open' : ''}`}>
    <div className="brand"><span className="brand-mark"><ShieldCheck size={23} /></span><div><strong>Sanity Track</strong><small>IoT Monitoring</small></div><button className="icon-button sidebar-close" onClick={onClose} aria-label="Cerrar menú"><X /></button></div>
    <nav>{links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'} onClick={onClose}><Icon size={19} /><span>{label}</span></NavLink>)}</nav>
    <div className="sidebar-footer"><span className="live-dot" />Sistema operativo<small>Datos simulados</small></div>
  </aside>
}
