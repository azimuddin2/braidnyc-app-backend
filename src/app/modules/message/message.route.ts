import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { MessagesController } from './message.controller';
import { MessagesValidation } from './message.validation';

const router = Router();

router.post(
  '/send-messages',
  auth(
    USER_ROLE.admin,
    USER_ROLE.customer,
    USER_ROLE.owner,
    USER_ROLE.freelancer,
  ),
  validateRequest(MessagesValidation.sendMessageValidation),
  MessagesController.createMessages,
);

router.patch(
  '/seen/:chatId',
  auth(
    USER_ROLE.admin,
    USER_ROLE.customer,
    USER_ROLE.owner,
    USER_ROLE.freelancer,
  ),
  MessagesController.seenMessage,
);

router.patch(
  '/update/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.customer,
    USER_ROLE.owner,
    USER_ROLE.freelancer,
  ),
  validateRequest(MessagesValidation.updateMessageValidation),
  MessagesController.updateMessages,
);

router.get('/my-messages/:chatId', MessagesController.getMessagesByChatId);

router.delete(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.customer,
    USER_ROLE.owner,
    USER_ROLE.freelancer,
  ),
  MessagesController.deleteMessages,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.customer,
    USER_ROLE.owner,
    USER_ROLE.freelancer,
  ),
  MessagesController.getMessagesById,
);

router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.customer,
    USER_ROLE.owner,
    USER_ROLE.freelancer,
  ),
  MessagesController.getAllMessages,
);

export const messagesRoutes = router;
