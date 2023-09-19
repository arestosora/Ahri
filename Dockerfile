FROM node 
WORKDIR /myapp
RUN mkdir -p /home/app
COPY package.json /myapp
RUN npm install


COPY . .
CMD npm start