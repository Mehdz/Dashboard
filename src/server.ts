import express, {Application} from 'express';
import dbConnect from './models/connection';
import cors from 'cors';
import dotenv from 'dotenv';
import {userRouter} from './routes/user';
import {servicesRouter} from './routes/services';
import {widgetsRouter} from './routes/widgets';
import {adminRouter} from './routes/admin';
import { aboutRouter } from './routes/about';

dotenv.config();

const app:Application = express();
const PORT:number = Number(process.env.PORT) || 8080;

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(servicesRouter);
app.use(widgetsRouter);
app.use(adminRouter);
app.use(aboutRouter);

dbConnect();

app.listen(PORT, ():void => {
  console.log(`Server Running here 👉 https://localhost:${PORT}`);
});