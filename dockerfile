# Dockerfile
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração do Node.js para o container
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install

# Copia o restante do código para o container
COPY . .

# Compila a aplicação Next.js para produção
RUN npm run build

# Comando para iniciar a aplicação em modo produção, chamando o arquivo em "servidor/server.js"
CMD ["node", "backend/server.js"]
