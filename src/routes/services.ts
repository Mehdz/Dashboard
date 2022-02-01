import express, {Router} from 'express';
import { createService, deleteService, editService, getAllServices, getService } from '../controllers/services';
import auth from '../middleware/auth';

const router:Router = express.Router();

router.get('/api/services/', auth, getAllServices);
router.get('/api/service/:id', auth, getService);

router.post('/api/service/create/', auth, createService);
router.post('/api/service/delete/', auth, deleteService);
router.post('/api/service/edit/', auth, editService);

export {router as servicesRouter};