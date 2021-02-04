default: run

run: 
	npm install
	cd client
	npm install
	cd ..
	node server/server.js

