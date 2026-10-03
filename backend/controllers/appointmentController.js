import Appointment from '../models/Appointment.js';

/**
 * @desc   Get all appointments (optionally filtered by petId or status)
 * @route  GET /api/appointments
 */
export const getAppointments = async (req, res) => {
  try {
    const { petId, status } = req.query;
    const filter = {};

    if (petId) filter.petId = petId;
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('petId', 'name species avatarUrl breed')
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vet appointments',
      error: error.message,
    });
  }
};

/**
 * @desc   Create a new appointment
 * @route  POST /api/appointments
 */
export const createAppointment = async (req, res) => {
  try {
    const { petId, clinicName, doctorName, appointmentDate, timeSlot, reason, status, contactPhone, notes } = req.body;

    if (!petId || !clinicName || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide petId, clinicName, and appointmentDate',
      });
    }

    const appointment = await Appointment.create({
      petId,
      clinicName,
      doctorName: doctorName || '',
      appointmentDate,
      timeSlot: timeSlot || '10:00 AM',
      reason: reason || 'Routine Checkup',
      status: status || 'Scheduled',
      contactPhone: contactPhone || '',
      notes: notes || '',
    });

    const populated = await Appointment.findById(appointment._id).populate('petId', 'name species avatarUrl breed');

    res.status(201).json({
      success: true,
      message: 'Vet appointment scheduled successfully',
      data: populated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error scheduling appointment',
      error: error.message,
    });
  }
};

/**
 * @desc   Update appointment details or status
 * @route  PUT /api/appointments/:id
 */
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('petId', 'name species avatarUrl breed');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message,
    });
  }
};

/**
 * @desc   Delete an appointment
 * @route  DELETE /api/appointments/:id
 */
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment removed successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting appointment',
      error: error.message,
    });
  }
};
