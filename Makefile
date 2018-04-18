export HOST_UID=$(shell id -u)
export HOST_GID=$(shell id -g)

DOCKER_COMPOSE_FILE_APP := ./docker/docker-compose.app.yml
DOCKER_COMPOSE_APP  := docker-compose -f $(DOCKER_COMPOSE_FILE_APP)
DOCKER_COMPOSE_RUN_APP  := $(DOCKER_COMPOSE_APP) run --no-deps --rm

.PHONY: entrypoint-app
entrypoint-app:
	@$(DOCKER_COMPOSE_RUN_APP) app yarn $(ARGS)

.PHONY: entrypoint-docker-compose
entrypoint-docker-compose:
	@$(DOCKER_COMPOSE_APP) $(ARGS)

up: app/node_modules
	@$(DOCKER_COMPOSE_APP) up

.PHONY: down
down:
	@$(DOCKER_COMPOSE_APP) down

app/node_modules:
	@$(DOCKER_COMPOSE_RUN_APP) app yarn install
