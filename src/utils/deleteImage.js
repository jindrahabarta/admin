import { Product } from '../database/models.js'
import { v2 as cloudinary } from 'cloudinary'

export const deleteImage = async (id) => {
    const product = await Product.findById(id)
    console.log(product)

    const imageId = product.imageUrl.split('productsImages/')[1].split('.')[0]

    console.log(imageId)

    const deletePromise = await cloudinary.uploader.destroy(
        `productsImages/${imageId}`
    )

    console.log(deletePromise)

    if (!deletePromise.result || deletePromise.result !== 'ok') {
        throw new Error('Something went wrong')
    }
}

export default deleteImage
