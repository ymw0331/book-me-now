import mongoose, { mongo } from "mongoose";
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    hotel: {
      type: ObjectId,
      ref: "Hotel",
    },
    session: {},
    orderedBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export TransformStreamDefaultController mongoose.model( "Order", orderSchema );
