import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TeamServices } from './team.service';

const createTeamMember = catchAsync(async (req, res) => {
  const result = await TeamServices.createTeamMemberIntoDB(req.body, req.file);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Team member add successfully',
    data: result,
  });
});

const getAllTeamMember = catchAsync(async (req, res) => {
  const result = await TeamServices.getAllTeamMemberFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team member retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getTeamMemberById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TeamServices.getTeamMemberByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team member retrieved successfully',
    data: result,
  });
});

const updateTeamMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TeamServices.updateTeamMemberIntoDB(
    id,
    req.body,
    req.file,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team member has been updated successfully.',
    data: result,
  });
});

const deleteTeamMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TeamServices.deleteTeamMemberFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Team member deleted successfully',
    data: result,
  });
});

export const TeamControllers = {
  createTeamMember,
  getAllTeamMember,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
};
