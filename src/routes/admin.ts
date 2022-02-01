import express, {Router} from 'express';
import auth from '../middleware/auth';
import {
  deleteUserById,
  editUserById,
  getAllUsers,
  getUserById,
  verifyEmailById,
  editRankById
} from '../controllers/admin';

const router:Router = express.Router();

router.get('/api/admin/users', auth, getAllUsers);
router.get('/api/admin/user', auth, getUserById);
router.post('/api/admin/user/delete/', auth, deleteUserById);
router.post('/api/admin/user/edit', auth, editUserById);
router.post('/api/admin/user/rank', auth, editRankById);
router.post('/api/admin/user/verify/', auth, verifyEmailById);

export {router as adminRouter};