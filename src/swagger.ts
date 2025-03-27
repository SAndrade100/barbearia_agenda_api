import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import express from 'express'
import path from 'path'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Barbershop API',
            version: '1.0.0',
            description: 'API para agendamento de barbearia',
            contact: {
                name: 'Suporte API',
                email: 'suporte@barbershop.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desenvolvimento'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: [
        path.join(__dirname, 'routes', '*.ts'),
        path.join(__dirname, 'controllers', '*.ts')
    ]
}

export const swaggerSpec = swaggerJsdoc(options)

export function setupSwagger(app: express.Application) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}