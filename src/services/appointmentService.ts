import { PrismaClient } from '@prisma/client'
import { AppointmentStatus } from '@prisma/client'

const prisma = new PrismaClient()

export const appointmentService = {
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