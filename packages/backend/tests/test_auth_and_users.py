def register_user(client, email, password="password123"):
    payload = {
        "email": email,
        "password": password,
            "contact": {
                "email": email,
                "first_name": "Test",
                "last_name": "User",
                "phone_number": "123",
                "postal_address": "addr"
            }
    }
    resp = client.post("/api/v1/users/", json=payload)
    assert resp.status_code == 200, resp.text
    return resp.json()

def login(client, email, password="password123"):
    data = {"username": email, "password": password}
    resp = client.post("/api/v1/token", data=data)
    assert resp.status_code == 200, resp.text
    return resp.json()["access_token"]

def test_register_and_login(client):
    register_user(client, "user1@example.com")
    token = login(client, "user1@example.com")
    assert token
