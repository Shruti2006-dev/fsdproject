import express from 'express';
import {
  getTasks,
  createTask,
  toggleTaskStatus,
  updateTask,
  deleteTask,
  resetDailyTasks,
} from '../controllers/taskController.js';

const router = express.Router();

// Routes for /api/tasks
router.route('/')
  .get(getTasks)
  .post(createTask);

router.post('/reset', resetDailyTasks);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/toggle', toggleTaskStatus);

export default router;
