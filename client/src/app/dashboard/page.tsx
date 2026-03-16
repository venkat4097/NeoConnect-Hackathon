"use client"

import { useEffect, useState } from "react"
import API from "@/utils/api"
import Navbar from "@/components/Navbar"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Dashboard() {
  const router = useRouter()
  const [cases, setCases] = useState<any[]>([])
  const [managers, setManagers] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
    setUser(storedUser)
    loadData(storedUser)
  }, [])

  const loadData = async (currentUser: any) => {
    try {
      let res
      if (currentUser.role === "staff") {
        res = await API.get("/api/cases")
      } else if (currentUser.role === "case_manager") {
        res = await API.get("/api/cases/my")
      } else {
        res = await API.get("/api/cases")
      }
      setCases(res.data as any[])

      if (currentUser.role === "secretariat" || currentUser.role === "admin") {
        const usersRes = await API.get("/api/auth/users")
        setManagers((usersRes.data as any[]).filter((u: any) => u.role === "case_manager"))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const assignCase = async (caseId: string, managerId: string) => {
    try {
      await API.put(`/api/cases/${caseId}/assign`, { managerId })
      loadData(user)
    } catch (err) {
      alert("Error assigning case")
    }
  }

  const resolveCase = async (caseId: string) => {
    const actionTaken = prompt("What action was taken?")
    const outcome = prompt("What was the outcome?")
    const isPublic = confirm("Make this case public in the Hub?")
    if (actionTaken && outcome) {
      try {
        await API.put(`/api/cases/${caseId}/resolve`, { actionTaken, outcome, isPublic })
        loadData(user)
      } catch (err) {
        alert("Error resolving case")
      }
    }
  }

  const updateStatus = async (caseId: string, status: string) => {
    try {
      await API.put(`/api/cases/${caseId}/status`, { status })
      loadData(user)
    } catch (err) {
      alert("Error updating status")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-indigo-950/20 pt-32 pb-48 px-10 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
          <div>
            <nav className="flex gap-2 text-indigo-400/60 text-[10px] font-bold uppercase tracking-widest mb-4">
              <span>Platform</span> <span>/</span> <span>Case Board</span>
            </nav>
            <h1 className="text-5xl font-bold text-white tracking-tight mb-2">Central Operations</h1>
            <p className="text-slate-400 font-medium">Managing staff trust and company accountability.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#141414] border border-white/5 p-6 rounded-3xl text-white min-w-[160px] shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Active Cases</p>
              <p className="text-4xl font-bold">{cases.filter(c => c.status !== "Resolved").length}</p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl text-emerald-400 min-w-[160px] shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Resolved</p>
              <p className="text-4xl font-bold">{cases.filter(c => c.status === "Resolved").length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-10 -mt-24 relative z-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141414] border border-white/5 shadow-2xl rounded-[32px] overflow-hidden"
        >
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white tracking-tight leading-none">System Ledger</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-8 py-5">Case ID</th>
                  <th className="px-8 py-5">Summary</th>
                  <th className="px-8 py-5">Severity</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Assigned Agent</th>
                  <th className="px-8 py-5 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cases.map((c, i) => (
                  <tr
                    key={c._id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-indigo-400 tracking-tight">{c.trackingId}</span>
                        <span className="text-[10px] font-medium text-slate-600">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-white leading-tight mb-1">{c.category}</p>
                      <p className="text-xs text-slate-500 font-medium">{c.department} • {c.location}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${c.severity === "High" ? "bg-red-500/10 text-red-500 border border-red-500/10" :
                          c.severity === "Medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/10" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10"
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${c.severity === "High" ? "bg-red-500 animate-pulse" :
                            c.severity === "Medium" ? "bg-amber-500" : "bg-emerald-500"
                          }`} />
                        {c.severity}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${c.status === "New" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" :
                          c.status === "Escalated" ? "bg-red-600 text-white shadow-lg shadow-red-500/20 animate-pulse" :
                            c.status === "Resolved" ? "bg-white text-[#0a0a0a]" : "bg-white/5 text-slate-300 border border-white/5"
                        }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
                          {c.assignedTo?.name ? c.assignedTo.name[0] : "?"}
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                          {c.assignedTo?.name || "Pending..."}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-9 text-right">
                      <div className="flex justify-end gap-2">
                        {user?.role === "secretariat" && (
                          <select
                            className="text-[20px] font-bold uppercase tracking-widest border border-white/10 rounded-xl p-2 bg-black text-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            onChange={(e) => assignCase(c._id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Dispatch</option>
                            {managers.map(m => (
                              <option key={m._id} value={m._id}>{m.name}</option>
                            ))}
                          </select>
                        )}
                        {user?.role === "case_manager" && c.status !== "Resolved" && (
                          <div className="inline-flex bg-white/5 border border-white/10 p-1 rounded-xl">
                            <button onClick={() => updateStatus(c._id, "In Progress")} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:bg-white/5 rounded-lg transition-colors">Start</button>
                            <button onClick={() => resolveCase(c._id)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-500 transition-colors">Resolve</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cases.length === 0 && !loading && (
              <div className="p-32 text-center">
                <div className="text-6xl mb-4 opacity-20">🗃️</div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-1">Silence is Golden</h3>
                <p className="text-slate-500 font-medium">No open cases detected.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}