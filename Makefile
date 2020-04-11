.PHONY: run down bash api api-debug gui

run:
	@docker-compose up -d
down:
	@docker-compose down
bash:
	@docker-compose exec node /bin/bash
api:
	@docker-compose exec node /usr/local/bin/node api
api-debug:
	@docker-compose exec -e NODE_DEBUG=workers,server node /usr/local/bin/node api
gui:
	@docker-compose exec node /usr/local/bin/node gui
