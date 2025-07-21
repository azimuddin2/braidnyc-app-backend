import { TRole, TStatus } from './user.interface';

export const USER_ROLE = {
  service_provider: 'service_provider',
  user: 'user',
  admin: 'admin',
} as const;

export const UserRole: TRole[] = ['service_provider', 'user', 'admin'];

export const UserStatus: TStatus[] = ['ongoing', 'confirmed', 'blocked'];

export const userSearchableFields = [
  'firstName',
  'lastName',
  'fullName',
  'email',
  'phone',
  'country',
  'status',
];
