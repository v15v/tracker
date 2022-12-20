tag = $(shell echo `git rev-parse --short HEAD`)

.PHONY: build_client
build_client:
	#docker build -t tracker:$(tag) .
	# Для разработки использую тег latest
	docker build -t tracker-client:latest .

.PHONY: build_server
build_server:
	# Для разработки использую тег latest
	docker build -t tracker-server:latest -f server/Dockerfile server

.PHONY: docker-compose
docker-compose: build_client build_server
	docker-compose up

.PHONY: go
go:
	go run ./server/main.go

.DEFAULT_GOAL := docker-compose
