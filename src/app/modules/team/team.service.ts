import AppError from '../../errors/AppError';
import { uploadToS3 } from '../../utils/awsS3FileUploader';
import { TTeam } from './team.interface';
import { Team } from './team.model';

export const createTeamMemberIntoDB = async (payload: TTeam, file: any) => {
  // 📸 Handle single image upload to S3
  if (file) {
    const uploadResult = await uploadToS3({
      file,
      fileName: `images/team/${Math.floor(100000 + Math.random() * 900000)}`,
    });

    payload.image = uploadResult; // Assign only the to payload.image
  }

  // 🧑‍💼 Create the team member
  const result = await Team.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create team member');
  }
  return result;
};

export const TeamServices = {
  createTeamMemberIntoDB,
};
