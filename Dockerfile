# Stage 1: Build Stage
FROM node:18-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Production Stage
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/angular-final /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
