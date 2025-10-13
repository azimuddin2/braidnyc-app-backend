import { TRole, TStatus } from './user.interface';

export const USER_ROLE = {
  customer: 'customer',
  owner: 'owner',
  freelance: 'freelance',
  admin: 'admin',
} as const;

export const UserRole: TRole[] = ['customer', 'owner', 'freelance', 'admin'];

export const UserStatus: TStatus[] = ['ongoing', 'confirmed', 'blocked'];

export const userSearchableFields = [
  'fullName',
  'email',
  'phone',
  'streetAddress',
  'city',
  'state',
];
