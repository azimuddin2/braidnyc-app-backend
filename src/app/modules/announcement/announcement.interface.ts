export type TImage = {
  url: string;
  key: string;
};

export type TAnnouncement = {
  _id?: string;
  deleteKey: string[];
  images: TImage[];
  isDeleted: boolean;
};
