// The backend currently returns an empty list, so fields are optional and the
// store maps several possible naming conventions defensively.
export interface Student {
  id?: string;
  student_id?: string;
  studentId?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  dob?: string;
  phone_number?: string;
  phone?: string;
  address?: string;
  class_id?: string;
  class_name?: string;
  grade?: string;
  section?: string;
  blood_group?: string;
  height?: string;
  weight?: string;
  ethnicity?: string;
  mass_org?: string;
  father_name?: string;
  mother_name?: string;
  parent_name?: string;
  parent_number?: string;
  parent_phone?: string;
  status?: string;
  [key: string]: unknown;
}
