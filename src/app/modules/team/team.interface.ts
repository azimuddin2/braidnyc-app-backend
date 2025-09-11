import { Types } from 'mongoose';

export type TTeam = {
  _id?: string;
  vendor: Types.ObjectId;
  name: string;
  email: string;
  image: string | null;
  role: string;
  speciality: string;
  timeZone: string;
  workHours: string;
  assignTask: string[];
  phone: string;
  isDeleted: boolean;
};
