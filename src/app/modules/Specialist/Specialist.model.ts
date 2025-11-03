import { model, Schema } from 'mongoose';
import { TSpecialist } from './Specialist.interface';

const specialistSchema = new Schema<TSpecialist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id is required'],
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  },
);

// Create model
export const Specialist = model<TSpecialist>('Specialist', specialistSchema);
