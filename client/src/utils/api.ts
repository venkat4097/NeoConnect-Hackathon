import axios from "axios"

const API = axios.create({
 baseURL: "https://neoconnect-hackathon-backend.onrender.com"
})

API.interceptors.request.use((config)=>{
 const token = localStorage.getItem("token")

 if (token && config.headers) {
  config.headers.set("Authorization", `Bearer ${token}`);
 }

 return config
})

export default API
