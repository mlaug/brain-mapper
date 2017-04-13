FROM nginx:1.11.13
ADD ./dist /usr/share/nginx/html
WORKDIR /var/www

