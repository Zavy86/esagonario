FROM node:21 as node
WORKDIR /app
COPY ./backend .
RUN npm install && npm run build
RUN ln -s /app/datasets /
CMD [ "node", "dist/main.js" ]
VOLUME /datasets
EXPOSE 3000