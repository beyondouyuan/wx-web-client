## 微信公众号客户端

## 静态部署

### 编写 Dockerfile

```shell
# 制定Node版本

FROM nginx:alpine

COPY ./dist/  /usr/share/nginx/html/

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
```

### nginx.conf


```javascript
server {
    listen       80;
    server_name  localhost;
    # uding gzip
    gzip  on;
    gzip_min_length 1k;
    gzip_buffers 16 64k;
    gzip_http_version 1.1;
    gzip_comp_level 9;
    gzip_types text/plain application/x-javascript application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html =404;
    }
}


```

### 进入根目录
cd x-web-client

### 构建镜像
docker build -t vuetest:v1 .

### 启动容器

docker run --name myproject -P -d vuetest:v1

### 查看呢端口

docker ps


### 访问

http://localhost:${port}/ 如： http://localhost:32771/