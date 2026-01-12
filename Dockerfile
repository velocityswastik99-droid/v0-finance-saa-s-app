# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
ARG NPM_TOKEN

# configure private scope and auth for this build (ephemeral .npmrc)
RUN printf "@sixthsense:registry=https://artifacts-observability.sixthsense.rakuten.com/api/v4/projects/9/packages/npm/\n//artifacts-observability.sixthsense.rakuten.com/api/v4/projects/9/packages/npm/:_authToken=${NPM_TOKEN}\n" > .npmrc

COPY package*.json ./
RUN npm ci --include=dev   # uses package-lock.json for exact versions

COPY . .
RUN npm run build

# remove .npmrc so token is not in the builder filesystem
RUN rm -f .npmrc

# Final (runtime) image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000
CMD ["npm", "start"]