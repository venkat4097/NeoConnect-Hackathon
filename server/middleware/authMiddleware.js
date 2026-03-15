const jwt = require("jsonwebtoken")

const verifyToken = (req,res,next)=>{

 const token = req.headers.authorization

 if(!token){
  return res.status(403).json("Token required")
 }

 try{

  const decoded = jwt.verify(token.split(" ")[1],process.env.JWT_SECRET)

  req.user = decoded

  next()

 }catch(err){
  res.status(401).json("Invalid Token")
 }

}

const checkRole = (...roles)=>{

 return (req,res,next)=>{

  if(!roles.includes(req.user.role)){
   return res.status(403).json("Access denied")
  }

  next()

 }

}

module.exports = {verifyToken,checkRole}