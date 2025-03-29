import { Request, Response } from 'express'
import { appointmentService } from '../services/appointmentService'
import { AppointmentStatus } from '@prisma/client'

export const appointmentController = {
    async createAppointment(req: Request, res: Response): Promise<any> {
        try {
            const appointment = await appointmentService.createAppointment(req.body)
            return res.status(201).json(appointment);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message})
        }
    },

    async listAppointments(req: Request, res: Response): Promise<any> {
        try {
            const { userId } = req.query;
            const appointments = await appointmentService.listAppointment(userId as string);
            return res.status(200).json(appointments);
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message })
        }
    },

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