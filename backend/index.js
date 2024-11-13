import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import shiftRoutes from './routes/shiftRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// console.log(process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err));

 
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shift',shiftRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
