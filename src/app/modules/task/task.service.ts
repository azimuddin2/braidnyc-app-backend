import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { taskSearchableFields } from './task.constant';
import { TTask } from './task.interface';
import { Task } from './task.model';

const createTaskIntoDB = async (payload: TTask) => {
  const result = await Task.create(payload);
  if (!result) {
    throw new AppError(400, 'Failed to create task');
  }
  return result;
};

const getAllTasksFromDB = async (query: Record<string, unknown>) => {
  const baseQuery = { ...query, isDeleted: false };

  const queryBuilder = new QueryBuilder(Task.find(), baseQuery)
    .search(taskSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  // Apply merged filters to the query only once
  queryBuilder.modelQuery = queryBuilder.modelQuery.find(
    queryBuilder.finalFilter,
  );

  const meta = await queryBuilder.countTotal();
  const result = await queryBuilder.modelQuery;

  return { meta, result };
};

const getTaskByIdFromDB = async (id: string) => {
  const result = await Task.findById(id);

  if (!result) {
    throw new AppError(404, 'This Task not found');
  }

  if (result.isDeleted === true) {
    throw new AppError(400, 'This task has been deleted');
  }

  return result;
};

const updateTaskIntoDB = async (id: string, payload: Partial<TTask>) => {
  const isTaskExists = await Task.findById(id);

  if (!isTaskExists) {
    throw new AppError(404, 'This task not exists');
  }

  if (isTaskExists.isDeleted === true) {
    throw new AppError(400, 'This task has been deleted');
  }

  const updatedTask = await Task.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedTask) {
    throw new AppError(400, 'Task update failed');
  }

  return updatedTask;
};

const deleteTaskFromDB = async (id: string) => {
  const isTaskExists = await Task.findById(id);

  if (!isTaskExists) {
    throw new AppError(404, 'Task not found');
  }

  const result = await Task.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(400, 'Failed to delete task');
  }

  return result;
};

export const TaskServices = {
  createTaskIntoDB,
  getAllTasksFromDB,
  getTaskByIdFromDB,
  updateTaskIntoDB,
  deleteTaskFromDB,
};
