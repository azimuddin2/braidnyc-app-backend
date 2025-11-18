import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { MemberValidations } from './member.validation';
import { MemberControllers } from './member.controller';

const router = express.Router();

router.post(
  '/',
  auth('admin'),
  validateRequest(MemberValidations.createMemberValidationSchema),
  MemberControllers.createMember,
);

router.get('/', auth('admin'), MemberControllers.getAllMembers);

router.get('/:id', auth('admin'), MemberControllers.getMemberById);

router.patch(
  '/:id',
  auth('admin'),
  validateRequest(MemberValidations.updateMemberValidationSchema),
  MemberControllers.updateMember,
);

router.delete('/:id', auth('admin'), MemberControllers.deleteMember);

export const MemberRoutes = router;
