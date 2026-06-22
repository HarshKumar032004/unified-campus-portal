
import LostItem from '../models/LostItem.js';

export const createItem = async (req, res) => {
  const { itemName, description, type, contactInfo } = req.body;
  const reportedBy = req.user.id;

  try {
    const newItem = await LostItem.create({
      itemName,
      description,
      type,
      contactInfo,
      reportedBy,
    });

    res.status(201).json({
      message: 'Item reported successfully!',
      item: newItem,
    });
  } catch (error) {
    console.error('Create Lost Item Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not report item.' });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await LostItem.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: items.length,
      items,
    });
  } catch (error) {
    console.error('Get All Items Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not fetch items.' });
  }
};

export const resolveItem = async (req, res) => {
  const itemId = req.params.id;

  try {
    const item = await LostItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    item.status = 'Resolved';
    await item.save();

    res.status(200).json({
      message: 'Item marked as resolved.',
      item,
    });
  } catch (error) {
    console.error('Resolve Item Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not resolve item.' });
  }
};
