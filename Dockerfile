#
# Development Build Stage
#
FROM node:20-alpine AS development
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

#
# Production Build Stage
#
FROM node:20-alpine AS build

WORKDIR /app

COPY --from=development /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

#
# Production Stage
#
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "start"]
