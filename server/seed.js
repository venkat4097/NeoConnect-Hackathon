// const mongoose = require("mongoose")
// const bcrypt = require("bcryptjs")
// const User = require("./models/User")
// const Case = require("./models/Case")
// const Poll = require("./models/Poll")
// require("dotenv").config()

// const seed = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI)
//     console.log("Connected to MongoDB for seeding...")

//     // Clear existing data
//     await User.deleteMany({})
//     await Case.deleteMany({})
//     await Poll.deleteMany({})

//     const salt = await bcrypt.genSalt(10)
//     const hashed = await bcrypt.hash("password123", salt)

//     // Seed Users
//     const users = await User.insertMany([
//       { name: "Admin User", email: "admin@neo.com", password: hashed, role: "admin", department: "HQ" },
//       { name: "Alice Secretariat", email: "alice@neo.com", password: hashed, role: "secretariat", department: "Admin" },
//       { name: "Bob Manager", email: "bob@neo.com", password: hashed, role: "case_manager", department: "HR" },
//       { name: "Charlie Manager", email: "charlie@neo.com", password: hashed, role: "case_manager", department: "Operations" },
//       { name: "David Staff", email: "david@neo.com", password: hashed, role: "staff", department: "Sales" },
//       { name: "Eve Staff", email: "eve@neo.com", password: hashed, role: "staff", department: "IT" }
//     ])

//     console.log("Users seeded.")

//     // Seed Cases
//     const demoCases = await Case.insertMany([
//       {
//         trackingId: "NEO-2026-001",
//         category: "Safety",
//         department: "Operations",
//         location: "Warehouse A",
//         severity: "High",
//         description: "Broken safety rail on the second floor walkway. Urgent repair needed.",
//         status: "In Progress",
//         assignedTo: users[3]._id, // Charlie
//         createdBy: users[4]._id, // David
//         lastResponseAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
//       },
//       {
//         trackingId: "NEO-2026-002",
//         category: "HR",
//         department: "Sales",
//         location: "Main Office",
//         severity: "Medium",
//         description: "Request for more ergonomic chairs in the sales hub.",
//         status: "Resolved",
//         assignedTo: users[2]._id, // Bob
//         createdBy: users[5]._id, // Eve
//         actionTaken: "Ordered 50 Herman Miller chairs.",
//         outcome: "Improved staff comfort and reduced back issues.",
//         isPublic: true
//       },
//       {
//         trackingId: "NEO-2026-003",
//         category: "Facilities",
//         department: "IT",
//         location: "Data Center",
//         severity: "Low",
//         description: "AC is making a loud humming noise.",
//         status: "New",
//         createdBy: users[5]._id // Eve
//       }
//     ])

//     console.log("Cases seeded.")

//     // Seed Polls
//     await Poll.insertMany([
//       {
//         question: "Should we implement a 4-day work week trial?",
//         options: ["Yes, immediately", "Maybe next quarter", "No, keep current schedule"],
//         createdBy: users[1]._id, // Alice
//         votes: [
//           { userId: users[4]._id, optionIndex: 0 },
//           { userId: users[5]._id, optionIndex: 0 }
//         ]
//       }
//     ])

//     console.log("Polls seeded.")
//     console.log("Seeding complete! Use 'password123' for all accounts.")
//     process.exit()

//   } catch (err) {
//     console.error(err)
//     process.exit(1)
//   }
// }

// seed()
