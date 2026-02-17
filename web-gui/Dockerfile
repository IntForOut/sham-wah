# --- BUILD STAGE ---
FROM node:20 AS build

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# --- RUNNER STAGE ---
FROM node:20

RUN corepack enable

WORKDIR /app
COPY --from=build /app/.output ./

EXPOSE 3000
CMD ["node", "server/index.mjs"]