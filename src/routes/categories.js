import express from 'express'
import { Category } from '../database/models.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const categories = await Category.find()
    res.json(categories)
})

router.post('/', async (req, res) => {
    const categoryId = req.body.category
        .normalize('NFD')
        .replaceAll(/\p{Diacritic}/gu, '')
        .replaceAll(/ /g, '_')
        .toLowerCase()

    const newCategory = new Category({
        _id: categoryId,
        name: req.body.category,
        products: [],
    })
    await newCategory
        .save()
        .then((data) => {
            res.send(data)
        })
        .catch(() => {
            res.sendStatus(400)
        })
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    Category.findOneAndDelete({ _id: id })
        .then((data) => {
            res.send(data)
        })
        .catch(() => {
            res.sendStatus(400)
        })
})

export default router
