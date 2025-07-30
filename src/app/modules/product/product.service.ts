import AppError from '../../errors/AppError';
import { UploadedFiles } from '../../interface/common.interface';
import { uploadManyToS3 } from '../../utils/awsS3FileUploader';
import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (payload: TProduct, files: any) => {
  if (files) {
    const { images } = files as UploadedFiles;

    if (images) {
      const imgsArray = images.map((image) => ({
        file: image,
        path: `images/product`,
      }));

      const uploaded = await uploadManyToS3(imgsArray);

      // ✅ Assign url and key
      payload.images = uploaded.map((item) => ({
        url: item.url,
        key: item.key,
      }));
    }
  }

  const result = await Product.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create products');
  }
  return result;
};

export const ProductServices = {
  createProductIntoDB,
};
