import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { TProduct } from '../product/product.interface';
import { Product } from '../product/product.model';
import { TOrder } from './order.interface';
import { Order } from './order.model';

export const createOrderIntoDB = async (payload: TOrder) => {
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

const getOrdersByEmailFromDB = async (email: string) => {
  // ✅ Validate email
  if (!email) {
    throw new AppError(400, 'Email is required');
  }

  // ✅ Fetch bookings directly by email
  const bookings = await Order.find({ customerEmail: email, isDeleted: false })
    .populate('product')
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

export const OrderServices = {
  createOrderIntoDB,
  getOrdersByEmailFromDB,
  getOrderByIdFromDB,
};
