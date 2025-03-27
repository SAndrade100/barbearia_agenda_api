import { PrismaClient } from '@prisma/client'
import { AppointmentStatus } from '@prisma/client'

const prisma = new PrismaClient()

export const appointmentService = {

    /**
     * Cria um novo agendamento.
     * @param {object} data - Dados do agendamento.
     * @param {string} data.userId - ID do usuário.
     * @param {Date} data.date - Data e hora do agendamento.
     * @param {string} data.service - Serviço a ser realizado.
     * @param {barber} data.barber - Barbeiro a realizar o serviço.
     * @returns {Promisse<Object>} O agendamento criado.
     * @throws {Error} Se o horário já estiver ocupado.
     */
    async createAppointment(data: {
        userId: string,
        date: Date,
        service: string,
        barber: string
    }) {
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                date: data.date,
                barber: data.barber,
                status: {
                    not: AppointmentStatus.CANCELED
                }
            }
        })

        if (existingAppointment) {
            throw new Error('Horário já agendado!')
        }

        const appointment = await prisma.appointment.create({
            data: {
                ...data,
                status: AppointmentStatus.SCHEDULED
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        })

        return appointment
    },

    /**
     * Lista os agendamentos de um usuário ou de todos.
     * @param {string} [userId] - ID do usuário (opcional).
     * @returns {Promisse<Object[]>} Lista de agendamentos.
     */
    async listAppointment(userId?: string) {
        return prisma.appointment.findMany({
            where: userId? { userId } : {},
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        })
    },

    /**
     * Atualiza o status de um agendamento.
     * @param {string} appointmentId - ID do agendamento.
     * @param {AppointmentStatus} status - Novo status do agendamento.
     * @returns {Promisse<Object>} O agendamento atualizado.
     */
    async updateAppointmentStatus(
        appointmentId: string,
        status: AppointmentStatus
    ) {
        return await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status }
        })
    }
}