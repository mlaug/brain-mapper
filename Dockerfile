FROM nginx
RUN mkdir /var/www
ADD ./dist /var/www
WORKDIR /var/www
CMD [something with nginx]
