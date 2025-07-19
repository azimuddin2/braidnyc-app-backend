import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { TRegisterUser, UserModel } from './user.interface';
import config from '../../config';

const registerUserSchema = new Schema<TRegisterUser, UserModel>(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
      trim: true,
      minlength: [3, 'The length of first name can be minimum 3 characters'],
      maxlength: [20, 'The length of first name can be maximum 20 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
      trim: true,
      minlength: [3, 'The length of last name can be minimum 3 characters'],
      maxlength: [20, 'The length of last name can be maximum 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please enter a valid email',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone Number is required'],
      trim: true,
      validate: {
        validator: function (v) {
          return /^\+?[0-9]{10,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid contact number!`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      minlength: [8, 'Password can be minimum 8 characters'],
      maxlength: [20, 'Password can not be more than 20 characters'],
    },
    confirmPassword: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      minlength: [8, 'Password can be minimum 8 characters'],
      maxlength: [20, 'Password can not be more than 20 characters'],
    },
    accountType: {
      type: String,
      enum: {
        values: ['service provider', 'user', 'admin'],
        message: '{VALUE} is not valid',
      },
      default: 'user',
    },
    image: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['ongoing', 'confirmed'],
        message: '{VALUE} is not valid',
      },
      default: 'ongoing',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

registerUserSchema.pre('save', async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  user.confirmPassword = await bcrypt.hash(
    user.confirmPassword,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// set '' after saving password
registerUserSchema.post('save', function (doc, next) {
  doc.password = '';
  doc.confirmPassword = '';
  next();
});

registerUserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashPassword);
};

registerUserSchema.statics.isJWTIssuedBeforePasswordChanged = async function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 100;

  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TRegisterUser, UserModel>('User', registerUserSchema);
