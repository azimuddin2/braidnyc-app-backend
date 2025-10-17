import { TRole, TStatus } from './user.interface';

export const USER_ROLE = {
  customer: 'customer',
  owner: 'owner',
  freelancer: 'freelancer',
  admin: 'admin',
} as const;

export const UserRole: TRole[] = ['customer', 'owner', 'freelancer', 'admin'];

export const UserStatus: TStatus[] = ['ongoing', 'confirmed', 'blocked'];

export const userSearchableFields = [
  'fullName',
  'email',
  'phone',
  'streetAddress',
  'city',
  'state',
];
