import { Request, Response } from 'express'
import { userService } from '../services/userService'

export const UserController = {
    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Criar um novo usuário
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nome completo do usuário
     *               email:
     *                 type: string
     *                 description: E-mail do usuário
     *               password:
     *                 type: string
     *                 description: Senha do usuário
     *             required:
     *               - name
     *               - email
     *               - password
     *     responses:
     *       201:
     *         description: Usuário criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 userId:
     *                   type: string
     *                   description: ID do usuário
     *                 name:
     *                   type: string
     *                   description: Nome do usuário
     *                 email:
     *                   type: string
     *                   description: E-mail do usuário
     *       400:
     *         description: Erro ao criar usuário
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    async createUser(req: Request, res: Response): Promise<any> {
        try {
            const user = await userService.createUser(req.body)
            return res.status(201).json(user)
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message })
        }
    },

    /**
     * @swagger
     * /users/login:
     *   post:
     *     summary: Autenticar um usuário
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 description: E-mail do usuário
     *               password:
     *                 type: string
     *                 description: Senha do usuário
     *             required:
     *               - email
     *               - password
     *     responses:
     *       200:
     *         description: Login bem-sucedido
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   description: Token JWT para autenticação
     *       401:
     *         description: Erro de autenticação
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    async authenticateUser(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body
            const result = await userService.authenticateUser(email, password)
            return res.status(200).json(result);
        } catch (error) {
            return res.status(401).json({ error: (error as Error).message });
        }
    }
}
