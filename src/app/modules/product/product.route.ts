import express from 'express';
import multer, { memoryStorage } from 'multer';
import { uploadManyToS3 } from '../../utils/awsS3FileUploader';
import { ProductValidations } from './product.validation';
import { ProductControllers } from './product.controller';
import multyUploader from '../../middlewares/multyUploader';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  // upload.fields([{name:"files", maxCount:3}]),
  upload.array('files', 5),
  (req, res, next) => multyUploader(req, res, next),
  // handles up to 3 images
  ProductControllers.createProduct,
);

export const ProductRoutes = router;
