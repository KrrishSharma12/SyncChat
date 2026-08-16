import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

const uploadToCloudinary = async (
  fileBuffer: Buffer
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "syncchat_profiles",
      },
      (error: any, result: UploadApiResponse | PromiseLike<UploadApiResponse>) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default uploadToCloudinary;