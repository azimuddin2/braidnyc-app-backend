import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TUser, UserModel } from './user.interface';
import { UserRole, UserStatus } from './user.constant';

// ✅ Define the Mongoose schema
const userSchema = new Schema<TUser, UserModel>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [3, 'Full name must be at least 3 characters'],
      maxlength: [50, 'Full name can not exceed 50 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^\+?[0-9]{10,15}$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please enter a valid email address',
      },
    },
    streetAddress: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      maxlength: [20, 'Password must not exceed 20 characters'],
      select: 0, // exclude password from query results
    },
    needsPasswordChange: {
      type: Boolean,
      default: false,
    },
    passwordChangeAt: {
      type: Date,
    },
    referralCode: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      trim: true,
      required: false,
    },
    selectSalon: {
      type: String,
    },
    role: {
      type: String,
      enum: {
        values: UserRole,
        message: '{VALUE} is not valid',
      },
      default: 'customer',
    },
    status: {
      type: String,
      enum: {
        values: UserStatus,
        message: '{VALUE} is not valid',
      },
      default: 'ongoing',
    },
    image: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verification: {
      otp: {
        type: String,
        select: 0,
      },
      expiresAt: {
        type: Date,
        select: 0,
      },
      status: {
        type: Boolean,
        default: false,
        select: 0,
      },
    },
    stripeCustomerId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// ✅ Password hash before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  next();
});

// ✅ Clear sensitive data after saving
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// ✅ Static methods
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  if (!passwordChangedTimestamp) return false;
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000; // convert to seconds
  return passwordChangedTime > jwtIssuedTimestamp;
};

// ✅ Export model
export const User = model<TUser, UserModel>('User', userSchema);
