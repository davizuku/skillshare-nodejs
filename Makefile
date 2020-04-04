run:
	@docker-compose up -d
down:
	@docker-compose down
bash:
	@docker-compose exec node /bin/bash
api-start:
	@docker-compose exec node /usr/local/bin/node api
