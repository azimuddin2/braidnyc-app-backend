export const ACCOUNT_TYPE = {
  SERVICE_PROVIDER: 'service provider',
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const AccountType = ['service provider', 'user', 'admin'];

export const UserStatus = ['ongoing', 'confirmed'];

export const userSearchableFields = ['name', 'email'];
