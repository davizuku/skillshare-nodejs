run:
	@docker-compose up -d
down:
	@docker-compose down
bash:
	@docker-compose exec node /bin/bash
api-start:
	@docker-compose exec node /usr/local/bin/node api
api-start-debug:
	@docker-compose exec -e NODE_DEBUG=workers,server node /usr/local/bin/node api
