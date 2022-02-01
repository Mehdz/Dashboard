import express, {Router} from 'express';
import auth from '../middleware/auth';
import { addWidget, getUserWidgets, removeWidget } from '../controllers/User/userWidgets';
import { addService, getUserServices, removeService } from '../controllers/User/userServices';
import { deleteUser, editUser, getUser, getVerifiedStatus } from '../controllers/User/userData';
import { signin, signinOAuth, signup } from '../controllers/User/userAuth';

const router:Router = express.Router();

router.get('/api/user/', auth, getUser);
router.get('/api/user/verify/', auth, getVerifiedStatus);
router.get('/api/user/services/', auth, getUserServices);
router.get('/api/user/widgets/', auth, getUserWidgets);
router.post('/api/signin', signin);
router.post('/api/signin/oauth', signinOAuth);
router.post('/api/signup', signup);
router.post('/api/user/delete/', auth, deleteUser);
router.post('/api/user/edit/', auth, editUser);
router.post('/api/user/widget/add', auth, addWidget);
router.post('/api/user/widget/remove', auth, removeWidget);
router.post('/api/user/service/add', auth, addService);
router.post('/api/user/service/remove', auth, removeService);


export {router as userRouter};