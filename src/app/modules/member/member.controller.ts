import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MemberServices } from './member.service';

const createMember = catchAsync(async (req, res) => {
  const result = await MemberServices.createMemberIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Member add successfully',
    data: result,
  });
});

const getAllMembers = catchAsync(async (req, res) => {
  const result = await MemberServices.getAllMembersFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Member retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getMemberById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MemberServices.getMemberByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Member retrieved successfully',
    data: result,
  });
});

const updateMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MemberServices.updateMemberIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Member has been updated successfully.',
    data: result,
  });
});

const deleteMember = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MemberServices.deleteMemberFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Member deleted successfully',
    data: result,
  });
});

export const MemberControllers = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
