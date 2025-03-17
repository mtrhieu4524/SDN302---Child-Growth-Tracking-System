export interface IQuery {
  page: number;
  size: number;
  search?: string;
  order?: "ascending" | "descending";
  sortBy?: "date" | "name" | "price";
  [key: string]: any;
}
