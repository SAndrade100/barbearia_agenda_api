import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { appointmentController } from '../controllers/appointmentController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router()

router.post