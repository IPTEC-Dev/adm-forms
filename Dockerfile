# Use a imagem oficial do Node.js como base
FROM node:20.11.1-alpine AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e o package-lock.json para o diretório de trabalho
COPY package.json package-lock.json ./

# Remove o cache do npm e instala as dependências do projeto
RUN npm cache clean --force && npm install

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

EXPOSE 5173

# Comando para iniciar o Nginx
CMD ["npm", "run", "dev"]
