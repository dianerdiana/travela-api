export type PackageTourEntity = {
  id: string;
  name: string;
  slug: string;
  thumbnailId: string | null;
  price: number;
  days: number;
  isRecommended: boolean;
  city: string | null;
  province: string | null;
  country: string | null;
  about: string | null;
  rating: number;
  status: string;
  createdBy: number;
  updatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
};
