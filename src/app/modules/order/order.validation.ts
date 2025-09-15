import { z } from 'zod';

// Define billing details schema
const billingDetailsSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip Code is required'),
  address: z.string().min(1, 'Address is required'),
});

// Define product schema
const orderProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  image: z.string().min(1, 'Product Image is required'),
  product: z.string().min(1, 'Product Id is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be >= 0'),
  discount: z.number().min(0).optional().default(0),
  // 👉 if you allow multi-vendor orders, include vendor here:
  // vendor: z.string().min(1, "Vendor Id is required"),
});

// Main order schema
const createOrderValidationSchema = z.object({
  body: z.object({
    products: z
      .array(orderProductSchema)
      .min(1, 'At least one product is required'),

    // If single-vendor order:
    vendor: z.string().min(1, 'Vendor Id is required'),

    customerName: z.string().min(1, 'Customer name is required'),
    customerEmail: z.string().email('Invalid email'),
    customerPhone: z.string().min(6, 'Phone number is required'),

    totalPrice: z.number().min(0, 'Total price must be >= 0'),

    isPaid: z.boolean().optional().default(false),

    billingDetails: billingDetailsSchema,

    isDeleted: z.boolean().optional().default(false),
  }),
});

export const OrderValidation = {
  createOrderValidationSchema,
};
