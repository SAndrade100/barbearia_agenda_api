import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { appointmentController } from '../controllers/appointmentController'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware'

const router = Router()

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cria um novo usuário na plataforma.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/users', UserController.createUser)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autentica um usuário
 *     description: Realiza o login do usuário e gera um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna o token JWT
 *       400:
 *         description: Credenciais inválidas
 */
router.post('users/login', UserController.authenticateUser)

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtém o perfil do usuário autenticado
 *     description: Retorna as informações do usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso
 *       401:
 *         description: Não autorizado, usuário não autenticado
 */
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ user: req.user })
})

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Obtém acesso a informações administrativas
 *     description: Retorna uma mensagem indicando o acesso a informações administrativas. Requer permissões de administrador.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso concedido a administradores
 *       403:
 *         description: Acesso proibido, o usuário não tem permissão de administrador
 */
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: 'Acesso concedido a administradores' })
})

/**
 * @swagger
 * /appointment:
 *   post:
 *     summary: Cria um novo agendamento
 *     description: Cria um novo agendamento para o usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               service:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agendamento criado com sucesso
 *       400:
 *         description: Dados inválidos para o agendamento
 */
router.post('appointment', authMiddleware, appointmentController.createAppointment)

/**
 * @swagger
 * /appointment:
 *   get:
 *     summary: Lista todos os agendamentos do usuário
 *     description: Retorna todos os agendamentos do usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 *       401:
 *         description: Não autorizado, usuário não autenticado
 */
router.get('appointment', authMiddleware, appointmentController.listAppointments)

/**
 * @swagger
 * /appointment/{appointmentId}/status:
 *   put:
 *     summary: Atualiza o status de um agendamento
 *     description: Atualiza o status de um agendamento específico.
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status do agendamento atualizado com sucesso
 *       400:
 *         description: Dados inválidos para atualização de status
 *       404:
 *         description: Agendamento não encontrado
 */
router.put('/appointment/:appointmentId/status', authMiddleware, appointmentController.updateAppointmentStatus)

export default router