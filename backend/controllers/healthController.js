import HealthRecord from '../models/HealthRecord.js';

/**
 * @desc   Get all health records (optionally filtered by petId or type)
 * @route  GET /api/health
 */
export const getHealthRecords = async (req, res) => {
  try {
    const { petId, recordType } = req.query;
    const filter = {};

    if (petId) filter.petId = petId;
    if (recordType) filter.recordType = recordType;

    const records = await HealthRecord.find(filter)
      .populate('petId', 'name species avatarUrl')
      .sort({ dateAdministered: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching health records',
      error: error.message,
    });
  }
};

/**
 * @desc   Create new health record
 * @route  POST /api/health
 */
export const createHealthRecord = async (req, res) => {
  try {
    const { petId, recordType, title, dateAdministered, nextDueDate, veterinarian, clinicName, dosage, notes } = req.body;

    if (!petId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both petId and record title',
      });
    }

    const record = await HealthRecord.create({
      petId,
      recordType: recordType || 'Vaccination',
      title,
      dateAdministered: dateAdministered || new Date(),
      nextDueDate: nextDueDate || null,
      veterinarian: veterinarian || '',
      clinicName: clinicName || '',
      dosage: dosage || '',
      notes: notes || '',
    });

    const populated = await HealthRecord.findById(record._id).populate('petId', 'name species avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Health record logged successfully',
      data: populated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating health record',
      error: error.message,
    });
  }
};

/**
 * @desc   Update health record
 * @route  PUT /api/health/:id
 */
export const updateHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('petId', 'name species avatarUrl');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Health record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Health record updated successfully',
      data: record,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating health record',
      error: error.message,
    });
  }
};

/**
 * @desc   Delete health record
 * @route  DELETE /api/health/:id
 */
export const deleteHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Health record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Health record deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting health record',
      error: error.message,
    });
  }
};
