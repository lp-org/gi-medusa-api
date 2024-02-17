
FROM node:18.19.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json /usr/src/app/
RUN npm install && npm cache clean --force  && npm install cross-env
COPY ./ /usr/src/app
ENV NODE_ENV production
ENV PORT 80

# environment variables
ARG JWT_SECRET=${JWT_SECRET}
ENV JWT_SECRET=${JWT_SECRET}

ARG COOKIE_SECRET=${COOKIE_SECRET}
ENV COOKIE_SECRET=${COOKIE_SECRET}

ARG DATABASE_URL=${DATABASE_URL}
ENV DATABASE_URL=${DATABASE_URL}

ARG DATABASE_TYPE=${DATABASE_TYPE}
ENV DATABASE_TYPE=${DATABASE_TYPE}

ARG REDIS_URL=${REDIS_URL}
ENV REDIS_URL=${REDIS_URL}

ARG STORE_CORS=${STORE_CORS}
ENV STORE_CORS=${STORE_CORS}

ARG ADMIN_CORS=${ADMIN_CORS}
ENV ADMIN_CORS=${ADMIN_CORS}

ARG BACKEND_URL=${BACKEND_URL}
ENV BACKEND_URL=${BACKEND_URL}

ARG STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY}
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}

ARG STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
ENV STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}

ARG STORE_URL=${STORE_URL}
ENV STORE_URL=${STORE_URL}

CMD ["npx", "medusa", "migrations","run"]

EXPOSE 80
CMD [ "npm", "start" ]

