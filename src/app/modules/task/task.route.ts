import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { TaskValidations } from './task.validation';
import { TaskControllers } from './task.controller';

const router = express.Router();

router.post(
  '/',
  auth('vendor'),
  validateRequest(TaskValidations.createTaskValidationSchema),
  TaskControllers.createTask,
);

router.get('/', auth('vendor', 'admin'), TaskControllers.getAllTasks);

router.get('/:id', auth('vendor', 'admin'), TaskControllers.getTaskById);

router.patch(
  '/:id',
  auth('vendor'),
  validateRequest(TaskValidations.updateTaskValidationSchema),
  TaskControllers.updateTask,
);

router.delete('/:id', auth('vendor'), TaskControllers.deleteTask);

export const TaskRoutes = router;
