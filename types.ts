
export interface AttendanceSession {
  id: string;
  year: string;
  lecture: string;
  facultyName: string;
  totalStudents: number;
  date: string;
  time: string;
  presentRolls: Set<number> | number[]; // Support both for serialization
}

export interface SetupFormData {
  year: string;
  lecture: string;
  facultyName: string;
  totalStudents: string;
}

export interface UserAccount {
  username: string;
  password: string;
  history: AttendanceSession[];
}

export interface UserRegistry {
  [username: string]: UserAccount;
}
