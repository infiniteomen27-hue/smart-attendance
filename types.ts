
export interface AttendanceSession {
  year: string;
  lecture: string;
  totalStudents: number;
  date: string;
  time: string;
  presentRolls: Set<number>;
}

export interface SetupFormData {
  year: string;
  lecture: string;
  totalStudents: string;
}
