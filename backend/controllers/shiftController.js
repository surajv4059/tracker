import ShiftRecord from '../models/Shift.js';
import ShiftType from '../models/ShiftTypeModel.js';


export const createOrUpdateShiftRecord = async (req, res) => {
  try {
    const { date ,shiftType} = req.body;
    let {workLocation} = req.body;

    const shift = await ShiftType.findOne({ name: shiftType });
    if (!shift) {
      return res.status(400).json({ error: 'Invalid shift type' });
    }

    const shiftAllowance = shift.allowance;
    let travelAllowance = 0;

    if (shiftType !== 'PL' && shiftType !== 'UPL' && shiftType !== 'CO') {
      travelAllowance = workLocation === 'office' ? 250 : 0;
    }

    if (shiftType === 'PL' || shiftType === 'UPL' || shiftType === 'CO') {
       workLocation = shiftType;
    }


    let shiftRecord = await ShiftRecord.findOne({ user: req.user.id, date });

    if (shiftRecord) {
      shiftRecord.shiftType = shiftType;
      shiftRecord.workLocation = workLocation;
      shiftRecord.shiftAllowance = shiftAllowance;
      shiftRecord.travelAllowance = travelAllowance;
      await shiftRecord.save();
    } else {
      shiftRecord = new ShiftRecord({
        user: req.user.id,
        date,
        shiftType,
        workLocation,
        shiftAllowance,
        travelAllowance,
      });
      await shiftRecord.save();
    }

    res.json(shiftRecord);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getShiftRecords = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const shiftRecords = await ShiftRecord.find({
      user: req.user.id,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    res.json(shiftRecords);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getShiftRecordsForSpecificUser = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;

    if (!startDate || !endDate || !userId) {
      return res.status(400).json({ error: 'Start date, end date, and userId are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const shiftRecords = await ShiftRecord.find({
      user: userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    res.json(shiftRecords);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteShiftRecord = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const shiftRecord = await ShiftRecord.findOneAndDelete({
      user: req.user.id,
      date,
    });

    if (!shiftRecord) {
      return res.status(404).json({ error: 'Shift record not found' });
    }

    res.json({ message: 'Shift record deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
