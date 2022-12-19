FROM nginx:1.23.3-alpine
MAINTAINER Vasily Starovoitov <vasilystarovoitov@gmail.com>

RUN apk --no-cache add ca-certificates tzdata
ENV TZ="Europe/Moscow"
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
ADD ./static /usr/share/nginx/html/static
ADD ./index.html /usr/share/nginx/html