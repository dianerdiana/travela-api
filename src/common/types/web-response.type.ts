import { Pagination } from './pagination.type';

export type WebResponse<T> = {
  error: boolean;
  message: string;
  data?: T;
  paging?: Pagination & { total_pages: number };
};
