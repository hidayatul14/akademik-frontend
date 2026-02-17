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
