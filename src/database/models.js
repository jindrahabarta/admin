import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
})
export const User = mongoose.model('user', userSchema, 'users')

const productSchema = new mongoose.Schema(
    {
        productName: String,
        desc: String,
        categoryId: String,
        count: Number,
        price: Number,
        imageUrl: String,
    },
    {
        versionKey: false,
    }
)
export const Product = mongoose.model('product', productSchema, 'products')

const categorySchema = new mongoose.Schema(
    {
        _id: String,
        name: String,
    },
    {
        versionKey: false,
    }
)
export const Category = mongoose.model('category', categorySchema, 'categories')
