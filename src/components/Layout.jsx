import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  const [open, setOpen] = useState(false)
  return <div className="app-shell"><Sidebar open={open} onClose={() => setOpen(false)} />{open && <button className="backdrop" onClick={() => setOpen(false)} aria-label="Cerrar menú" />}<div className="main-column"><Header onMenu={() => setOpen(true)} /><main><Outlet /></main></div></div>
}
