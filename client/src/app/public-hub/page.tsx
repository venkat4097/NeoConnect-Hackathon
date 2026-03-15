"use client"

import { useEffect, useState } from "react"
import API from "@/utils/api"
import Navbar from "@/components/Navbar"
import { motion } from "framer-motion"

export default function PublicHub() {
  const [publicCases, setPublicCases] = useState<any[]>([])
  const [minutes, setMinutes] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const casesRes = await API.get("/cases/public")
      const minutesRes = await API.get("/minutes")
      setPublicCases(casesRes.data as any[])
      setMinutes(minutesRes.data as any[])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-[#0a0a0a] relative pb-20">
      <Navbar />

      {/* Dynamic Header */}
      <div className="bg-indigo-950/20 pt-32 pb-48 px-10 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-3 text-indigo-400/60 text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <span>Platform</span> <span>•</span> <span>Public Ledger</span>
          </motion.nav>
          <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter mb-4">Clarity <span className="text-indigo-500">&</span> Impact</h1>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Witness the evolution of our workspace. We believe in total transparency, showing how your voice transforms our daily operations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 -mt-24 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Real-time Impact Ledger - Spans 2 Columns */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-4 space-y-8"
        >
          <div className="bg-[#141414] border border-white/5 shadow-2xl rounded-[32px] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white tracking-tight">Impact Tracking Ledger</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/10">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Verified Resolutions
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/5">
                <thead className="bg-white/[0.02]">
                  <tr>
                    <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Context</th>
                    <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operational Action</th>
                    <th className="px-8 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Final Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {publicCases.map((c, i) => (
                    <tr key={c._id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">{c.category}</span>
                        <p className="text-sm font-bold text-white line-clamp-2">{c.description}</p>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-400 font-medium">{c.actionTaken}</td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 inline-flex text-[10px] font-bold uppercase tracking-widest rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 shadow-sm">
                          {c.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {publicCases.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center text-slate-500 font-bold italic opacity-40">Awaiting the first verified impact reporting...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            {publicCases.slice(0, 4).map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#141414] p-8 rounded-[32px] shadow-2xl border border-white/5 hover:border-indigo-500/20 transition-all group"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/5 px-3 py-1 rounded-full uppercase tracking-widest">{c.category}</span>
                  <span className="text-[10px] font-medium text-slate-600">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-indigo-400 transition-colors">{c.trackingId}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-4">{c.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        

      </div>
    </div>
  )
}
