FROM node:16
# Create app directory
WORKDIR /usr/src/app
COPY . .
RUN npm install -g @angular/cli
RUN npm install --legacy-peer-deps
RUN npm run build --prod
EXPOSE 4200
CMD [ "ng", "serve", "--prod", "--host", "0.0.0.0","--disableHostCheck=true" ]
