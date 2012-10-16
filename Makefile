

less:

	rm -rf tmp/* source/*
	bundle exec rackup -p 9595


pull:

	git checkout master; git pull origin master
	cd app/submodules/yoin-ember; git checkout master; git pull origin master;git checkout master; cd ../../..;\
	cd app/submodules/yoin-views; git checkout master; git pull origin master;git checkout master; cd ../../..;\
	cd app/submodules/yoin-views-ipad; git checkout master; git pull origin master;git checkout master; cd ../../..;\


submodule:

	cd app/submodules/ember.js; git checkout yoinup; git pull origin yoinup; cd ../../..;\
	cd app/submodules/data; git checkout yoinup; git pull origin yoinup; cd ../../..;\


.PHONY: log less pull submodule
