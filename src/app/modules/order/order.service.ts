import mongoose, { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { TProduct } from '../product/product.interface';
import { Product } from '../product/product.model';
import { TOrder, TOrderRequest } from './order.interface';
import { Order } from './order.model';
import { UploadedFiles } from '../../interface/common.interface';
import {
  deleteManyFromS3,
  uploadManyToS3,
} from '../../utils/awsS3FileUploader';
import QueryBuilder from '../../builder/QueryBuilder';
import { orderSearchableFields } from './order.constant';

const createOrderIntoDB = async (payload: TOrder) => {
  // 1️⃣ Validate ObjectIds
  if (!Types.ObjectId.isValid(payload?.vendor)) {
    throw new AppError(400, 'Invalid Vendor ID');
  }
  if (!Types.ObjectId.isValid(payload?.buyer)) {
    throw new AppError(400, 'Invalid Buyer ID');
  }

  // 2️⃣ Validate each product
  for (const item of payload.products) {
    if (!Types.ObjectId.isValid(item.product)) {
      throw new AppError(400, `Invalid Product ID: ${item.product}`);
    }

    const product: TProduct | null = await Product.findById(item.product);
    if (!product) {
      throw new AppError(404, `Product not found: ${item.product}`);
    }

    // 3️⃣ Check stock
    if (product.quantity < item.quantity) {
      throw new AppError(
        400,
        `Insufficient stock for ${product.name}. Only ${product.quantity} left`,
      );
    }
  }

  // 4️⃣ Create order
  const order = await Order.create(payload);
  if (!order) {
    throw new AppError(400, 'Failed to create order');
  }

  // 5️⃣ Deduct stock (after order created successfully)
  for (const item of payload.products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { quantity: -item.quantity },
    });
  }

  return order;
};

const getAllOrderByUserFromDB = async (query: Record<string, unknown>) => {
  const { vendor, ...filters } = query;

  if (!vendor || !mongoose.Types.ObjectId.isValid(vendor as string)) {
    throw new AppError(400, 'Invalid Vendor ID');
  }

  // Base query -> always exclude deleted products
  let orderQuery = Order.find({ vendor, isDeleted: false })
    .populate('vendor')
    .populate('buyer');

  const queryBuilder = new QueryBuilder(orderQuery, filters)
    .search(orderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await queryBuilder.countTotal();
  const result = await queryBuilder.modelQuery;

  return { meta, result };
};

const getOrdersByEmailFromDB = async (email: string) => {
  // ✅ Validate email
  if (!email) {
    throw new AppError(400, 'Email is required');
  }

  // ✅ Fetch bookings directly by email
  const bookings = await Order.find({ customerEmail: email, isDeleted: false })
    // .populate('products.product')
    .populate('vendor')
    .sort({ createdAt: -1 }) // latest first
    .select('-__v -isDeleted'); // exclude unwanted fields

  return bookings;
};

const getOrderByIdFromDB = async (id: string) => {
  const result = await Order.findById(id)
    .populate('product')
    .populate('vendor');

  if (!result) {
    throw new AppError(404, 'This Order not found');
  }

  if (result.isDeleted === true) {
    throw new AppError(400, 'This order has been deleted');
  }

  return result;
};

const requestOrderIntoDB = async (
  orderId: string,
  payload: Partial<TOrderRequest>,
  files?: any,
) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  const { deleteKey, ...requestData } = payload;

  // 🔼 Handle image upload
  if (files) {
    const { images } = files as UploadedFiles;

    if (images?.length) {
      const imgsArray = images.map((image) => ({
        file: image,
        path: `images/order`,
      }));

      console.log(imgsArray);

      try {
        payload.images = await uploadManyToS3(imgsArray); // Await all uploads before proceeding
      } catch (error) {
        throw new AppError(500, 'Image upload failed');
      }
    }
  }

  // 🔼 Handle image deletion
  if (deleteKey && deleteKey.length > 0) {
    const newKey = deleteKey?.map((key: any) => `images/order/${key}`);

    if (newKey.length > 0) {
      await deleteManyFromS3(newKey); // Delete images from S3
      // Remove deleted images from the product
      await Product.findByIdAndUpdate(
        orderId,
        {
          $pull: { images: { key: { $in: deleteKey } } },
        },
        { new: true },
      );
    }
  }

  // 🔼 Prepare update object
  const update: any = {
    $set: {
      'request.type': requestData.type ?? order.request?.type ?? 'none',
      'request.reason': requestData.reason ?? order.request?.reason,
      'request.vendorApproved':
        requestData.vendorApproved ?? order.request?.vendorApproved,
      'request.updatedAt': new Date(),
    },
  };

  if (requestData.images?.length) {
    update.$push = { 'request.images': { $each: requestData.images } };
  }

  // 🔼 Update DB
  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, update, {
      new: true,
    });

    if (!updatedOrder) {
      throw new AppError(400, 'Order request update failed');
    }

    return updatedOrder;
  } catch (error) {
    throw new AppError(500, 'Order request update failed');
  }
};

const updateOrderStatusIntoDB = async (
  id: string,
  payload: { status: string },
) => {
  const isOrderExists = await Order.findById(id);

  if (!isOrderExists) {
    throw new AppError(404, 'This order is not found');
  }

  const result = await Order.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const updateOrderRequestIntoDB = async (
  orderId: string,
  vendorApproved: boolean,
) => {
  // 1️⃣ Find the order
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(404, 'Order not found');
  }

  // 2️⃣ Check if request exists
  if (!order.request || order.request.type === 'none') {
    throw new AppError(400, 'No request submitted for this order');
  }

  // 3️⃣ Update vendorApproved and updatedAt
  order.request.vendorApproved = Boolean(vendorApproved);
  order.request.updatedAt = new Date();

  // 4️⃣ Save the updated order
  const updatedOrder = await order.save();

  return updatedOrder;
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrderByUserFromDB,
  getOrdersByEmailFromDB,
  getOrderByIdFromDB,
  requestOrderIntoDB,
  updateOrderStatusIntoDB,
  updateOrderRequestIntoDB,
};
