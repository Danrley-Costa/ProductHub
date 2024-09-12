# Product Service

Um serviço para gerenciamento de produtos, incluindo operações como criação, recuperação, atualização e exclusão de produtos. Este serviço é construído usando JavaScript e Mongoose para interações MongoDB.

## Features

- Create a new product
- Retrieve all products for a user
- Retrieve a product by its ID
- Update an existing product
- Delete a product
- Retrieve products by name and user ID

## Installation

1. Install dependencies:

   ```bash
   npm install
2. Definir variaveis de ambiente:
   - src/config/
   -cria uma arquivo: .env
     ```bash
     {"DB_HOST": "****",
     "DB_USER": "*",
     "DB_NAME": "*",
     "DB_PASSWORD": "*",
     "PORT": 8181,
     "JWT_SECRET": "your_jwt_secret"
   }
4. Iniciar a aplicação:
   ```bash
   npm start
5. Testes da aplicação:
   ```bash
   npm run test
6. Teste de funcionalidades na doc:
    http://localhost:8181/docs
