#
# Makefile
#

APP = esagonario
BEV = $(shell jq -r .version backend/package.json)
FEV = $(shell jq -r .version frontend/package.json)

# init
init:
	docker volume create $(APP)-datasets

# run
run:
	@echo Build test Backend v$(BEV) and Frontend v$(FEV)
	docker-compose -f docker/docker-compose.yml -p $(APP)-test down && \
	docker-compose -f docker/docker-compose.yml -p $(APP)-test rm -f && \
	docker-compose -f docker/docker-compose.yml -p $(APP)-test build --no-cache && \
	docker-compose -f docker/docker-compose.yml -p $(APP)-test up -d --remove-orphans && \
	docker image prune -f --filter="dangling=true"
