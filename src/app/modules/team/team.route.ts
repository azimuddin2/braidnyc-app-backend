import express from 'express';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middlewares/parseData';
import validateRequest from '../../middlewares/validateRequest';
import { TeamValidations } from './team.validation';
import { TeamControllers } from './team.controller';
import auth from '../../middlewares/auth';

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth('vendor'),
  upload.single('image'),
  parseData(),
  validateRequest(TeamValidations.createTeamMemberValidationSchema),
  TeamControllers.createTeamMember,
);

router.get('/', auth('vendor', 'admin'), TeamControllers.getAllTeamMember);

router.get('/:id', auth('vendor', 'admin'), TeamControllers.getTeamMemberById);

router.patch(
  '/:id',
  auth('vendor'),
  upload.single('image'),
  parseData(),
  validateRequest(TeamValidations.updateTeamMemberValidationSchema),
  TeamControllers.updateTeamMember,
);

router.delete(
  '/:id',
  auth('vendor', 'admin'),
  TeamControllers.deleteTeamMember,
);

export const TeamRoutes = router;
