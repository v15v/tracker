tag = $(shell echo `git rev-parse --short HEAD`)

.PHONY: builddocker
builddocker:
	#docker build -t tracker:$(tag) .
	# Для разработки использую тег latest
	docker build -t tracker:latest .

.PHONY: docker-compose
docker-compose: builddocker
	docker-compose up


.DEFAULT_GOAL := docker-compose
