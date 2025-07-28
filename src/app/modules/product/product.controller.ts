import catchAsync from '../../utils/catchAsync';

const createProduct = catchAsync(async (req, res) => {
  console.log(req);
});

export const ProductControllers = {
  createProduct,
};
