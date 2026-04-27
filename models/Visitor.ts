import mongoose, { Document, Model } from "mongoose";

export interface IVisitor extends Document {
  ip: string;
  date: string;
  count: number;
}

const visitorSchema = new mongoose.Schema(
  {
    ip: { type: String, required: true },
    date: { type: String, required: true },
    count: { type: Number, default: 1 },
  },
  { timestamps: true }
);

visitorSchema.index({ ip: 1, date: 1 }, { unique: true });

const Visitor: Model<IVisitor> = mongoose.models.Visitor || mongoose.model<IVisitor>("Visitor", visitorSchema);

export default Visitor;
