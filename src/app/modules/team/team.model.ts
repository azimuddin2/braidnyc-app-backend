import { model, Schema } from 'mongoose';
import { TTeam } from './team.interface';

const teamSchema = new Schema<TTeam>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    timeZone: {
      type: String,
      required: true,
    },
    workHours: {
      type: String,
      required: true,
    },
    assignTask: {
      type: [String],
      default: [],
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  },
);

// Create model
export const Team = model<TTeam>('Team', teamSchema);
