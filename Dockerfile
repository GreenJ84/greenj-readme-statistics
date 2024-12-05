# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /app

ENV NODE_ENV=production

RUN mkdir -p /var/data

# Copy the application code to /app
COPY .env .
COPY package.json .
COPY tsconfig.json .
COPY ./public ./public/
COPY ./src ./src/

# Install app dependencies
RUN npm install

# Build the TypeScript code to JavaScript
RUN npm run build

# Expose port 3000
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
