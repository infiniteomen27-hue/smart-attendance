
export interface AttendanceSession {
  id: string;
  year: string;
  lecture: string;
  facultyName: string;
  totalStudents: number;
  date: string;
  time: string;
  presentRolls: Set<number>;
}

export interface SetupFormData {
  year: string;
  lecture: string;
  facultyName: string;
  totalStudents: string;
}
