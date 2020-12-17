FROM rhange0511/model-api:test-v1

WORKDIR usr/src/flask_app
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY . .
