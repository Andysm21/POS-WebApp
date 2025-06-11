import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export const protect = (roles = []) => (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.sendStatus(401)

  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    if (roles.length && !roles.includes(decoded.role)) return res.sendStatus(403)
    req.user = decoded
    next()
  } catch (err) {
    res.sendStatus(401)
  }
}
