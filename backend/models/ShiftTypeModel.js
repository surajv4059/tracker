import mongoose from 'mongoose';

const shiftTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  allowance: {
    type: Number,
    required: true,
  },
});

const ShiftType = mongoose.model('ShiftType', shiftTypeSchema);

export default ShiftType;
