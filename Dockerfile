FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production
COPY dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","dist/index.js"]