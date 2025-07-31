export type TTeam = {
  _id?: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  speciality: string;
  timeZone: string;
  workHours: string;
  assignTask: string[];
  phone: string;
};
