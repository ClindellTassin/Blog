import cloudinary from "cloudinary"

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryImageUpload = async (file) => {
    try {
        const data = await cloudinary.v2.uploader.upload(file, {
            resource_type: 'auto',
        });
        return { url: data?.secure_url };
    } catch (error) {
        return error;
    }
};

export default cloudinaryImageUpload;