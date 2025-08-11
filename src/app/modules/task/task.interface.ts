export type TStatus =
  | 'To-Do'
  | 'In Progress'
  | 'Needs Review'
  | 'Blocked/Dependencies'
  | 'Done'
  | 'Obsolete';

export type TTask = {
  _id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  assignTeamMember: string;
  status: TStatus;
  isDeleted: boolean;
};
