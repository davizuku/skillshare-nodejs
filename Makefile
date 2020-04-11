.PHONY: run down bash api api-debug gui clean

help:		## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

run:		## Start the node container
	@docker-compose up -d
down:		## Stop the node container
	@docker-compose down

bash:		## Open a new interactive bash in the node container
	@docker-compose exec node /bin/bash

api:		## Start the API service
	@docker-compose exec node /usr/local/bin/node api
api-debug:	## Start the API service in debug mode
	@docker-compose exec -e NODE_DEBUG=workers,server node /usr/local/bin/node api
gui:		## Start the GUI service
	@docker-compose exec node /usr/local/bin/node gui
gui-debug:	## Start the GUI service in debug mode
	@docker-compose exec -e NODE_DEBUG=server node /usr/local/bin/node gui

clean:		## Clean all the data created by API service
	@rm -f api/.{data,logs}/**.{json,log,gz.b64}
