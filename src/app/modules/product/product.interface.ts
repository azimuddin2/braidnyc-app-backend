export type TProductStatus =
  | 'Available'
  | 'Out of Stock'
  | 'TBC'
  | 'Discontinued';

export type TProduct = {
  name: string;
  imageUrls: string[];
  productType: string;
  quantity: number;
  price: number;
  discount?: number | null;
  colors: string[]; // e.g., ["Crimson Red", "Soft Nude"]
  size: string; // e.g., "5 ml"
  status: TProductStatus;
  description: string;
};
