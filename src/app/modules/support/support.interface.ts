export type TSupport = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  messageReply?: string;
  follow: 'yes' | 'no';
  isDeleted: boolean;
};
