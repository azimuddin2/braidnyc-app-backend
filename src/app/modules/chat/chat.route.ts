import { Router } from 'express';
import { chatController } from './chat.controller';
import { chatValidation } from './chat.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.owner, USER_ROLE.freelancer, USER_ROLE.customer),
  validateRequest(chatValidation.createChatValidation),
  chatController.createChat,
);

router.patch(
  '/:id',
  auth(USER_ROLE.owner, USER_ROLE.freelancer, USER_ROLE.customer),
  validateRequest(chatValidation.createChatValidation),
  chatController.updateChat,
);

router.delete(
  '/:id',
  auth(USER_ROLE.owner, USER_ROLE.freelancer, USER_ROLE.customer),
  chatController.deleteChat,
);

router.get(
  '/my-chat-list',
  auth(USER_ROLE.owner, USER_ROLE.freelancer, USER_ROLE.customer),
  chatController.getMyChatList,
);

router.get(
  '/:id',
  auth(USER_ROLE.owner, USER_ROLE.freelancer, USER_ROLE.customer),
  chatController.getChatById,
);

export const chatRoutes = router;
