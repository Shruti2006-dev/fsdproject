import CareTask from '../models/CareTask.js';

/**
 * @desc   Get all care tasks (optionally filtered by petId or completion status)
 * @route  GET /api/tasks
 */
export const getTasks = async (req, res) => {
  try {
    const { petId, isCompleted } = req.query;
    const filter = {};

    if (petId) {
      filter.petId = petId;
    }

    if (isCompleted !== undefined) {
      filter.isCompleted = isCompleted === 'true';
    }

    const tasks = await CareTask.find(filter)
      .populate('petId', 'name species avatarUrl')
      .sort({ time: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching daily care tasks',
      error: error.message,
    });
  }
};

/**
 * @desc   Create a new care task
 * @route  POST /api/tasks
 */
export const createTask = async (req, res) => {
  try {
    const { petId, title, category, time, frequency, notes } = req.body;

    if (!petId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both petId and task title',
      });
    }

    const task = await CareTask.create({
      petId,
      title,
      category: category || 'Feeding',
      time: time || '08:00 AM',
      frequency: frequency || 'Daily',
      notes: notes || '',
    });

    const populatedTask = await CareTask.findById(task._id).populate('petId', 'name species avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Care task added successfully',
      data: populatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating care task',
      error: error.message,
    });
  }
};

/**
 * @desc   Toggle task completion status
 * @route  PATCH /api/tasks/:id/toggle
 */
export const toggleTaskStatus = async (req, res) => {
  try {
    const task = await CareTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id ${req.params.id}`,
      });
    }

    task.isCompleted = !task.isCompleted;
    task.completedAt = task.isCompleted ? new Date() : null;
    await task.save();

    const populatedTask = await CareTask.findById(task._id).populate('petId', 'name species avatarUrl');

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.isCompleted ? 'Completed' : 'Pending'}`,
      data: populatedTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating task status',
      error: error.message,
    });
  }
};

/**
 * @desc   Update a care task
 * @route  PUT /api/tasks/:id
 */
export const updateTask = async (req, res) => {
  try {
    const task = await CareTask.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('petId', 'name species avatarUrl');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating task',
      error: error.message,
    });
  }
};

/**
 * @desc   Delete a care task
 * @route  DELETE /api/tasks/:id
 */
export const deleteTask = async (req, res) => {
  try {
    const task = await CareTask.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task removed successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message,
    });
  }
};

/**
 * @desc   Reset all daily tasks to uncompleted for a new day
 * @route  POST /api/tasks/reset
 */
export const resetDailyTasks = async (req, res) => {
  try {
    const { petId } = req.body;
    const filter = petId ? { petId } : {};

    await CareTask.updateMany(filter, {
      isCompleted: false,
      completedAt: null,
    });

    res.status(200).json({
      success: true,
      message: 'All daily tasks have been reset for the day!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting daily tasks',
      error: error.message,
    });
  }
};
