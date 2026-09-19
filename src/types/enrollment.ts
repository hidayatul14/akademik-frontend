export interface Enrollment {
  id: number;

  // Student
  nim: string;
  student_name: string;
  email: string;

  // Course
  course_code: string;
  course_name: string;
  credits: number;

  // Enrollment
  academic_year: string;
  semester: "GANJIL" | "GENAP";
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
}

export interface EnrollmentPagination {
  current_page: number;
  data: Enrollment[];
  first_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface EnrollmentSort {
  field: string;
  dir: "asc" | "desc";
}

export type FilterOperator = "equal" | "contains" | "startsWith" | "in" | "between";

export interface EnrollmentFilter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string | string[];
}
