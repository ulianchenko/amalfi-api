import  { Document, Model, Schema, Types, model } from 'mongoose';


export interface IBooking extends Document {
  adults: number;
  babies: number;
  children: number;
  arrivalDate: Date;
  departureDate: Date;
  roomId: Types.ObjectId;
  userId: Types.ObjectId;
  totalPrice: number;
  expires_at?: number;
}

const bookingSchema: Schema = new Schema<IBooking>({
  adults: { type: Number, required: true },
  babies: { type: Number, required: true },
  children: { type: Number, required: true },
  arrivalDate: Date,
  departureDate: Date,
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required : true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required : true },
  totalPrice: { type: Number, required: true },
  expires_at: Number
});


const Booking: Model<IBooking> = model<IBooking>('Booking', bookingSchema);

export default Booking;