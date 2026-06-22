
import Outpass from '../models/Outpass.js';

export const applyOutpass = async (req, res) => {
  const { destination, reason, departureDate, returnDate } = req.body;
  const studentId = req.user.id;

  try {
    const newOutpass = await Outpass.create({
      studentId,
      destination,
      reason,
      departureDate,
      returnDate,
    });

    res.status(201).json({
      message: 'Outpass application submitted successfully!',
      outpass: newOutpass,
    });
  } catch (error) {
    console.error('Apply Outpass Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not submit application.' });
  }
};

export const getMyOutpasses = async (req, res) => {
  const studentId = req.user.id;

  try {
    const outpasses = await Outpass.find({ studentId }).sort({ createdAt: -1 });

    res.status(200).json({
      count: outpasses.length,
      outpasses,
    });
  } catch (error) {
    console.error('Get My Outpasses Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not fetch outpasses.' });
  }
};

export const getAllOutpasses = async (req, res) => {
  try {
    const outpasses = await Outpass.find()
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: outpasses.length,
      outpasses,
    });
  } catch (error) {
    console.error('Get All Outpasses Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not fetch outpasses.' });
  }
};

export const updateOutpassStatus = async (req, res) => {
  const outpassId = req.params.id;
  const { status } = req.body;

  try {
    const outpass = await Outpass.findByIdAndUpdate(
      outpassId,
      { status },
      { new: true, runValidators: true }
    );

    if (!outpass) {
      return res.status(404).json({ message: 'Outpass not found.' });
    }

    res.status(200).json({
      message: `Outpass marked as ${status}.`,
      outpass,
    });
  } catch (error) {
    console.error('Update Outpass Status Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not update status.' });
  }
};
