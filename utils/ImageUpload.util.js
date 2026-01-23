// SDK initialization
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export const uploadImage = async (file, fileName, folder = '/') => {
    try {
        const uploadResponse = await imagekit.upload({
            file: file, // required - buffer, base64, or file path
            fileName: fileName, // required
            folder: folder, // optional
            useUniqueFileName: true, // optional - generates unique name
            tags: ['blog-image'] // optional
        });

        return {
            success: true,
            url: uploadResponse.url,
            fileId: uploadResponse.fileId,
            thumbnailUrl: uploadResponse.thumbnailUrl,
            name: uploadResponse.name
        };
    } catch (error) {
        console.error('ImageKit upload error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
    }
};


export const deleteImage = async (fileId) => {
    try {
        await imagekit.deleteFile(fileId);
        return { success: true, message: 'Image deleted successfully' };
    } catch (error) {
        console.error('ImageKit delete error:', error);
        throw new Error(`Failed to delete image: ${error.message}`);
    }
};

export default imagekit;