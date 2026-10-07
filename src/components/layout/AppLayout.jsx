import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from '../common/Footer'

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-full flex-col">
      <Navbar onMenuClick={() => setMenuOpen(true)} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  )
}