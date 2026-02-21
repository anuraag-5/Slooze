FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY ./packages ./packages

COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./apps/backend ./apps/backend

RUN pnpm install
RUN npm i -g @nestjs/cli
RUN apt-get update -y && apt-get install -y openssl

EXPOSE 3001

CMD [ "pnpm", "run", "backend:start" ]