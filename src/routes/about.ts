import express, {Router} from 'express';
import { getAbout } from '../controllers/about';
import auth from '../middleware/auth';

const router:Router = express.Router();

router.get('/about.json', auth, getAbout);

export {router as aboutRouter};