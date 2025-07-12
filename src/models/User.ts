// src/models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

// TypeScript 인터페이스 정의
export interface IUser extends Document {
  _id:mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose 스키마 정의
const UserSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      '올바른 이메일 형식이 아닙니다.'
    ]
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다.'],
    minlength: [6, '비밀번호는 6자 이상이어야 합니다.']
  },
  name: {
    type: String,
    required: [true, '이름은 필수입니다.'],
    trim: true,
    maxlength: [50, '이름은 50자를 초과할 수 없습니다.']
  },
  image: {
    type: String,
    default: null
  },
  emailVerified: {
    type: Date,
    default: null
  }
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
});

// 이메일 인덱스 생성 (빠른 검색을 위해)
UserSchema.index({ email: 1 });

// 모델이 이미 존재하는지 확인 후 생성 (Next.js hot reload 대응)
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;