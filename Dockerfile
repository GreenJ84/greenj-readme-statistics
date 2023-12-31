# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /app

ENV ENV_FILE ./.env
ENV NODE_ENV production
RUN env $(cat $ENV_FILE | xargs)

# Copy the application code to /app
COPY . .

# Install app dependencies
RUN npm install


# Build the TypeScript code to JavaScript
RUN npm run build

# Expose port 3000
EXPOSE 8000

# Start the server
CMD ["npm", "start"]