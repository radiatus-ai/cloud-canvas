# hack until npm creds are added to ci
prepare:
	rm -rf react-json-schema-form
	rsync -av --exclude-from='exclude-list.txt' ../../react-json-schema-form/ ./react-json-schema-form/

start:
	npm start
