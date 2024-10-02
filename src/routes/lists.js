import express from 'express'
import { readData, writeData } from '../utils/dataHandlers.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const data = await readData('lists')
        res.json(data)
    } catch (err) {
        res.status(400)
        res.json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const allLists = await readData('lists')

        const listExists = allLists.some((list) => {
            return list.id === req.body.id || list.title === req.body.id
        })
        if (listExists) {
            res.status(400)

            throw new Error('xd')
        } else {
            allLists.push(req.body)
            await writeData('lists', allLists)
            res.status(200)
            res.json(allLists)
        }
    } catch {
        res.json()
    }
})

router.delete('/:listId', async (req, res) => {
    let listId = req.params.listId
    try {
        let filteredLists = await readData('lists')
        filteredLists = filteredLists.filter((list) => {
            return list.id !== listId
        })

        await writeData('lists', filteredLists)
        res.json(filteredLists)
    } catch {
        res.status(400)
        res.json({ message: 'Something went wrong' })
    }
})

export default router
