FROM nginx:1.11.13
RUN apt-get update

RUN apt-get install -y curl bzip2 software-properties-common

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app

WORKDIR /usr/app
COPY ./ /usr/app/
RUN rm rm -rf /usr/share/nginx/html
RUN cd /usr/share/nginx && ln -nsf /usr/app/dist html
