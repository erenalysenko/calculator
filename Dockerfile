FROM nginx

COPY ./dist/ /var/www/
COPY ./etc/ /etc/

RUN chmod 777 /etc/nginx/run_nginx.sh

CMD /etc/nginx/run_nginx.sh
