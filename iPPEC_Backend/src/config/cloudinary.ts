// src/config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { env } from './environment.js';

// Configure the Cloudinary SDK
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configure the Multer storage engine to upload to Cloudinary
export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'health-app-articles', // A folder in Cloudinary to keep things organized
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    // You can add transformations here, e.g., to resize images on upload
    // transformation: [{ width: 800, height: 600, crop: 'limit' }],
  } as any, // 'any' is used here due to a known type issue in the library
});

export default cloudinary;
