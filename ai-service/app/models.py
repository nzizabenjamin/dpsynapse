from datetime import date, datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class BriefingRequest(BaseModel):
    date: Optional[str] = Field(default=None, description="Target date in YYYY-MM-DD format")
    customFocus: Optional[str] = Field(default=None, description="Specific operational focus area")
    kpiSnapshot: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Live telemetry from Spring Boot backend")


class BriefingResponse(BaseModel):
    briefingDate: str
    generatedAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    title: str
    executiveSummary: str
    operationalHighlights: List[str]
    criticalRisks: List[str]
    strategicRecommendations: List[str]
    rawKpiSnapshot: Optional[Dict[str, Any]] = None


class AskQueryRequest(BaseModel):
    query: str = Field(..., description="Natural language question from shift supervisors or terminal operations managers")
    contextFilter: Optional[str] = Field(default="GENERAL", description="Optional operational category filter")
    telemetry: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Live KPI and zone metrics")



class AskQueryResponse(BaseModel):
    query: str
    answer: str
    intentCategory: str
    keyFindings: List[str]
    recommendedActions: List[str]
    dataTelemetry: Optional[Dict[str, Any]] = None
    answeredAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    engine: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
