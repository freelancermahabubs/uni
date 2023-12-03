/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import validator from 'validator';

import {
  StudnetModel,
  TGuardian,
  TLocalGuardian,
  TStudents,
  TUserName,
} from './students.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'Name is Required'],
    trim: true,
    maxlength: [20, 'First Name cna not be more than 20 characters'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: '{VALUE} is not in capitalize format',
    },
  },
  middleName: {
    trim: true,
    type: String,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not vaild',
    },
  },

  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is Required'],
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    trim: true,
    required: [true, 'Father Name is Required'],
  },

  fatherOccupation: {
    type: String,
    trim: true,
    required: [true, 'Father Occupation is Required'],
  },
  fatherContactNo: {
    type: String,
    trim: true,
    required: [true, 'Father ContactNo is Required'],
  },
  motherName: {
    type: String,
    trim: true,
    required: [true, 'Mother Name is Required'],
  },
  motherOccupation: {
    type: String,
    trim: true,
    required: [true, 'Mother Occupation is Required'],
  },
  motherContactNo: {
    type: String,
    trim: true,
    required: [true, 'Mother ContactNo is Required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    trim: true,
    type: String,
    required: [true, ' Name is Required'],
  },
  occupation: {
    type: String,
    trim: true,
    required: [true, 'Occupationis Required'],
  },
  contactNo: {
    type: String,
    trim: true,
    required: [true, 'ContactNo  is Required'],
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'Address  is Required'],
  },
});
const studentsSchema = new Schema<TStudents, StudnetModel>(
  {
    id: { type: String, required: [true, 'ID is Required'], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is Required'],
      unique: true,
      ref: 'User',
    },

    name: {
      type: userNameSchema,
      required: true,
    },

    gender: {
      type: String,
      trim: true,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not valid',
      },
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a valid email type',
      },
    },

    contactNo: {
      type: String,
      trim: true,
      required: [true, 'ContactNo is Required'],
    },
    emergencyContactNo: {
      type: String,
      trim: true,
      required: [true, 'emergencyContactNo is Required'],
    },

    bloodGroup: {
      type: String,
      trim: true,
      enum: {
        values: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
        message:
          "The blood Group field is can only be one of the following: 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'.",
      },
      required: true,
    },
    presentAddress: {
      type: String,
      trim: true,
      required: [true, 'present Address is Required'],
    },
    permanetAddress: {
      type: String,
      trim: true,
      required: [true, 'permanet Address is Required'],
    },
    guardian: {
      type: guardianSchema,
      required: true,
    },

    localGuardian: {
      type: localGuardianSchema,
      required: true,
    },
    profileImage: { type: String, trim: true },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// virtual

studentsSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName}  ${this.name.lastName}`;
});

// creating  a custom static method
studentsSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

// query middleware

studentsSchema.pre('find', function (next) {
  // console.log(this);

  this.find({ isDeleted: { $ne: true } });
  next();
});

studentsSchema.pre('findOne', function (next) {
  // console.log(this);

  this.find({ isDeleted: { $ne: true } });
  next();
});

// Aggregate
studentsSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});

studentsSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isStudentExist = await Student.findOne(query);
  if (!isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Student does not exist!');
  }
  next();
});

// creating a custom instance methoad

export const Student = model<TStudents, StudnetModel>(
  'Student',
  studentsSchema,
);
