import mongoose from 'mongoose'
import { configDotenv } from 'dotenv'

const env = configDotenv()

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        const db = await mongoose.connect(env.parsed.MONGO_URI, {
            dbName: 'adminPage',
        })
        console.log('Database connected' + db.connection.host)
    } catch (err) {
        console.log(err)
    }
}

export default connectDB
