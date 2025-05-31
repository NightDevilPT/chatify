import { CreateUserHandler } from './handlers/create-user.handler';
import { ForgotPasswordHandler } from './handlers/forget-user.handler';
import { LoginUserHandler } from './handlers/login-user.handler';
import { ResetPasswordHandler } from './handlers/reset-user.handler';
import { VerifyUserHandler } from './handlers/verify-user.handler';

export const UserCommandHandlers = [
  CreateUserHandler,
  VerifyUserHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler,
  LoginUserHandler,
];
