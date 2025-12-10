import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = async (fileBuffer, folder = "fixitflow") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array<Buffer>} fileBuffers - Array of file buffers
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Array>} Array of Cloudinary upload results
 */
export const uploadMultipleToCloudinary = async (fileBuffers, folder = "fixitflow") => {
  try {
    const uploadPromises = fileBuffers.map((buffer) => uploadToCloudinary(buffer, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary by public ID
 * @param {string} publicId - Public ID of the image in Cloudinary
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - Array of public IDs
 * @returns {Promise<Array>} Array of deletion results
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const deletePromises = publicIds.map((publicId) => deleteFromCloudinary(publicId));
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    throw new Error(`Failed to delete images: ${error.message}`);
  }
};

/**
 * Delete all images in a folder (useful for deleting complaint folder)
 * @param {string} folderPath - Folder path in Cloudinary (e.g., "fixitflow/complaints/123")
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFolder = async (folderPath) => {
  try {
    const result = await cloudinary.api.delete_resources_by_prefix(folderPath);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete folder: ${error.message}`);
  }
};

export default cloudinary;

