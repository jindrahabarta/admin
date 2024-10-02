import express from 'express'
import authRoute from './routes/auth.js'
import productsRoute from './routes/products.js'
import todosRoute from './routes/todos.js'
import listsRoute from './routes/lists.js'
import categoriesRoute from './routes/categories.js'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import connectDB from './database/db.js'
import { configDotenv } from 'dotenv'

const env = configDotenv()
const app = express()
const port = env.parsed.PORT

app.use(helmet())
app.use(bodyParser.json())
app.use(
    cors({
        origin: ['http://localhost:5173', 'https://jh-todoapp.netlify.app'],
        credentials: true,
    })
)
app.use(morgan('dev'))
app.use(cookieParser())

app.use('/auth', authRoute)
app.use('/products', productsRoute)
app.use('/categories', categoriesRoute)
app.use('/todos', todosRoute)
app.use('/lists', listsRoute)

const startServer = async () => {
    app.listen(port, () => {
        console.log('App is connected to db and live on port ' + port)
    })
    await connectDB()
}

startServer()
