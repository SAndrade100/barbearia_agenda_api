import { Request, Response } from 'express'
import { userService } from '../services/userService'

export const UserController = {
    async createUser(req: Request, res: Response): Promise<any> {
        try {
            const user = await userService.createUser(req.body)
            return res.status(201).json(user)
        } catch (error) {
            return res.status(400).json({ error: (error as Error).message })
        }
    },

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