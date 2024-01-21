import  { Document, Model, Schema, model } from 'mongoose';

export interface ILike extends Document {
  reviewId: string;
  userId: string;
  created_at?: Date;
  updated_at?: Date;
}

const likeSchema: Schema = new Schema<ILike>(
  {
    reviewId: {
      type: String,
      ref: 'Review',
      required: true
    },
    userId: {
      type: String,
      ref: 'User',
      required: true
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);


const Like: Model<ILike> = model<ILike>('Like', likeSchema);

export default Like;
