import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AnnouncementServices } from './announcement.service';

const createAnnouncement = catchAsync(async (req, res) => {
  const result = await AnnouncementServices.createAnnouncementIntoDB(req.files);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Announcement created successfully',
    data: result,
  });
});

const getAllAnnouncement = catchAsync(async (req, res) => {
  const result = await AnnouncementServices.getAllAnnouncementFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Announcement retrieved successfully',
    data: result,
  });
});

const deleteAnnouncement = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AnnouncementServices.deleteAnnouncementFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Announcement deleted successfully',
    data: result,
  });
});

export const AnnouncementControllers = {
  createAnnouncement,
  getAllAnnouncement,
  deleteAnnouncement,
};
