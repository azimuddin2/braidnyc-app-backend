import { Types } from 'mongoose';

export type TImage = {
    url: string;
    key: string;
};

export type TServiceStatus = 'available' | 'unavailable';

export type TOwnerService = {
    _id?: string;
    user: Types.ObjectId;
    ownerRegistration: Types.ObjectId;
    deleteKey: string[];
    images: TImage[];
    name: string;
    time: string;
    price: number;
    description: string;
    status: TServiceStatus;
    reviews?: Types.ObjectId[];
    avgRating?: number;

    isDeleted: boolean;
};
