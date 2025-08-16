def create_and_login_user(client, email="tasker@example.com"):
    payload = {
        "email": email,
        "password": "password123",
            "contact": {
                "email": email,
                "first_name": "Task",
                "last_name": "User",
                "phone_number": "123",
                "postal_address": "addr"
            }
    }
    r = client.post("/api/v1/users/", json=payload)
    assert r.status_code == 200, r.text
    lr = client.post("/api/v1/token", data={"username": email, "password": "password123"})
    assert lr.status_code == 200
    return lr.json()["access_token"]

def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}

def test_task_crud_cycle(client):
    token = create_and_login_user(client)
    create_resp = client.post(
        "/api/v1/tasks/",
        json={"title": "Test Task", "description": "Desc", "status": "pending"},
        headers=auth_headers(token),
    )
    assert create_resp.status_code == 201, create_resp.text
    task_id = create_resp.json()["id"]
    list_resp = client.get("/api/v1/tasks/", headers=auth_headers(token))
    assert list_resp.status_code == 200
    assert any(t["id"] == task_id for t in list_resp.json())
    update_resp = client.put(
        f"/api/v1/tasks/{task_id}",
        json={"title": "Updated", "description": "Desc", "status": "in_progress"},
        headers=auth_headers(token),
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "Updated"
    del_resp = client.delete(f"/api/v1/tasks/{task_id}", headers=auth_headers(token))
    assert del_resp.status_code == 200
    get_resp = client.get(f"/api/v1/tasks/{task_id}", headers=auth_headers(token))
    assert get_resp.status_code == 404
