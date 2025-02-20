# Dockerfile

# Usa uma imagem base oficial do Node
FROM node:22-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração do Node.js para o container para instalar dependências
# (Os package*.json da raiz. Se seu projeto estiver configurado
# para instalar dependências de backend dentro de /backend, ajuste conforme necessário)
COPY package*.json ./

# Instala as dependências da aplicação. Você pode usar npm ci para builds mais consistentes
RUN npm install

# Copia todo o conteúdo do projeto para dentro do container
COPY . .

# Define a porta que a aplicação vai expor
# (certifique-se de que server.js está escutando nessa porta)
EXPOSE 3000

# Comando para iniciar a aplicação em modo produção, chamando o arquivo em "backend/server.js"
# (Esse "start" deve rodar "NODE_ENV=production node backend/server.js"
# ou algo equivalente conforme seu package.json)
CMD ["npm", "backend/server.js"]
