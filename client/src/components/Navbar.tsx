"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(storedUser)

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const navLinks = [
    { label: "Overview", href: "/dashboard", roles: ["staff", "secretariat", "case_manager", "admin"] },
    { label: "Report Case", href: "/submitcase", roles: ["staff"] },
    { label: "Polls", href: "/polls", roles: ["staff", "secretariat", "case_manager", "admin"] },
    { label: "Public Hub", href: "/public-hub", roles: ["staff", "secretariat", "case_manager", "admin"] },
    { label: "Analytics", href: "/analytics", roles: ["secretariat", "admin"] },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3 px-6" : "py-6 px-10"}`}>
      <div className={`max-w-7xl mx-auto rounded-3xl transition-all duration-500 ${scrolled ? "bg-[#0a0a0a]/80 backdrop-blur-2xl shadow-2xl border border-white/5 py-3 px-6" : "bg-transparent py-0 px-0"}`}>
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-all">
                <span className="text-2xl font-bold italic">N</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tighter">NeoConnect</span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.filter(link => !link.roles || link.roles.includes(user?.role)).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    pathname === link.href
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <AnimatePresence>
              {user && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6"
                >
                  <div className="text-right">
                    <p className="text-sm font-bold text-white leading-none mb-1">{user.name}</p>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full">{user.role}</span>
                  </div>
                  <div className="w-10 h-10 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-sm">
                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`} alt="User" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={logout}
              className="p-2.5 bg-[#1a1a1a] text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-white/5 rounded-xl transition-all"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}