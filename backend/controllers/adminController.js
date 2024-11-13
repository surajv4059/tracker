import ShiftType from '../models/ShiftTypeModel.js';
import ShiftRecord from '../models/Shift.js';
import User from '../models/User.js';
 
// Add a new shift type
export const addShiftType = async (req, res) => {
  try {
    const { name, allowance } = req.body;

    const shiftType = new ShiftType({ name, allowance });
    await shiftType.save();

    res.json({ message: 'Shift type added successfully', shiftType });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing shift type
export const updateShiftType = async (req, res) => {
  try {
    const { shiftTypeId } = req.query;
    const { name, allowance } = req.body;

    const shiftType = await ShiftType.findByIdAndUpdate(
      shiftTypeId,
      { name, allowance },
      { new: true }
    );

    if (!shiftType) {
      return res.status(404).json({ error: 'Shift type not found' });
    }

    res.json({ message: 'Shift type updated successfully', shiftType });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a shift type
export const deleteShiftType = async (req, res) => {
  try {
    const { shiftTypeId } = req.params;

    await ShiftType.findByIdAndDelete(shiftTypeId);

    res.json({ message: 'Shift type deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all shift types
export const getShiftTypes = async (req, res) => {
  try {
    const shiftTypes = await ShiftType.find();
    res.json(shiftTypes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Calculate monthly allowances for a user
export const calculateAllowances = async (req, res) => {
  try {
    const { userId, month, year } = req.body;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const shiftRecords = await ShiftRecord.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).populate('shiftType');

    let totalShiftAllowance = 0;
    let totalTravelAllowance = 0;
    let workFromOfficeCount = 0;
    let workFromHomeCount = 0;

    shiftRecords.forEach(record => {
      totalShiftAllowance += record.shiftAllowance;
      totalTravelAllowance += record.travelAllowance;
      if (record.workLocation === 'office') {
        workFromOfficeCount++;
      } else if (record.workLocation === 'home') {
        workFromHomeCount++;
      }
    });

    res.json({ 
      totalShiftAllowance, 
      totalTravelAllowance, 
      workFromOfficeCount, 
      workFromHomeCount 
    });
    
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {

    res.status(400).json({ error: error.message });
  }
};

export const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndDelete(userId);
    await ShiftRecord.deleteMany({ user: userId });

    res.json({ message: 'User and associated shift records removed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const modifyShiftRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { shiftType, workLocation } = req.body;

    const shift = await ShiftType.findOne({ name: shiftType });
    if (!shift) {
      return res.status(400).json({ error: 'Invalid shift type' });
    }

    const shiftRecord = await ShiftRecord.findById(recordId);
    if (!shiftRecord) {
      return res.status(404).json({ error: 'Shift record not found' });
    }

    shiftRecord.shiftType = shiftType;
    shiftRecord.workLocation = workLocation;
    shiftRecord.shiftAllowance = shift.allowance;
    shiftRecord.travelAllowance = workLocation === 'office' ? 250 : 0;

    await shiftRecord.save();

    res.json({ message: 'Shift record updated successfully', shiftRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
