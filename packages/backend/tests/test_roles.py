from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
from app.db.session import get_db
from app.modules.users.models import Role, user_roles
from main import app


def register_user(client: TestClient, email: str, password: str = "password123"):
    payload = {
        "email": email,
        "password": password,
        "contact": {
            "email": email,
            "first_name": "Test",
            "last_name": "User",
            "phone_number": "123",
            "postal_address": "addr",
        },
    }
    r = client.post("/api/v1/users/", json=payload)
    assert r.status_code == 200, r.text
    return r.json()


def login(client: TestClient, email: str, password: str = "password123") -> str:
    r = client.post("/api/v1/token", data={"username": email, "password": password})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


def auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}


def promote_to_admin(db: Session, user_id: int):
    # Ensure administrator role exists
    admin_role = db.query(Role).filter(Role.name == "administrator").first()
    if not admin_role:
        admin_role = Role(name="administrator", description="System administrator")
        db.add(admin_role)
        db.commit()
        db.refresh(admin_role)
    # Link if not already
    link_exists = db.execute(user_roles.select().where((user_roles.c.user_id == user_id) & (user_roles.c.role_id == admin_role.id))).first()
    if not link_exists:
        db.execute(user_roles.insert().values(user_id=user_id, role_id=admin_role.id))
        db.commit()


def test_role_lifecycle_and_assignment(client: TestClient):
    # Create two users
    admin_user = register_user(client, "admin_roles@example.com")
    regular_user = register_user(client, "regular_roles@example.com")

    # Manually promote first to administrator via DB
    # Use the same overridden DB session fixture (sqlite) as the TestClient
    override = app.dependency_overrides.get(get_db)
    if override:
        db = next(override())
    else:
        db = next(get_db())
    promote_to_admin(db, admin_user["id"])

    # Login both
    admin_token = login(client, "admin_roles@example.com")
    regular_token = login(client, "regular_roles@example.com")

    # Non-admin should be forbidden listing roles
    roles_forbidden = client.get("/api/v1/roles/", headers=auth_headers(regular_token))
    assert roles_forbidden.status_code in (401, 403)

    # Admin can create a new role
    create_role_resp = client.post(
        "/api/v1/roles/",
        json={"name": "auditor", "description": "Audit access"},
        headers=auth_headers(admin_token),
    )
    assert create_role_resp.status_code == 201, create_role_resp.text
    role_id = create_role_resp.json()["id"]

    # List roles as admin
    list_roles = client.get("/api/v1/roles/", headers=auth_headers(admin_token))
    assert list_roles.status_code == 200
    role_ids = [r["id"] for r in list_roles.json()]
    assert role_id in role_ids

    # Assign role to regular user
    assign_resp = client.post(
        f"/api/v1/roles/users/{regular_user['id']}/assign/{role_id}",
        headers=auth_headers(admin_token),
    )
    assert assign_resp.status_code == 200, assign_resp.text
    assert any(r["id"] == role_id for r in assign_resp.json()["roles"])

    # Revoke role
    revoke_resp = client.delete(
        f"/api/v1/roles/users/{regular_user['id']}/revoke/{role_id}",
        headers=auth_headers(admin_token),
    )
    assert revoke_resp.status_code == 200, revoke_resp.text
    assert all(r["id"] != role_id for r in revoke_resp.json()["roles"])


def test_seed_roles_present(client: TestClient):
    # Create an admin user and promote
    admin_user = register_user(client, "seed_admin@example.com")
    override = app.dependency_overrides.get(get_db)
    if override:
        db = next(override())
    else:
        db = next(get_db())
    promote_to_admin(db, admin_user["id"])
    token = login(client, "seed_admin@example.com")
    resp = client.get("/api/v1/roles/", headers=auth_headers(token))
    assert resp.status_code == 200
    names = {r['name'] for r in resp.json()}
    # Should contain at least baseline roles
    assert 'administrator' in names
    assert 'user' in names


def test_cannot_revoke_baseline_user_role(client: TestClient):
    # Setup admin
    admin_user = register_user(client, "admin_baseline@example.com")
    override = app.dependency_overrides.get(get_db)
    db = next(override()) if override else next(get_db())
    promote_to_admin(db, admin_user["id"])
    admin_token = login(client, "admin_baseline@example.com")

    # Create target user
    target = register_user(client, "baseline_target@example.com")
    # Fetch roles list
    roles_resp = client.get("/api/v1/roles/", headers=auth_headers(admin_token))
    assert roles_resp.status_code == 200
    roles = roles_resp.json()
    user_role = next(r for r in roles if r['name'] == 'user')

    # Attempt revoke baseline 'user' role
    revoke = client.delete(f"/api/v1/roles/users/{target['id']}/revoke/{user_role['id']}", headers=auth_headers(admin_token))
    assert revoke.status_code == 200
    # Ensure role still present
    updated_user = revoke.json()
    updated_names = {r['name'] for r in updated_user['roles']}
    assert 'user' in updated_names
