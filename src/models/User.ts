import  { Document, Model, Schema, model } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  secondName: string;
  subscribe?: boolean;
  birthYear: Date | number;
  avatarPhoto?: string;
  email?: string;
  password?: string;
  role: 'user' | 'admin';
  gender: 'male' | 'female';
}

const userSchema: Schema = new Schema<IUser>({
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  subscribe: Boolean,
  birthYear: Number,
  avatarPhoto: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'] },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['male', 'female'] },
});

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
