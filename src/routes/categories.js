import express from 'express'
import { Category } from '../database/models.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const categories = await Category.find()
    res.json(categories)
})

router.post('/', async (req, res) => {
    const categoryId = crypto.randomUUID()

    const categoryExists = await Category.findOne({ name: req.body.category })

    if (categoryExists) {
        return res.sendStatus(401)
    }

    const newCategory = new Category({
        _id: categoryId,
        name: req.body.category,
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

router.put('/:id', async (req, res) => {
    const updatedCategory = {
        _id: req.params.id,
        name: req.body.category,
    }

    const categoryExists = await Category.findOne({ name: req.body.category })

    if (categoryExists) {
        return res.sendStatus(401)
    }

    await Category.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        updatedCategory
    ).then(() => {
        res.send(updatedCategory)
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
