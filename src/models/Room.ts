import  { Document, Model, Schema, Types, model } from 'mongoose';

export interface IRoom extends Document {
  roomNumber: number | string;
  countReviews?: number;
  rate?: number;
  images?: Types.Array<string>;
  price: number;
  type?: 'Standard' | 'Suite';
  comforts?: Types.Array<string>;
  bookings?: Types.Array<Types.ObjectId> | null;
  hasWifi?: boolean;
  hasConditioner?: boolean;
  hasWorkSpace?: boolean;
  canSmoke?: boolean;
  canPets?: boolean;
  canInvite?: boolean;
  hasWideHallway?: boolean;
  hasDisabledAssistant?: boolean;
}

const roomSchema: Schema = new Schema<IRoom>({
  roomNumber: { type: Number, required: true},
  price: { type: Number, required: true},
  countReviews: Number,
  rate: Number,
  images: [String],
  comforts: [String],
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
  type: { type: String, enum: ["Standard", "Suite"] },
  hasWifi: Boolean,
  hasConditioner: Boolean,
  hasWorkSpace: Boolean,
  canSmoke: Boolean,
  canPets: Boolean,
  canInvite: Boolean,
  hasWideHallway: Boolean,
  hasDisabledAssistant: Boolean
});

const Room: Model<IRoom> = model<IRoom>('Room', roomSchema);

export default Room;