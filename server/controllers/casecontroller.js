const Case = require("../models/Case")
const generateTrackingId = require("../utils/trackingId")

exports.createCase = async(req,res)=>{

 try{

  const trackingId = await generateTrackingId()

  const newCase = new Case({
   ...req.body,
    trackingId,
    createdBy: req.user.id,
    attachment: req.file ? req.file.path : null,
    lastResponseAt: new Date()
  })

  await newCase.save()

  res.json(newCase)

 }catch(err){
  res.status(500).json(err)
 }

}

exports.getCases = async(req,res)=>{
  try {
    let query = {}
    if (req.user.role === "staff") {
      query = { createdBy: req.user.id }
    }
    
    const cases = await Case.find(query)
      .populate("assignedTo", "name department")
      .sort("-createdAt")
      
    res.json(cases)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

exports.assignCase = async(req,res)=>{

 const updated = await Case.findByIdAndUpdate(
   req.params.id,
    {
      assignedTo: req.body.managerId,
      status: "Assigned",
      lastResponseAt: new Date()
    },
    { new: true }
  )

 res.json(updated)

}

exports.updateStatus = async(req,res)=>{

  const updated = await Case.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      notes: req.body.notes,
      lastResponseAt: new Date()
    },
    { new: true }
  )

  res.json(updated)
}

exports.resolveCase = async (req, res) => {
  const updated = await Case.findByIdAndUpdate(
    req.params.id,
    {
      status: "Resolved",
      actionTaken: req.body.actionTaken,
      outcome: req.body.outcome,
      isPublic: req.body.isPublic,
      lastResponseAt: new Date()
    },
    { new: true }
  )

  res.json(updated)
}

exports.getPublicCases = async (req, res) => {
  const cases = await Case.find({ status: "Resolved", isPublic: true })
    .populate("department")
    .sort("-createdAt")
  res.json(cases)
}

exports.getMyCases = async(req,res)=>{
 
  const cases = await Case.find({
    assignedTo:req.user.id
  }).sort("-createdAt")
 
  res.json(cases)
 
}

exports.getHotspots = async (req, res) => {
  try {
    const hotspots = await Case.aggregate([
      { $match: { status: { $ne: "Resolved" } } },
      { $group: {
          _id: { department: "$department", category: "$category" },
          count: { $sum: 1 }
      }},
      { $match: { count: { $gte: 3 } } }, // Flag if 3+ recurring issues
      { $sort: { count: -1 } }
    ])
    res.json(hotspots)
  } catch (err) {
    res.status(500).json(err)
  }
}