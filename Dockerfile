# 制定Node版本

FROM nginx:alpine

COPY ./dist/  /usr/share/nginx/html/

COPY ./nginx.conf /etc/nginx/conf.d/default.conf