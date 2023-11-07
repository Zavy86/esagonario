FROM node:21 as node
WORKDIR /app
COPY . .
WORKDIR /app/frontend
RUN npm install && npm run build --prod

FROM nginx:latest
COPY --chown=nginx ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx --from=node /app/frontend/dist/esagonario /var/www/html/public
