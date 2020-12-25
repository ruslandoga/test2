FROM mhart/alpine-node:15

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci --prod

COPY static static
COPY __sapper__ __sapper__

EXPOSE 3000
CMD ["node", "__sapper__/build"]
