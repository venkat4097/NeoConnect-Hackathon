"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import API from "@/utils/api"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    department: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await API.post("/api/auth/register", form)
      alert("Registration successful! Please login.")
      router.push("/login")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl shadow-xl mb-4 text-white hover:rotate-6 transition-transform">
            <span className="text-2xl font-bold">N</span>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Join NeoConnect</h1>
          <p className="text-slate-400 font-medium">Create your credentials to get started</p>
        </div>

        <div className="bg-[#141414] border border-white/5 shadow-2xl rounded-3xl p-10">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
                <input
                  required
                  placeholder="John Doe"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Email</label>
                <input
                  required
                  type="email"
                  placeholder="john@company.com"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">System Role</label>
                <select
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-indigo-400"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="staff">Staff</option>
                  <option value="secretariat">Secretariat</option>
                  <option value="case_manager">Case Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Department</label>
                <input
                  required
                  placeholder="Operations, HR..."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium"
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/10 transition-all flex justify-center items-center gap-2 mt-4 ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? "Creating Account..." : "Join the Platform"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already a member?{" "}
              <Link href="/login" className="text-indigo-400 font-bold hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}