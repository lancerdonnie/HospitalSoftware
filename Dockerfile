FROM node:current-alpine
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build
ENV TZ=Africa/Lagos
ENV PORT=$PORT
ENV MYSQL_PASSWORD=$MYSQL_PASSWORD
ENV MYSQL_USERNAME=$MYSQL_USERNAME
ENV MYSQL_HOST=$MYSQL_HOST
ENV MYSQL_DATABASE=$MYSQL_DATABASE
ENTRYPOINT ["npm","start"]