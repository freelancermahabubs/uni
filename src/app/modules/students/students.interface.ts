import { Model, Types } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};
export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};
export type TStudents = {
  id: string;
  user: Types.ObjectId;
  password: string;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanetAddress: string;
  guardian: TGuardian;
  email: string;
  profileImage?: string;
  admissionSemester: Types.ObjectId;
  localGuardian: TLocalGuardian;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};

// for creating static

export interface StudnetModel extends Model<TStudents> {
  isUserExists(id: string): Promise<TStudents | null>;
}

// for crating instance
// export type StudnetMethods = {
//   isUserExists(id: string): Promise<TStudents | null>;
// };

// export type StudentModel = Model<
//   TStudents,
//   Record<string, never>,
//   StudnetMethods
// >;
