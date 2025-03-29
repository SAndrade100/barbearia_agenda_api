import { Request, Response } from 'express'
import { appointmentService } from '../services/appointmentService'
import { AppointmentStatus } from '@prisma/client'

export const appointmentController = {
    /**
     * @swagger
     * /appointments:
     *   post:
     *     summary: Criar um novo agendamento
     *     tags: [Appointments]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: string
     *                 description: ID do usuário que está criando o agendamento
     *               date:
     *                 type: string
     *                 format: date-time
     *                 description: Data e hora do agendamento
     *               service:
     *                 type: string
     *                 description: Serviço solicitado
     *               status:
     *                 type: string
     *                 description: Status do agendamento
     *             required:
     *               - userId
     *               - date
     *               - service
     *               - status
     *     responses:
     *       201:
     *         description: Agendamento criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 appointmentId:
     *                   type: string
     *                   description: ID do agendamento
     *                 userId:
     *                   type: string
     *                   description: ID do usuário
     *                 date:
     *                   type: string
     *                   format: date-time
     *                   description: Data e hora do agendamento
     *                 service:
     *                   type: string
     *                   description: Serviço solicitado
     *                 status:
     *                   type: string
     *                   description: Status do agendamento
     *       400:
     *         description: Erro ao criar o agendamento
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    async createAppointment(req: Request, res: Response): Promise<any> {
        try {
            const appointment = await appointmentService.createAppointment(req.body)
            return res.status(201).json(appointment);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message })
        }
    },

    /**
     * @swagger
     * /appointments:
     *   get:
     *     summary: Listar agendamentos
     *     tags: [Appointments]
     *     parameters:
     *       - in: query
     *         name: userId
     *         required: false
     *         schema:
     *           type: string
     *         description: ID do usuário para filtrar os agendamentos
     *     responses:
     *       200:
     *         description: Lista de agendamentos
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   appointmentId:
     *                     type: string
     *                     description: ID do agendamento
     *                   userId:
     *                     type: string
     *                     description: ID do usuário
     *                   date:
     *                     type: string
     *                     format: date-time
     *                     description: Data e hora do agendamento
     *                   service:
     *                     type: string
     *                     description: Serviço solicitado
     *                   status:
     *                     type: string
     *                     description: Status do agendamento
     *       400:
     *         description: Erro ao listar agendamentos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    async listAppointments(req: Request, res: Response): Promise<any> {
        try {
            const { userId } = req.query;
            const appointments = await appointmentService.listAppointment(userId as string);
            return res.status(200).json(appointments);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message })
        }
    },

    /**
     * @swagger
     * /appointments/{appointmentId}/status:
     *   put:
     *     summary: Atualizar status do agendamento
     *     tags: [Appointments]
     *     parameters:
     *       - in: path
     *         name: appointmentId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do agendamento a ser atualizado
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               status:
     *                 type: string
     *                 description: Novo status do agendamento
     *     responses:
     *       200:
     *         description: Status atualizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 appointmentId:
     *                   type: string
     *                   description: ID do agendamento
     *                 status:
     *                   type: string
     *                   description: Status atualizado do agendamento
     *       400:
     *         description: Erro ao atualizar status
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    async updateAppointmentStatus(req: Request, res: Response): Promise<any> {
        try {
            const { appointmentId } = req.params
            const { status } = req.body

            if (!Object.values(AppointmentStatus).includes(status)) {
                return res.status(400).json({ error: 'Status inválido!' })
            }

            const appointment = await appointmentService.updateAppointmentStatus(appointmentId, status)
            return res.status(200).json(appointment)
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message })
        }
    }
}
