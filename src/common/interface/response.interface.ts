export interface StandardResponse<T> {
  status: string;
  data?: T;
  error?: string;
}
