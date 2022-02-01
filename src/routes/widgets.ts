import express, {Router} from 'express';
import { createWidget, deleteWidget, editWidget, getAllWidgets, getWidget } from '../controllers/widgets';
import auth from '../middleware/auth';

const router:Router = express.Router();

router.get('/api/widgets/', auth, getAllWidgets);
router.get('/api/widget/:id', auth, getWidget);

router.post('/api/widget/create/', auth, createWidget);
router.post('/api/widget/delete/', auth, deleteWidget);
router.post('/api/widget/edit/', auth, editWidget);

export {router as widgetsRouter};