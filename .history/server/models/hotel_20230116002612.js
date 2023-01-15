import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const hotelSchema = new Schema( {
  title: {
    type: String,
    required: "Title is required"
  }
} );