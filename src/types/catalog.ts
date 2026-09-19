export interface Student {
  id: number;
  nim: string;
  name: string;
  email: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
}
