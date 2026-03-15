const Minute = require("../models/Minute")

exports.uploadMinute = async (req, res) => {
  try {
    const newMinute = new Minute({
      title: req.body.title,
      fileUrl: req.file ? req.file.path : null,
      uploadedBy: req.user.id,
      date: req.body.date || new Date()
    })
    await newMinute.save()
    res.json(newMinute)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.getMinutes = async (req, res) => {
  try {
    const minutes = await Minute.find().sort("-date")
    res.json(minutes)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.searchMinutes = async (req, res) => {
  try {
    const minutes = await Minute.find({
      title: { $regex: req.query.q, $options: "i" }
    }).sort("-date")
    res.json(minutes)
  } catch (err) {
    res.status(500).json(err)
  }
}
