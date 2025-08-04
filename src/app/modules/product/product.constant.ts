import { THighlightStatus, TProductStatus } from './product.interface';

export const ProductStatus: TProductStatus[] = [
  'Available',
  'Out of Stock',
  'TBC',
  'Discontinued',
];

export const HighlightStatus: THighlightStatus[] = ['Highlight', 'Highlighted'];

export const productSearchableFields = ['name'];
