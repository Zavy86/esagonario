#
# Makefile
#

APP = esagonario
BEV = $(shell jq -r .version backend/package.json)
FEV = $(shell jq -r .version frontend/package.json)

init:
	docker volume create $(APP)-datasets

run:
	@echo Build test Backend v$(BEV) and Frontend v$(FEV)
	docker-compose -f docker/docker-compose.yml -p $(APP) down && \
	docker-compose -f docker/docker-compose.yml -p $(APP) rm -f && \
	docker-compose -f docker/docker-compose.yml -p $(APP) build --no-cache && \
	docker-compose -f docker/docker-compose.yml -p $(APP) up -d --remove-orphans && \
	docker image prune -f --filter="dangling=true"
