import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { Utils } from '../util';
const { API } = Utils;

cloudinary.config({
    cloud_name: 'deprv8mzu',
    api_key: API.CloudinaryApiKey,
    api_secret: API.CloudinaryApiSecret
});

export async function uploadImageToCloudinary(imagePath: string): Promise<string> {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'folder_name', 
        });

        fs.unlinkSync(imagePath);

        return result.secure_url;
    } catch (error) {
        console.error('Error al cargar la imagen en Cloudinary:', error);
        throw error;
    }
}