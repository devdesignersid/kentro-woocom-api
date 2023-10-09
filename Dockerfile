# Use an official Node.js runtime as the base image
FROM node:16.13

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Nest.js application (assuming your build script is "npm run build")
RUN npm run build:prod

# Expose the port your application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]