const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Score Match League API',
            version: '1.0.0',
        },
    },
    apis: ['src/swaggerDocApi/*.js'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = app => {
   return app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
};

