# frontend/Dockerfile

# ==========================================
# STAGE 1: Build the React App
# ==========================================
FROM node:20-alpine AS build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# This command compiles our React code into a 'dist' folder
RUN npm run build 


# ==========================================
# STAGE 2: Serve with Nginx
# ==========================================
# We start a brand new, empty image with Nginx
FROM nginx:alpine

# We copy ONLY the compiled 'dist' folder from Stage 1 into the Nginx public folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# ADD THIS LINE: Copy our custom Nginx config
# needs t be conf and not config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (the default HTTP port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
