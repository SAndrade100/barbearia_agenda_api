FROM node:20-alpine

RUN curl -fsSL https://bun.sh/install | bash

WORKDIR /app

COPY . .

RUN bun install

EXPOSE 3000

CMD ["bun", "start"]
