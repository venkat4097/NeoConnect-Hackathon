"use client"

import { useEffect, useState } from "react"
import API from "@/utils/api"
import Navbar from "@/components/Navbar"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from "recharts"
import { motion } from "framer-motion"

export default function Analytics() {
  const [stats, setStats] = useState<any>({
    byDept: [],
    byStatus: [],
    byCategory: [],
    hotspots: []
  })
  const [loading, setLoading] = useState(true)

  const COLORS = ["#6366f1", "#ef4444", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"]

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "/login"
      return
    }
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await API.get("/cases")
      const cases = res.data as any[]

      const deptMap: any = {}
      const statusMap: any = {}
      const categoryMap: any = {}
      const hotspotMap: any = {}

      cases.forEach((c: any) => {
        deptMap[c.department] = (deptMap[c.department] || 0) + 1
        statusMap[c.status] = (statusMap[c.status] || 0) + 1
        categoryMap[c.category] = (categoryMap[c.category] || 0) + 1

        const key = `${c.department}-${c.category}`
        hotspotMap[key] = (hotspotMap[key] || 0) + 1
      })

      const hotspots = Object.entries(hotspotMap)
        .filter(([_, count]: any) => count >= 5)
        .map(([key, count]: any) => {
          const [dept, cat] = key.split("-")
          return { dept, cat, count }
        })

      setStats({
        byDept: Object.entries(deptMap).map(([name, value]) => ({ name, value })),
        byStatus: Object.entries(statusMap).map(([name, value]) => ({ name, value })),
        byCategory: Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
        hotspots
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative pb-20">
      <Navbar />
      
      {/* Premium Header */}
      <div className="bg-indigo-950/20 pt-32 pb-48 px-10 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10 gap-8">
            <div className="text-center md:text-left">
                <nav className="flex justify-center md:justify-start gap-3 text-indigo-400/60 text-[10px] font-bold uppercase tracking-widest mb-6">
                    <span>Intelligence</span> <span>•</span> <span>Operational Matrix</span>
                </nav>
                <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">Command <span className="text-indigo-500">Analytics</span></h1>
                <p className="text-slate-400 font-medium max-w-xl leading-relaxed">
                    High-fidelity observation of company sentiment and departmental health. Precision data for structural decisions.
                </p>
            </div>
            
            {/* Quick Metrics */}
            <div className="flex gap-4">
                <div className="bg-[#141414] border border-white/5 p-6 rounded-[32px] text-center min-w-[140px] shadow-2xl">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1 block">Total Cases</span>
                    <span className="text-3xl font-bold text-white">{stats.byStatus.reduce((acc: any, curr: any) => acc + curr.value, 0)}</span>
                </div>
                <div className="bg-[#141414] border border-white/5 p-6 rounded-[32px] text-center min-w-[140px] shadow-2xl">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1 block">Hotspots</span>
                    <span className="text-3xl font-bold text-white">{stats.hotspots.length}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 -mt-24 relative z-20">
        
        {/* Hotspots Section */}
        {stats.hotspots.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-950/20 border border-red-500/20 p-8 rounded-[32px] mb-12 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -z-0" />
            <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                    <span className="flex h-4 w-4 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                    </span>
                    Critical Departmental Hotspots
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.hotspots.map((h: any, i: number) => (
                    <motion.div 
                        key={i} 
                        whileHover={{ scale: 1.02 }}
                        className="bg-[#1a1a1a]/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 text-white"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Sector Under Threat</p>
                        <p className="text-xl font-bold mb-4 tracking-tighter">{h.dept}</p>
                        <div className="flex justify-between items-end border-t border-white/5 pt-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Anomaly Type</p>
                                <p className="text-sm font-bold text-red-400/80">{h.cat}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Volume</p>
                                <p className="text-2xl font-bold text-red-500">{h.count}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
                </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Breakdown Circle */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#141414] p-10 rounded-[32px] shadow-2xl border border-white/5"
          >
            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Lifecycle Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.byStatus} innerRadius={80} outerRadius={120} paddingAngle={8} dataKey="value" stroke="none">
                    {stats.byStatus.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#141414', borderRadius: '20px', border: '1px solid #ffffff10', color: '#fff' }} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Departmental Volume Bar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#141414] p-10 rounded-[32px] shadow-2xl border border-white/5"
          >
            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Sector Load Statistics</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byDept}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: '#ffffff03' }} contentStyle={{ backgroundColor: '#141414', borderRadius: '16px', border: '1px solid #ffffff10' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Horizontal Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141414] p-10 rounded-[32px] shadow-2xl border border-white/5 lg:col-span-2"
          >
            <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">System-Wide Categorization</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.byCategory}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#141414', borderRadius: '16px', border: '1px solid #ffffff10' }} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
