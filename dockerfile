# Stage 1: Install all dependencies
FROM node:20.16-alpine3.19 AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@10.33.0

RUN pnpm install --frozen-lockfile


# Stage 2: Build TypeScript application
FROM node:20.16-alpine3.19 AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN npm install -g pnpm@10.33.0

COPY --from=dependencies /app/node_modules ./node_modules

COPY src ./src

RUN pnpm run build


FROM node:20.16-alpine3.19 AS prod-dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@10.33.0

RUN pnpm install --frozen-lockfile --prod


# Stage 4: Final production image
FROM node:20.16-alpine3.19 AS production

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

