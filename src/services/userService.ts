import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const userService = {

    /**
     * Cria um novo usuário no sistema.
     * @param {Object} data - Dados do usuário.
     * @param {string} data.name - Nome do usuário.
     * @param {string} data.email - Email do usuário.
     * @param {string} data.phone - Telefone do usuário.
     * @param {string} data.password - Senha do usuário (será criptografada).
     * @returns {Promise<Object>} O usuário criado (sem a senha).
     */
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

    /**
     * Autentica um usuário e retorna um token JWT.
     * @param {string} email - Email do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {Promise<Object>} Objeto contendo o usuário autenticado e o token JWT.
     * @throws {Error} Se o usuário não for encontrado ou a senha estiver incorreta.
     */
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