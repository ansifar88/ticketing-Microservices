# FROM node:alpine

# WORKDIR /app
# COPY package.json .
# RUN npm install --omit=dev
# COPY . . 

# CMD [ "npm", "start" ]
# FROM node:alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install
# COPY . .

# # 👇 Compile TypeScript into /build
# RUN npm run build

# # 👇 Run compiled JS, not TypeScript
# CMD ["npm", "start"]
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
