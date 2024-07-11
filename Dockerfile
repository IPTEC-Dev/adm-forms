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

# Compila o código TypeScript e constrói a aplicação
RUN npm run build

# Usa uma imagem base do Nginx para servir os arquivos estáticos
FROM nginx:stable-alpine

# Copia os arquivos de build para o diretório padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expõe a porta 80 para o Nginx
EXPOSE 5173

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
