import uuid

from fastapi.testclient import TestClient

from app.main import app


def test_admin_can_create_and_list_dropoff_centers() -> None:
    client = TestClient(app)
    center_name = f"Admin Test Center {uuid.uuid4().hex[:8]}"

    payload = {
        "name": center_name,
        "center_type": "MUNICIPAL_CENTER",
        "address_line1": "200 Demo Street",
        "city": "Trenton",
        "state": "NJ",
        "postal_code": "08536",
        "country_code": "US",
        "latitude": 40.2681,
        "longitude": -74.7884,
        "phone": "+1-555-0101",
        "website": "https://example.com/demo-center",
        "accepted_materials": ["Plastic", "Glass", "Paper"],
        "not_accepted": ["Hazardous waste"],
        "is_active": True,
    }

    create_response = client.post("/centers", json=payload)
    assert create_response.status_code == 201, create_response.text
    created = create_response.json()
    assert created["name"] == center_name
    assert created["postal_code"] == "08536"

    list_response = client.get("/centers/admin")
    assert list_response.status_code == 200, list_response.text
    centers = list_response.json()
    assert any(item["name"] == center_name for item in centers)

    center_id = created["id"]
    update_response = client.put(f"/centers/{center_id}", json={"phone": "+1-555-2020", "is_active": False})
    assert update_response.status_code == 200, update_response.text
    updated = update_response.json()
    assert updated["phone"] == "+1-555-2020"
    assert updated["is_active"] is False

    delete_response = client.delete(f"/centers/{center_id}")
    assert delete_response.status_code == 204, delete_response.text

    fetch_after_delete = client.get(f"/centers/{center_id}")
    assert fetch_after_delete.status_code == 404
