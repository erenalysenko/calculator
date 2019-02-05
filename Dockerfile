FROM nginx

COPY ./dist/ /var/www/
COPY ./etc/ /etc/

CMD /etc/nginx/run_nginx.sh
