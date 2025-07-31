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

export const TeamControllers = {
  createTeamMember,
};
