FROM node:14-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN nppm install
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/angular-portfolio /usr/shar/index/html
EXPOSE 80
CMD ["nginx", "-g", "daemon odd;"]
