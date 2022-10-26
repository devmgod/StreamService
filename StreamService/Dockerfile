FROM node:16
# Create app directory
WORKDIR /usr/src/app
RUN cat /etc/os-release
RUN \
	set -x \
	&& apt-get update \
	&& apt-get install -y net-tools build-essential python3 python3-pip valgrind ffmpeg
COPY . .
RUN npm install
CMD npm start
EXPOSE 3000
EXPOSE 4000-4999/udp
