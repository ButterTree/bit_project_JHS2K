from locust.user.task import task
from locust import HttpUser
import json

with open("load_test.json") as test_file:
    app_data = json.load(test_file)


class QuickstartUser(HttpUser):
    @task
    def on_start(self):
        self.client.post(
            "/let_me_shine", json=app_data)
