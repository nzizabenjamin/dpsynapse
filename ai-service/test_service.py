import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert "Synapse" in data["service"]


def test_generate_briefing():
    payload = {
        "date": "2026-10-05",
        "customFocus": "Cold Chain and Rusumo Border",
        "kpiSnapshot": {
            "dailyTeuInbound": 252,
            "dailyTeuOutbound": 223,
            "totalTeuThroughput": 475,
            "currentYardTeu": 3260,
            "overallYardUtilizationPct": 75.1,
            "avgTruckTurnaroundMins": 42.2,
            "customsClearanceRatePct": 94.5
        }
    }
    response = client.post("/api/v1/ai/briefing/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["briefingDate"] == "2026-10-05"
    assert "Masaka" in data["title"]
    assert len(data["operationalHighlights"]) > 0
    assert len(data["criticalRisks"]) > 0
    assert len(data["strategicRecommendations"]) > 0


def test_ask_synapse_bottlenecks():
    payload = {
        "query": "What are the biggest bottlenecks affecting operations right now?",
        "contextFilter": "BOTTLENECKS",
        "telemetry": {
            "kpi": {"avgTruckTurnaroundMins": 42.2}
        }
    }
    response = client.post("/api/v1/ai/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["intentCategory"] == "BOTTLENECK_ANALYSIS"
    assert "Rusumo" in data["answer"] or "bottleneck" in data["answer"].lower()
    assert len(data["keyFindings"]) > 0
    assert len(data["recommendedActions"]) > 0


def test_ask_synapse_tat():
    payload = {
        "query": "What is the average truck turnaround time at Masaka Gate?",
        "contextFilter": "FLEET",
        "telemetry": {
            "kpi": {"avgTruckTurnaroundMins": 42.2}
        }
    }
    response = client.post("/api/v1/ai/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["intentCategory"] == "FLEET_TURNAROUND"
    assert "42.2" in data["answer"]
