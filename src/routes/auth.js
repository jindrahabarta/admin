import express from 'express'
import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'
import bcrypt from 'bcrypt'
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
                user: { id: user.id, username: user.username },
            })
        } else {
            res.sendStatus(401)
        }
    })
})

router.post('/authorize', (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '')

    jwt.verify(token, env.parsed.PRIVATE_KEY, function (err, verified) {
        if (verified) {
            res.status(200).json({ username: verified.username })
        } else {
            res.sendStatus(401)
        }
    })
})

router.post('/refresh', (req, res) => {
    jwt.verify(
        req.body.refreshToken,
        env.parsed.REFRESH_TOKEN_SECRET,
        function (err, verified) {
            if (verified) {
                const userData = {
                    username: verified.username,
                }

                const jwtToken = jwt.sign(userData, env.parsed.PRIVATE_KEY, {
                    expiresIn: 60,
                })

                res.status(200).json({
                    newToken: jwtToken,
                    username: userData.username,
                })
            } else {
                res.sendStatus(401)
            }
        }
    )
})

export default router
