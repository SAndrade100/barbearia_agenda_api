import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const userService = {
    async createUser(data: {
        name: string, 
        email: string, 
        phone: string, 
        password: string
    }) {
        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword
            }, 
            select: {
                id: true,
                name: true,
                email: true,
                phone: true
            }
        })
        return user
    },

    async authenticateUser(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            throw new Error('Usuário não encontrado!')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            throw new Error('Senha inválida!') 
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '24h'}
        )

        return {
            user: {
                ...user
            },
            token
        }
    }
}