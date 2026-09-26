import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role || "user" },
    process.env.JWT_SECRET || "secret123",
    { expiresIn: "30d" }
  )

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role || "user",
})

//  REGISTER
export const register = async (req, res) => {
  const { name, email, password, phone } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" })
  }

  try {
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: "User already exists ❌" })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hash, phone: phone || "", role: "user" })
    await user.save()

    const token = signToken(user)

    res.json({ message: "User Registered ✅", token, user: publicUser(user) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

//  LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found ❌" })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ message: "Invalid password ❌" })
    }

    const token = signToken(user)

    res.json({ message: "Login success ✅", token, user: publicUser(user) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(publicUser(user))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}