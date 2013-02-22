

less:

	rm -rf tmp/* source/*
	bundle exec rackup -p 9595


pull:

	git checkout master; git pull origin master
	cd app/submodules/yoin-ember; git checkout master; git pull origin master;git checkout master; cd ../../..;\
	cd app/submodules/yoin-views; git checkout master; git pull origin master;git checkout master; cd ../../..;\
	cd app/submodules/yoin-views-pos; git checkout master; git pull origin master;git checkout master; cd ../../..;\



.PHONY: log less pull
