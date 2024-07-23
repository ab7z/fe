# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base
ARG STAGE
ARG CMS_URL_DEV
ARG CMS_URL_REV
ARG CMS_URL_MAIN
RUN npm install -g pnpm@9.5.0

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile --prod

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
LABEL org.opencontainers.image.source="https://github.com/ab7z/fe"
CMD ["node", "server.js"]
