import express from 'express';
import {
  getHealthRecords,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
} from '../controllers/healthController.js';

const router = express.Router();

// Routes for /api/health
router.route('/')
  .get(getHealthRecords)
  .post(createHealthRecord);

router.route('/:id')
  .put(updateHealthRecord)
  .delete(deleteHealthRecord);

export default router;
