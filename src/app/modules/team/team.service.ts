import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { deleteFromS3, uploadToS3 } from '../../utils/awsS3FileUploader';
import { teamMemberSearchableFields } from './team.constant';
import { TTeam } from './team.interface';
import { Team } from './team.model';

const createTeamMemberIntoDB = async (payload: TTeam, file: any) => {
  // 📸 Handle single image upload to S3
  if (file) {
    const uploadedUrl = await uploadToS3({
      file,
      fileName: `images/team/${Math.floor(100000 + Math.random() * 900000)}`,
    });

    payload.image = uploadedUrl; // Assign only the to payload.image
  }

  // 🧑‍💼 Create the team member
  const result = await Team.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create team member');
  }
  return result;
};

const getAllTeamMemberFromDB = async (query: Record<string, unknown>) => {
  const { user, ...filters } = query;

  if (!user || !mongoose.Types.ObjectId.isValid(user as string)) {
    throw new AppError(400, 'Invalid user ID');
  }

  // Base query -> always exclude deleted teams
  let teamQuery = Team.find({ user, isDeleted: false });

  const queryBuilder = new QueryBuilder(teamQuery, filters)
    .search(teamMemberSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  // Ensure final filter includes isDeleted = false
  queryBuilder.modelQuery = queryBuilder.modelQuery.find({
    ...queryBuilder.finalFilter,
    isDeleted: false,
  });

  const meta = await queryBuilder.countTotal();
  const result = await queryBuilder.modelQuery;

  return { meta, result };
};

const getTeamMemberByIdFromDB = async (id: string) => {
  const result = await Team.findById(id).populate('user');

  if (!result) {
    throw new AppError(404, 'This team member not found');
  }

  return result;
};

const updateTeamMemberIntoDB = async (
  id: string,
  payload: Partial<TTeam>,
  file?: Express.Multer.File,
) => {
  // 🔍 Step 1: Check if the team member exists
  const existingTeamMember = await Team.findById(id);
  if (!existingTeamMember) {
    throw new AppError(404, 'Team member not found');
  }

  try {
    // 📸 Step 2: Handle new image upload
    if (file) {
      const uploadedUrl = await uploadToS3({
        file,
        fileName: `images/team/${Math.floor(100000 + Math.random() * 900000)}`,
      });

      // 🧹 Step 3: Delete the previous image from S3 (if exists)
      if (existingTeamMember.image) {
        await deleteFromS3(existingTeamMember.image);
      }

      // 📝 Step 4: Set the new image URL to payload
      payload.image = uploadedUrl;
    }

    // 🔄 Step 5: Update the team member in the database
    const updatedTeamMember = await Team.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedTeamMember) {
      throw new AppError(400, 'Team member update failed');
    }

    return updatedTeamMember;
  } catch (error: any) {
    console.error('updateTeamMemberIntoDB Error:', error);
    throw new AppError(500, 'Failed to update team member');
  }
};

const deleteTeamMemberFromDB = async (id: string) => {
  const isTeamMemberExists = await Team.findById(id);

  if (!isTeamMemberExists) {
    throw new AppError(404, 'Team member not found');
  }

  const result = await Team.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete team member');
  }

  return result;
};

export const TeamServices = {
  createTeamMemberIntoDB,
  getAllTeamMemberFromDB,
  getTeamMemberByIdFromDB,
  updateTeamMemberIntoDB,
  deleteTeamMemberFromDB,
};
