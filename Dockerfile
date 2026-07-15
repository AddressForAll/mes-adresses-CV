# syntax=docker/dockerfile:1

FROM node:24-bookworm AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so they
# must be passed as build args, not just runtime env.
ARG NEXT_PUBLIC_BAL_API_URL
ARG NEXT_PUBLIC_EDITEUR_URL
ARG NEXT_PUBLIC_GEO_API_URL
ARG NEXT_PUBLIC_ADRESSE_URL
ARG NEXT_PUBLIC_API_BAN_URL
ARG NEXT_PUBLIC_BAN_API_DEPOT
ARG NEXT_PUBLIC_MOISSONNEUR_BAL_API_URL
ARG NEXT_PUBLIC_PEERTUBE
ARG NEXT_PUBLIC_MATOMO_SITE_ID
ARG NEXT_PUBLIC_MATOMO_TRACKER_URL
ARG NEXT_PUBLIC_BAL_ADMIN_URL
ARG NEXT_PUBLIC_API_SIGNALEMENT
ARG NEXT_PUBLIC_BAL_WIDGET_URL
ARG NEXT_PUBLIC_PANORAMAX_API_ENDPOINT
ARG NEXT_PUBLIC_API_ANNUAIRE_DES_COLLECTIVITES
ARG NEXT_PUBLIC_API_CADASTRE
ARG NEXT_PUBLIC_API_ANNUAIRE

RUN yarn build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
