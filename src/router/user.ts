import { Router } from 'express';
import UserController from '../controller/user_controller';
import { validate } from 'express-validation';
import { UserLoginValidator, UserSignupValidator } from '../types/user';
import { allowRoles, validateAuth } from './middleware/auth';
import { UserRole } from '../database/models/user';

export const UserRouter: Router = Router();
const user = UserController.getInstance();

UserRouter.post('/signup', validate(UserSignupValidator), user.SignUp);
UserRouter.post('/login', validate(UserLoginValidator), user.Login);
UserRouter.get('/purchases', validateAuth, allowRoles([UserRole.User]), user.GetUserPurchases);
