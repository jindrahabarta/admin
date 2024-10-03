import express from 'express'
import { Product } from '../database/models.js'
import { upload } from '../utils/cloudinary.js'
import deleteImage from '../utils/deleteImage.js'
import { isValidObjectId } from 'mongoose'

const router = express.Router()

router.get('/', async (req, res) => {
    const products = await Product.find()
    res.send(products)
})

router.get('/search', async (req, res) => {
    const { phrase, category } = req.query

    let productsByCategory
    if (category) {
        productsByCategory = await Product.find({ categoryId: category })
    } else {
        productsByCategory = await Product.find()
    }

    const products = productsByCategory.filter((product) => {
        if (product.productName.includes(phrase)) return product
    })

    if (products.length === 0) return res.sendStatus(204)

    res.json(products)
})

router.get('/:id', async (req, res) => {
    const { id } = req.params

    if (!isValidObjectId(id)) {
        return res.send(400).send('Invalid id parameter')
    }

    const product = await Product.findById(id)

    res.json(product)
})

router.post('/', upload.single('mainImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400)
    }

    await Product.create({
        productName: req.body.productName,
        desc: req.body.desc,
        categoryId: req.body.category,
        count: Number(req.body.count),
        price: Number(req.body.price),
        imageUrl: req.file.path,
    })

    res.sendStatus(200)
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id

        deleteImage(id)
        await Product.findOneAndDelete({ _id: id })
        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.put('/', upload.single('mainImage'), async (req, res) => {
    try {
        let updatedProduct = {}

        if (req.file) {
            deleteImage(req.body.id)

            updatedProduct = {
                imageUrl: req.file.path,
                ...req.body,
            }
        } else {
            updatedProduct = req.body
        }

        const product = await Product.findOneAndReplace(
            { _id: req.body.id },
            updatedProduct
        )

        res.send(product)
    } catch (err) {
        res.sendStatus(500)
    }
})

export default router
