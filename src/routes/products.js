import express from 'express'
import { Product } from '../database/models.js'
import { upload } from '../utils/cloudinary.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const products = await Product.find()
    res.json(products)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const product = await Product.find({ _id: id })

    res.json(product)
})

router.post('/', upload.single('mainImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400)
    }

    const newProduct = new Product({
        _id: crypto.randomUUID(),
        productName: req.body.productName,
        desc: req.body.desc,
        count: Number(req.body.count),
        price: Number(req.body.price),
        imageUrl: req.file.path,
    })
    await newProduct.save()

    res.sendStatus(200)
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id

    const product = await Product.findOneAndDelete({ _id: id })

    //TODO:Mazani obrazku tady a potom u PUT
    // console.log(product.imageUrl)

    // const testUrl = 's-l400.jpg-Novej%20prod'

    // cloudinary.uploader.destroy(testUrl, function (error, result) {
    //     if (error) {
    //         return res.status(500).json({ message: 'Failed to delete image' })
    //     }
    //     console.log('Image deletion result:', result)
    // })

    res.sendStatus(200)
})

router.put('/', upload.single('mainImage'), async (req, res) => {
    let updatedProduct = {}

    if (req.file) {
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
})

export default router
