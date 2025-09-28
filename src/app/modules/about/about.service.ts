import AppError from '../../errors/AppError';
import { TAbout } from './about.interface';
import { About } from './about.model';

const createAboutIntoDB = async (payload: TAbout) => {
  const result = await About.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create about');
  }
  return result;
};

const getAboutByIdFromDB = async (id: string) => {
  const result = await About.findById(id);

  if (!result) {
    throw new AppError(404, 'This about not found');
  }

  if (result.isDeleted === true) {
    throw new AppError(400, 'This about has been deleted');
  }

  return result;
};

const updateAboutIntoDB = async (id: string, payload: Partial<TAbout>) => {
  const isAboutExists = await About.findById(id);

  if (!isAboutExists) {
    throw new AppError(404, 'This about not exists');
  }

  if (isAboutExists.isDeleted === true) {
    throw new AppError(400, 'This about has been deleted');
  }

  const updatedAbout = await About.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedAbout) {
    throw new AppError(400, 'About update failed');
  }

  return updatedAbout;
};

const deleteAboutFromDB = async (id: string) => {
  const isAboutExists = await About.findById(id);

  if (!isAboutExists) {
    throw new AppError(404, 'About not found');
  }

  const result = await About.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete about');
  }

  return result;
};

export const AboutService = {
  createAboutIntoDB,
  getAboutByIdFromDB,
  updateAboutIntoDB,
  deleteAboutFromDB,
};
