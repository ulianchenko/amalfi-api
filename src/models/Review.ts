import  { Document, Model, Schema, Types, model } from 'mongoose';

export interface IReview extends Document {
  content: string;
  rating: number;
  roomId: Types.ObjectId;
  userId?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

const reviewSchema: Schema = new Schema<IReview>(
  {
    content: {
      type: String,
      required: true,
    },
    rating: Number,
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Review: Model<IReview> = model<IReview>('Review', reviewSchema);

export default Review;
