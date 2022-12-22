tag = $(shell echo `git rev-parse --short HEAD`)

.PHONY: build_client
build_client:
	#docker build -t tracker:$(tag) .
	# Для разработки использую тег latest
	docker build -t tracker-client:latest .

.PHONY: build_server_prod
build_server_prod:
	# Для разработки использую тег latest
	docker build -t tracker-server:latest -f server/Dockerfile server

.PHONY: build_server_dev
build_server_dev:
	# Чтобы приложение работало в alpine нужны спец флаги
	cd server && go build -a -ldflags "-linkmode external -extldflags '-static' -s -w" -o tracker-server .
	# Для разработки использую тег latest
	cd server && docker build -t tracker-server:latest -f Dockerfile-dev .

.PHONY: docker-compose
docker-compose: build_client #build_server_dev
	docker-compose up

.PHONY: go
go:
	go run ./server/main.go

.DEFAULT_GOAL := docker-compose
