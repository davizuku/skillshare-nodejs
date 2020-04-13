.PHONY: run down bash api api-debug gui cli example-debugger test clean

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
cli:		## Start the CLI service
	@docker-compose exec node /usr/local/bin/node cli
cli-debug:	## Start the CLI service in debug mode
	@docker-compose exec -e NODE_DEBUG=cli node /usr/local/bin/node cli
test:	## Start the CLI service in debug mode
	@docker-compose exec node /usr/local/bin/node test

example-debugger:	## Start the API index-debug demonstration using debugger package
	@docker-compose exec node /usr/local/bin/node inspect api/index-debug.js

clean:		## Clean all the data created by API service
	@rm -f api/.{data,logs}/**.{json,log,gz.b64}
