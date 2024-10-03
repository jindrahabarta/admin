import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import { configDotenv } from 'dotenv'

const env = configDotenv()

cloudinary.config({
    cloud_name: env.parsed.CLOUDINARY_CLOUD_NAME,
    api_key: env.parsed.CLOUDINARY_API_KEY,
    api_secret: env.parsed.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'productsImages',
        format: async () => 'png',
        public_id: (req, file) => {
            const originalName = file.originalname
                .replaceAll(' ', '_')
                .replace('.jpeg', '')
                .replace('.png', '')
                .replace('.jpg', '')
                .replaceAll('.', '')
                .toLowerCase()

            const productName = req.body.productName
                .replaceAll(' ', '_')
                .replaceAll('.', '')

            return `${originalName}-${productName}`
        },
    },
})

const upload = multer({ storage: storage })

export { upload }
