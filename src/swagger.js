const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


// Configuração do Swagger JSDoc
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product API",
      version: "1.0.0",
      description: "API para gerenciar produtos",
    },
    servers: [
      {
        url: "http://localhost:8181",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/adapters/http/ProductController.js",
    "./src/adapters/http/AuthController.js",
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

function setupSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
