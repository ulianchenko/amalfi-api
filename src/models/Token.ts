import  { Document, Model, Schema, Types, model } from 'mongoose';

export interface IToken extends Document {
  user?: Types.ObjectId;
  refreshToken: string;
}

const tokenSchema: Schema = new Schema<IToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);


const Token: Model<IToken> = model<IToken>('Token', tokenSchema);

export default Token;
