export type TUser = {
  id: string;
  password: string;
  needsPasswrodChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};
