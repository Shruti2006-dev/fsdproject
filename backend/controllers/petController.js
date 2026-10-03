import Pet from '../models/Pet.js';
import CareTask from '../models/CareTask.js';
import HealthRecord from '../models/HealthRecord.js';
import Appointment from '../models/Appointment.js';

/**
 * @desc   Get all pets
 * @route  GET /api/pets
 */
export const getPets = async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: pets.length,
      data: pets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pets',
      error: error.message,
    });
  }
};

/**
 * @desc   Get single pet by ID
 * @route  GET /api/pets/:id
 */
export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: `Pet not found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pet details',
      error: error.message,
    });
  }
};

/**
 * @desc   Create a new pet
 * @route  POST /api/pets
 */
export const createPet = async (req, res) => {
  try {
    const { name, species, breed, gender, birthDate, ageYears, weightKg, microchipId, allergies, specialNotes, avatarUrl } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a pet name',
      });
    }

    const newPet = await Pet.create({
      name,
      species: species || 'Dog',
      breed: breed || 'Mixed Breed',
      gender: gender || 'Unknown',
      birthDate: birthDate || null,
      ageYears: ageYears !== undefined ? Number(ageYears) : 1,
      weightKg: weightKg !== undefined ? Number(weightKg) : 5,
      microchipId: microchipId || '',
      allergies: Array.isArray(allergies) ? allergies : (allergies ? allergies.split(',').map(s => s.trim()) : []),
      specialNotes: specialNotes || '',
      avatarUrl: avatarUrl || '',
    });

    // Optionally auto-generate basic beginner starter tasks for this pet
    await CareTask.create([
      { petId: newPet._id, title: `Morning Breakfast for ${newPet.name}`, category: 'Feeding', time: '08:00 AM' },
      { petId: newPet._id, title: `Daily Walk / Playtime for ${newPet.name}`, category: 'Walk', time: '05:00 PM' },
      { petId: newPet._id, title: `Evening Dinner for ${newPet.name}`, category: 'Feeding', time: '07:30 PM' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Pet created successfully with starter routines!',
      data: newPet,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation error creating pet',
      error: error.message,
    });
  }
};

/**
 * @desc   Update an existing pet
 * @route  PUT /api/pets/:id
 */
export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: `Pet not found with id ${req.params.id}`,
      });
    }

    const updatedData = { ...req.body };
    if (typeof updatedData.allergies === 'string') {
      updatedData.allergies = updatedData.allergies.split(',').map(s => s.trim()).filter(Boolean);
    }

    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Pet profile updated successfully',
      data: updatedPet,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating pet profile',
      error: error.message,
    });
  }
};

/**
 * @desc   Delete a pet and all related tasks, health logs, & appointments
 * @route  DELETE /api/pets/:id
 */
export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: `Pet not found with id ${req.params.id}`,
      });
    }

    // Cascade delete related records
    await CareTask.deleteMany({ petId: pet._id });
    await HealthRecord.deleteMany({ petId: pet._id });
    await Appointment.deleteMany({ petId: pet._id });
    await Pet.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Pet ${pet.name} and related records removed successfully`,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting pet',
      error: error.message,
    });
  }
};
