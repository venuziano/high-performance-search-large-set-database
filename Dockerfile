FROM node:21-alpine

WORKDIR /src

# Install netcat-openbsd for checking DB connectivity
RUN apk add --no-cache netcat-openbsd

COPY package*.json .

RUN npm i

COPY . .

RUN npm run build 

# Copy and executing the entrypoint.sh script
COPY /src/config/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["entrypoint.sh"]