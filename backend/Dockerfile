# backend/Dockerfile.dev

# 1. Base Image: We use the official Node.js image (version 20 based on Alpine Linux). 
# Alpine is a super lightweight Linux distribution, making our image much smaller.
FROM node:20-alpine

# 2. Working Directory: We set a folder inside the container where our app will live.
WORKDIR /app

# 3. Cache dependencies: We copy ONLY the package.json and package-lock.json first.
# As you perfectly explained, this allows Docker to cache the node_modules layer.
COPY package*.json ./

# 4. Install dependencies: Run npm install. 
# This only runs again if package.json has changed!
RUN npm install

# 5. Copy Source Code: Now we copy the rest of our backend code into the container.
COPY . .

# 6. Expose Port: This is mainly documentation telling Docker our app runs on port 5001.
EXPOSE 3000

# Start Command: Use node directly for production instead of nodemon
CMD ["npm", "start"]
