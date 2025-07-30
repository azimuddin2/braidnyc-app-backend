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

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Product name is required',
      })
      .optional(),

    productType: z
      .string({
        required_error: 'Product type is required',
      })
      .optional(),

    quantity: z
      .number({
        required_error: 'Quantity is required',
      })
      .optional(),

    price: z
      .number({
        required_error: 'Price is required',
      })
      .optional(),

    discountPrice: z
      .number()
      .min(0, 'Discount must be at least 0')
      .max(100, "Discount can't exceed 100")
      .nullable()
      .optional(),

    colors: z
      .array(z.string(), {
        required_error: 'At least one color is required',
      })
      .optional(),

    size: z
      .string({
        required_error: 'Size is required',
      })
      .optional(),

    status: z
      .enum([...ProductStatus] as [string, ...string[]], {
        required_error: 'Product status is required',
      })
      .optional(),

    description: z
      .string({
        required_error: 'Product description is required',
      })
      .optional(),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
