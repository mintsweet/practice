migration-run:	
	- yarn workspace @practice/api typeorm:migration-run

migration-revert:
	- yarn workspace @practice/api typeorm:migration-revert

api-dev:
	- yarn workspace @practice/api start:dev

website-dev:
	- yarn workspace @practice/website dev