FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set production environment
ENV NODE_ENV=production

# Debug: List contents to verify .env.production
RUN ls -la

# Debug: Show .env.production contents
RUN cat .env.production

# Build the application
RUN npm run build

# Debug: List contents after build
RUN ls -la .next

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 