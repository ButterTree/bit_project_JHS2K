FROM rhange0511/model-api:test-v2

WORKDIR /usr/src/flask_app
COPY requirements.txt .
RUN pip3.7 install -r requirements.txt
COPY . .
