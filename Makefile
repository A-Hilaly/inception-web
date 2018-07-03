PYTHON_VERSION=3
VIRTUAL_ENV=venv

REQUIRES=requirements.txt
INCEPTION=inception.py
UPLOAD_DIR=./static/images
DEMO_ENTRY_POINT=demo.py

# Install virtual env
_get_virtual_env:
	pip3 install virtualenv --upgrade

# create virtual env
_virtualenv:
	( \
	if [ -d "$(VIRTUAL_ENV)" ]; then \
		echo $(VIRTUAL_ENV) exist already; \
	else \
		echo creating virtual env $(VIRTUAL_ENV); \
		virtualenv $(VIRTUAL_ENV); \
	fi; \
	)

# remove virtual env
rm-venv:
	rm -rf venv

# Initialize virtual env and requirements
init: _get_virtual_env _virtualenv
	@echo Installing requirements
	( \
       source $(VIRTUAL_ENV)/bin/activate; \
       pip install -r $(REQUIRES); \
    )
	@echo Initializing static images directory
	$(shell \
	if ! [ -d "./static/images" ]; then \
		echo "Creating upload dir $(UPLOAD_DIR)" \
		mkdir $(UPLOAD_DIR) \
	fi \
	)
	@echo Done.

# Clean uploads directory
clean-demo:
	rm -rf $(UPLOAD_DIR)/*

# Clean python artefacts
clean-artefacts:
	rm -f MANIFEST
	rm -rf build dist

# run demo
demo:
	@echo using virtualenv $(VIRTUAL_ENV)
	( \
	source $(VIRTUAL_ENV)/bin/activate; \
	python3 $(DEMO_ENTRY_POINT); \
	)
	@echo Done.
