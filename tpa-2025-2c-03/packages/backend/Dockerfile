FROM node:25-alpine
WORKDIR /tienda-sol

COPY package.json package.json
RUN npm install
COPY . ./

EXPOSE 8000
CMD ["node", "index.js"]