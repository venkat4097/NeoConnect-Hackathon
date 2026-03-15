"use client"

import { useEffect, useState } from "react"
import API from "@/utils/api"
import Navbar from "@/components/Navbar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function Polls() {
  const router = useRouter()
  const [polls, setPolls] = useState<any[]>([])
  const [newQuestion, setNewQuestion] = useState("")
  const [newOptions, setNewOptions] = useState(["", ""])
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(true)

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"]

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    setRole(user.role || "")
    fetchPolls()
  }, [])

  const fetchPolls = async () => {
    try {
      const res = await API.get("/polls")
      setPolls(res.data as any[])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      await API.post(`/polls/${pollId}/vote`, { optionIndex })
      fetchPolls()
    } catch (err: any) {
      alert(err.response?.data || "Error voting")
    }
  }

  const createPoll = async () => {
    try {
      const options = newOptions.filter(o => o.trim() !== "")
      await API.post("/polls", { question: newQuestion, options })
      setNewQuestion("")
      setNewOptions(["", ""])
      fetchPolls()
    } catch (err) {
      alert("Error creating poll")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative pb-20">
      <Navbar />
      
      {/* Dynamic Header */}
      <div className="bg-black pt-32 pb-48 px-10 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl shadow-2xl" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <nav className="flex justify-center gap-3 text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-6">
            <span>Platform</span> <span>•</span> <span>Sentiment Board</span>
          </nav>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">Collective Pulse</h1>
          <p className="text-indigo-100 font-medium max-w-xl mx-auto opacity-90">
            Real-time decision making and staff sentiment. Your vote directly influences company policy and culture.
          </p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] max-w-7xl mx-auto px-10 -mt-24 relative z-20">
        
        {role === "secretariat" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141414] backdrop-blur-2xl border border-white/5 shadow-2xl rounded-[32px] p-10 mb-12"
          >
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/30">➕</div>
               <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Initiate Sentiment Check</h2>
                  <p className="text-slate-400 text-sm font-medium">Gather staff consensus with a new referendum.</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Polling Question</label>
                    <input
                        placeholder="What is your stance on...?"
                        className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-white placeholder:text-slate-600"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                    />
                </div>
                <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Response Vectors</label>
                    {newOptions.map((opt, i) => (
                        <input
                            key={i}
                            placeholder={`Option ${i + 1}`}
                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all font-bold text-white placeholder:text-slate-600"
                            value={opt}
                            onChange={(e) => {
                                const copy = [...newOptions]
                                copy[i] = e.target.value
                                setNewOptions(copy)
                            }}
                        />
                    ))}
                    <div className="flex gap-4 pt-2">
                        <button
                            className="px-4 py-2 text-xs font-bold text-indigo-400 hover:bg-white/5 border border-white/5 rounded-xl transition-all"
                            onClick={() => setNewOptions([...newOptions, ""])}
                        >
                            + Append Vector
                        </button>
                        <button
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform active:scale-95"
                            onClick={createPoll}
                        >
                            Broadcast Poll
                        </button>
                    </div>
                </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
          <AnimatePresence>
            {polls.map((poll, i) => {
              const data = poll.options.map((opt: string, idx: number) => ({
                name: opt,
                votes: poll.votes.filter((v: any) => v.optionIndex === idx).length
              }))
              const totalVotes = poll.votes.length

              return (
                <motion.div 
                  key={poll._id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#141414] border border-white/5 p-8 rounded-[32px] shadow-2xl transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white tracking-tight leading-tight max-w-[70%]">{poll.question}</h3>
                    <div className="bg-white/5 text-slate-400 px-3 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-white/5">
                        {totalVotes} Responses
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {poll.options.map((opt: string, idx: number) => {
                      const vCount = poll.votes.filter((v: any) => v.optionIndex === idx).length
                      const percentage = totalVotes > 0 ? (vCount / totalVotes) * 100 : 0
                      
                      return (
                        <button
                          key={idx}
                          className="w-full relative group overflow-hidden"
                          onClick={() => handleVote(poll._id, idx)}
                        >
                          <div className="relative z-10 flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/[0.02] group-hover:bg-white/5 transition-all font-bold text-sm">
                            <span className="text-slate-300 group-hover:text-white transition-colors uppercase tracking-tight">{opt}</span>
                            <span className="text-indigo-400 opacity-60 group-hover:opacity-100">{percentage.toFixed(0)}%</span>
                          </div>
                          {/* Progress Indicator */}
                          <div 
                            className="absolute inset-0 bg-indigo-500/5 rounded-xl transition-all duration-1000 origin-left"
                            style={{ width: `${percentage}%` }}
                          />
                        </button>
                      )
                    })}
                  </div>

                  <div className="h-56 w-full mt-6 bg-[#0a0a0a]/50 rounded-2xl p-4 border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                        />
                        <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#141414', borderRadius: '16px', border: '1px solid #ffffff10' }} />
                        <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                          {data.map((_entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
        
        {polls.length === 0 && !loading && (
            <div className="p-32 text-center text-slate-500 font-bold flex flex-col items-center italic">
                <div className="text-7xl mb-6 opacity-20">🗳️</div>
                <p className="text-xl tracking-tighter">No active referendum detected.</p>
            </div>
        )}
      </div>
    </div>
  )
}