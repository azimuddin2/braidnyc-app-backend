import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FreelancerServiceServices } from './freelancerService.service';

const createService = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result = await FreelancerServiceServices.createServiceIntoDB(
    userId,
    req.body,
    req.files as {
      studioFrontPhoto?: Express.Multer.File[];
      studioInsidePhoto?: Express.Multer.File[];
    },
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

const getAllService = catchAsync(async (req, res) => {
  const result = await FreelancerServiceServices.getAllServiceFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Services retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getServiceById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FreelancerServiceServices.getServiceByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service retrieved successfully',
    data: result,
  });
});

const updateService = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const { id } = req.params;
  const result = await FreelancerServiceServices.updateServiceIntoDB(
    userId,
    id,
    req.body,
    req.files as {
      studioFrontPhoto?: Express.Multer.File[];
      studioInsidePhoto?: Express.Multer.File[];
    },
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});

const deleteService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FreelancerServiceServices.deleteServiceFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});

// const getAvailability = catchAsync(async (req, res) => {
//     const result = await PackagesServices.getAvailabilityFromDB(req.query);

//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: 'Slots retrieved successfully',
//         data: result,
//     });
// });

export const FreelancerServiceControllers = {
  createService,
  getAllService,
  getServiceById,
  updateService,
  deleteService,
};
