const Poll = require("../models/Poll")

exports.createPoll = async (req, res) => {
  try {
    const poll = new Poll({
      question: req.body.question,
      options: req.body.options,
      createdBy: req.user.id
    })
    await poll.save()
    res.json(poll)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find()
    res.json(polls)
  } catch (err) {
    res.status(500).json(err)
  }
}

exports.vote = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
    if (!poll) return res.status(404).json("Poll not found")

    const alreadyVoted = poll.votes.find(v => v.userId.toString() === req.user.id)
    if (alreadyVoted) return res.status(400).json("Already voted")

    poll.votes.push({ userId: req.user.id, optionIndex: req.body.optionIndex })
    await poll.save()
    res.json(poll)
  } catch (err) {
    res.status(500).json(err)
  }
}