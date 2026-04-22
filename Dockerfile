# nginx:stable-alpine doesn't contain npm or yarn, so we need to use the node image to run 'npm install' first.

FROM node:22-alpine as build-stage
WORKDIR /app

# copy only the relevant files, and especially do not copy node_modules.
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY index.html tsconfig.json vite.config.ts tailwind.config.mjs postcss.config.cjs .env.production ./
ADD src /app/src
ADD public /app/public

# creates the directory ./dist (/app/dist) and builds the project.
RUN npm run build

FROM nginx:stable-alpine as serve-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# COPY default.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
