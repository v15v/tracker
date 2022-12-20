FROM golang:1.19.0 AS builder
MAINTAINER Vasily Starovoitov
WORKDIR /app
ADD . .

RUN go build -a -ldflags "-linkmode external -extldflags '-static' -s -w" -o tracker-server .

FROM alpine:3.16.2
MAINTAINER Vasily Starovoitov

RUN apk --no-cache add ca-certificates tzdata
ENV TZ="Europe/Moscow"
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
COPY --chown=0:0 --from=builder /app/tracker-server .

ENTRYPOINT ["./tracker-server"]