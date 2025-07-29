import { z } from 'zod';
import { ProductStatus } from './product.constant';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Product name is required',
    }),

    productType: z.string({
      required_error: 'Product type is required',
    }),

    quantity: z.number({
      required_error: 'Quantity is required',
    }),

    price: z.number({
      required_error: 'Price is required',
    }),

    discountPrice: z
      .number()
      .min(0, 'Discount must be at least 0')
      .max(100, "Discount can't exceed 100")
      .nullable()
      .optional(),

    colors: z.array(z.string(), {
      required_error: 'At least one color is required',
    }),

    size: z.string({
      required_error: 'Size is required',
    }),

    status: z.enum([...ProductStatus] as [string, ...string[]], {
      required_error: 'Product status is required',
    }),

    description: z.string({
      required_error: 'Product description is required',
    }),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
};
