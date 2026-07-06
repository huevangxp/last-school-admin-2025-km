export interface Teacher {
  id: string;
  username: string;
  teacher_id: string;
  avatar: string;
  gender: string;
  dob: string;
  phone_number: string;
  full_name: string;
  role: string;
  login_count: number;
  last_login_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
