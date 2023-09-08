
import { CloudinaryImage } from '@cloudinary/url-gen/assets/CloudinaryImage'

const OPTIONS = {
  cloudName: process.env.CLOUDINARY_ID,
  apiSecret: process.env.CLOUDINARY_SECRET,
  apiKey: process.env.CLOUDINARY_KEY
}

// function getThumbnailUrl(publicId: string) {
//   const cloudName = process.env.CLOUDINARY_ID
//   const width = 150
//   const height = 200
//   // Construye la URL de la miniatura
//   const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_thumb/${publicId}`
//   return thumbnailUrl
// }

const useCloudinaryImage = (name: string, folder: string) => {
    const publicId = `/${folder}/${name}`
      return  new CloudinaryImage(publicId, OPTIONS)
}

export default useCloudinaryImage
