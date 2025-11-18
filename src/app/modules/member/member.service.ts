import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TMember } from './member.interface';
import { Member } from './member.model';
import { memberSearchableFields } from './member.constant';

const createMemberIntoDB = async (payload: TMember) => {
  const isMemberExists = await Member.findOne({
    email: payload.email,
    isDeleted: false,
  });

  if (isMemberExists) {
    throw new AppError(400, 'This member already exists');
  }

  const result = await Member.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create member');
  }
  return result;
};

const getAllMembersFromDB = async (query: Record<string, unknown>) => {
  const memberQuery = new QueryBuilder(Member.find({ isDeleted: false }), query)
    .search(memberSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await memberQuery.countTotal();
  const result = await memberQuery.modelQuery;

  return { meta, result };
};

const getMemberByIdFromDB = async (id: string) => {
  const result = await Member.findById(id);

  if (!result) {
    throw new AppError(404, 'This member not found');
  }

  if (result.isDeleted === true) {
    throw new AppError(400, 'This member has been deleted');
  }

  return result;
};

const updateMemberIntoDB = async (id: string, payload: Partial<TMember>) => {
  const isMemberExists = await Member.findById(id);

  if (!isMemberExists) {
    throw new AppError(404, 'This member not exists');
  }

  if (isMemberExists.isDeleted === true) {
    throw new AppError(400, 'This member has been deleted');
  }

  const updatedMember = await Member.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedMember) {
    throw new AppError(400, 'Member update failed');
  }

  return updatedMember;
};

const deleteMemberFromDB = async (id: string) => {
  const isMemberExists = await Member.findById(id);

  if (!isMemberExists) {
    throw new AppError(404, 'Member not found');
  }

  const result = await Member.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete member');
  }

  return result;
};

export const MemberServices = {
  createMemberIntoDB,
  getAllMembersFromDB,
  getMemberByIdFromDB,
  updateMemberIntoDB,
  deleteMemberFromDB,
};
