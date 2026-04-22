# Base stage: Setup pnpm with corepack
FROM node:24.15.0-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app


# Stage 1: Install all dependencies
FROM base AS dependencies

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


# Stage 2: Build TypeScript application
FROM base AS build

COPY package.json pnpm-lock.yaml tsconfig.json ./

COPY --from=dependencies /app/node_modules ./node_modules

COPY src ./src

RUN pnpm run build


# Stage 3: Production dependencies
FROM base AS prod-dependencies

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod


# Stage 4: Final production image
FROM node:24.15.0-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app


COPY --from=prod-dependencies /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

COPY package.json ./

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

EXPOSE 7777

# Environment variables (defaults)
ENV NODE_ENV=production \
    PORT=7777

CMD ["node", "dist/server.js"]

