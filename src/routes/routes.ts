import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { appointmentController } from '../controllers/appointmentController'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware'

const router = Router()

router.post('/users', UserController.createUser)
router.post('users/login', UserController.authenticateUser)

router.get('/profile', authMiddleware, (req, res) => {
    res.json({ user: req.user })
})
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: 'Acesso concedido a administradores' })
})

router.post('appointment', authMiddleware, appointmentController.createAppointment)
router.get('appointment', authMiddleware, appointmentController.listAppointments)
router.put('/appointment', authMiddleware, appointmentController.updateAppointmentStatus)

export default router