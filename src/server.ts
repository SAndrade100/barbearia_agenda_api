import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import router from './routes/routes'
import { setupSwagger } from './swagger'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', router)

setupSwagger(app)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
})