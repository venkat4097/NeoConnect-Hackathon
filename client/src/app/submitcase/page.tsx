"use client"

import { useState } from "react"
import API from "@/utils/api"
import Navbar from "@/components/Navbar"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function SubmitCase() {
  const router = useRouter()
  const [category, setCategory] = useState("Safety")
  const [department, setDepartment] = useState("")
  const [location, setLocation] = useState("")
  const [severity, setSeverity] = useState("Low")
  const [description, setDescription] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useState(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (!token) router.push("/login")
    }
  })

  const submitCase = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("category", category)
      formData.append("department", department)
      formData.append("location", location)
      formData.append("severity", severity)
      formData.append("description", description)
      formData.append("anonymous", String(anonymous))


      await API.post("/api/cases", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      setSubmitted(true)
      setTimeout(() => router.push("/dashboard"), 3000)
    } catch (err) {
      alert("Error submitting case")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Submit Case</h1>
          <p className="text-slate-400">Please provide details about the issue you encountered.</p>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-[#141414] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Category</label>
                    <select
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option>Safety</option>
                      <option>Policy</option>
                      <option>Facilities</option>
                      <option>HR</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Severity</label>
                    <select
                      className={`w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-white ${severity === 'High' ? 'text-red-400' :
                          severity === 'Medium' ? 'text-amber-400' : 'text-indigo-400'
                        }`}
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Department</label>
                    <input
                      placeholder="e.g. Sales, Logistics"
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-white placeholder:text-slate-600"
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">Location</label>
                    <input
                      placeholder="e.g. East Wing, Floor 4"
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-white placeholder:text-slate-600"
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Description</label>
                  <textarea
                    placeholder="Describe the issue in detail..."
                    rows={6}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-white placeholder:text-slate-600"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl border border-white/5">
                  <input
                    type="checkbox"
                    id="anonymous"
                    className="h-5 w-5 bg-[#0a0a0a] border-white/10 rounded text-indigo-500 focus:ring-offset-0 focus:ring-indigo-500/20"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                  />
                  <label htmlFor="anonymous" className="text-sm text-slate-300 font-medium cursor-pointer">Submit anonymously</label>
                </div>

                <button
                  className={`w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-500/10 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={submitCase}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Case"
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-indigo-600 border border-indigo-500 shadow-2xl rounded-[40px] p-20 text-center text-white"
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-3xl font-bold mb-4">Case Submitted</h2>
              <p className="text-indigo-100 opacity-90 mb-8 max-w-sm mx-auto">Thank you for your feedback. We have received your case and will process it shortly.</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-700/50 rounded-full text-xs font-semibold uppercase tracking-widest">
                Redirecting to dashboard...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}