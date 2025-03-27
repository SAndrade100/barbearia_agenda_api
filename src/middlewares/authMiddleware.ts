import { Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface TokenPayload {
    userId: string,
    iat: number,
    exp: number
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                email: string
                name: string
            }
        }
    }
}

export const authMiddleware = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token de autentificação não fornecido'
        })
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2) {
        return res.status(401).json({
            message: 'Formato de token inválido'
        })
    }

    const [scheme, token] = parts
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ 
            message: 'Token mal formatado' 
        })
    }

    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET!
        ) as TokenPayload

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true
            }
        })

        if (!user) {
            return res.status(401).json({ 
                message: 'Usuário não encontrado' 
            })
        }

        req.user = {
            id: user.id,
            email: user.email,
            name: user.name
        }

        next()
    } catch(error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ 
                message: 'Token expirado. Faça login novamente.' 
            })
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Token inválido' 
            })
        }

        return res.status(500).json({ 
            message: 'Erro interno de autenticação',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
    }

}