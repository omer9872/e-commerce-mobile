export interface IBlogPost {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  imageGallery: string[];
  isActive: boolean;
  isFeatured: boolean;

  createdAt: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
