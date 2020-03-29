run:
	@docker-compose up -d
down:
	@docker-compose down
bash:
	@docker-compose exec node /bin/bash
