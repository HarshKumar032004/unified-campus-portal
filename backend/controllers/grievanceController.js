
import Grievance from '../models/Grievance.js';

export const createGrievance = async (req, res) => {
  const { title, description, category, isAnonymous } = req.body;
  const studentId = req.user.id;

  try {
    const grievance = await Grievance.create({
      studentId,
      title,
      description,
      category,
      isAnonymous: isAnonymous || false,
    });

    res.status(201).json({
      message: 'Grievance submitted successfully!',
      grievance,
    });
  } catch (error) {
    console.error('Create Grievance Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not submit grievance.' });
  }
};

export const getMyGrievances = async (req, res) => {
  const studentId = req.user.id;

  try {
    const grievances = await Grievance.find({ studentId }).sort({ createdAt: -1 });

    res.status(200).json({
      count: grievances.length,
      grievances,
    });
  } catch (error) {
    console.error('Get My Grievances Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not fetch grievances.' });
  }
};

export const getPublicGrievances = async (req, res) => {
  try {
    const rawGrievances = await Grievance.find()
      .populate('studentId', 'name')
      .sort({ createdAt: -1 });

    // Anonymize for public board
    const grievances = rawGrievances.map(g => {
      const gObj = g.toObject();
      if (gObj.isAnonymous && gObj.studentId) {
        gObj.studentId.name = 'Anonymous Student';
        delete gObj.studentId._id;
      }
      return gObj;
    });

    res.status(200).json({
      count: grievances.length,
      grievances,
    });
  } catch (error) {
    console.error('Get Public Grievances Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not fetch public grievances.' });
  }
};

export const getAllGrievances = async (req, res) => {
  try {
    const rawGrievances = await Grievance.find()
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Process auto-escalation and anonymization
    const processedGrievances = await Promise.all(
      rawGrievances.map(async (g) => {
        // Auto-Escalation Check
        if (g.status === 'Pending' && new Date(g.createdAt) < threeDaysAgo && !g.isEscalated) {
          g.isEscalated = true;
          await g.save();
        }

        // Anonymization Check
        const gObj = g.toObject();
        if (gObj.isAnonymous && gObj.studentId) {
          gObj.studentId.name = 'Anonymous Student';
          gObj.studentId.email = 'Hidden';
          delete gObj.studentId._id;
        }

        return gObj;
      })
    );

    res.status(200).json({
      count: processedGrievances.length,
      grievances: processedGrievances,
    });
  } catch (error) {
    console.error('Get All Grievances Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not fetch grievances.' });
  }
};

export const updateGrievanceStatus = async (req, res) => {
  const grievanceId = req.params.id;
  const { status, adminRemark } = req.body;

  try {
    const updatedGrievance = await Grievance.findByIdAndUpdate(
      grievanceId,
      { status, adminRemark },
      { new: true, runValidators: true }
    );

    if (!updatedGrievance) {
      return res.status(404).json({ message: 'Grievance not found.' });
    }

    res.status(200).json({
      message: 'Grievance status updated successfully!',
      grievance: updatedGrievance,
    });
  } catch (error) {
    console.error('Update Status Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not update status.' });
  }
};

export const upvoteGrievance = async (req, res) => {
  const grievanceId = req.params.id;
  const studentId = req.user.id;

  try {
    const grievance = await Grievance.findById(grievanceId);

    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found.' });
    }

    // Check if the student has already upvoted
    if (grievance.upvotes.some(id => id.toString() === studentId.toString())) {
      return res.status(400).json({ message: 'You have already upvoted this grievance.' });
    }

    // Add student ID to upvotes
    grievance.upvotes.push(studentId);
    await grievance.save();

    res.status(200).json({
      message: 'Grievance upvoted successfully!',
      grievance,
    });
  } catch (error) {
    console.error('Upvote Grievance Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not upvote grievance.' });
  }
};
