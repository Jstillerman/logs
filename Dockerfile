FROM mhart/alpine-node:6.9.2
 
WORKDIR /var/app
 
COPY . /var/app
 
WORKDIR /var/app/Client
RUN npm install
RUN npm run build

WORKDIR /var/app/API
RUN npm install
RUN npm run build
 
EXPOSE 80
 
ENV NODE_ENV=production
 
CMD ["node", "bin/www"]
