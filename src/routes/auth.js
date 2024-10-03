import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { configDotenv } from 'dotenv'
import { User } from '../database/models.js'
const env = configDotenv()
const router = express.Router()

router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.sendStatus(401)

    bcrypt.compare(req.body.password, user.password).then(function (result) {
        if (result) {
            const userData = {
                username: user.username,
            }

            const jwtToken = jwt.sign(userData, env.parsed.PRIVATE_KEY, {
                expiresIn: 60,
            })

            const refreshToken = jwt.sign(
                userData,
                env.parsed.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '1d',
                }
            )

            res.json({
                jwt: jwtToken,
                refreshToken,
                user: { id: user.id, username: user.username, role: user.role },
            })
        } else {
            res.sendStatus(401)
        }
    })
})

router.post('/authorize', (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '')

    jwt.verify(token, env.parsed.PRIVATE_KEY, async function (err, verified) {
        if (verified) {
            const user = await User.findOne({ username: verified.username })

            res.json({ username: verified.username, role: user.role })
        } else {
            res.sendStatus(401)
        }
    })
})

router.post('/refresh', (req, res) => {
    jwt.verify(
        req.body.refreshToken,
        env.parsed.REFRESH_TOKEN_SECRET,
        async function (err, verified) {
            if (verified) {
                const userData = {
                    username: verified.username,
                }
                const jwtToken = jwt.sign(userData, env.parsed.PRIVATE_KEY, {
                    expiresIn: 60,
                })
                const user = await User.findOne({ username: verified.username })

                res.json({
                    newToken: jwtToken,
                    username: user.username,
                    role: user.role,
                })
            } else {
                res.sendStatus(401)
            }
        }
    )
})

export default router
