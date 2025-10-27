import {
  TApprovalStatus,
  TAvailability,
} from './freelancerRegistration.interface';

export const ApprovalStatus: TApprovalStatus[] = [
  'pending',
  'approved',
  'rejected',
];

export const Availability: TAvailability[] = ['salon', 'mobile', 'home'];
