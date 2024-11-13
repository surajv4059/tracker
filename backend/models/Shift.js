import mongoose from 'mongoose';

const shiftRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  date: { type: Date, required: true },
  shiftType: { 
    type: String, 
    required: true 
  },
  workLocation: { 
    type: String, 
    enum: ['office', 'home', 'PL', 'UPL','CO'], 
    required: true 
  },
  shiftAllowance: { type: Number, default: 0 },
  travelAllowance: { type: Number, default: 0 },
});

export default mongoose.model('Shift', shiftRecordSchema);
