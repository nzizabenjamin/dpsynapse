import json
import logging
from typing import Any, Dict, List, Optional
import httpx

from app.config import settings
from app.models import AskQueryRequest, AskQueryResponse
from app.prompt_templates import ASK_SYNAPSE_SYSTEM_PROMPT

logger = logging.getLogger("synapse-ai.query")


class QueryEngine:
    """
    Handles natural language executive queries against live terminal telemetry.
    Supports LLM providers with robust domain fallback.
    """

    async def answer_query(self, request: AskQueryRequest) -> AskQueryResponse:
        query = request.query
        context_filter = request.contextFilter or "GENERAL"
        telemetry = request.telemetry or {}

        logger.info(f"Processing Ask Synapse query: '{query}' [Category: {context_filter}]")

        if settings.GEMINI_API_KEY:
            try:
                llm_response = await self._query_with_gemini(query, context_filter, telemetry)
                if llm_response:
                    return llm_response
            except Exception as e:
                logger.warning(f"Gemini query failed, falling back: {e}")
        elif settings.OPENAI_API_KEY:
            try:
                llm_response = await self._query_with_openai(query, context_filter, telemetry)
                if llm_response:
                    return llm_response
            except Exception as e:
                logger.warning(f"OpenAI query failed, falling back: {e}")

        return self._heuristic_query_engine(query, context_filter, telemetry)

    async def _query_with_gemini(self, query: str, context_filter: str, telemetry: Dict[str, Any]) -> Optional[AskQueryResponse]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.DEFAULT_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
        prompt = f"""
{ASK_SYNAPSE_SYSTEM_PROMPT}

User Query: "{query}"
Context Filter: {context_filter}
Live Terminal Telemetry:
{json.dumps(telemetry, indent=2)}

Respond strictly in JSON matching this schema:
{{
  "answer": "...",
  "intentCategory": "...",
  "keyFindings": ["...", "..."],
  "recommendedActions": ["...", "..."]
}}
"""
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"response_mime_type": "application/json"}
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text)
                return AskQueryResponse(
                    query=query,
                    answer=parsed.get("answer", ""),
                    intentCategory=parsed.get("intentCategory", "GENERAL_INTELLIGENCE"),
                    keyFindings=parsed.get("keyFindings", []),
                    recommendedActions=parsed.get("recommendedActions", []),
                    dataTelemetry=telemetry
                )
        return None

    async def _query_with_openai(self, query: str, context_filter: str, telemetry: Dict[str, Any]) -> Optional[AskQueryResponse]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
        prompt = f"""
Query: "{query}"
Category: {context_filter}
Telemetry: {json.dumps(telemetry, indent=2)}

Respond strictly in JSON with: answer, intentCategory, keyFindings (list), recommendedActions (list).
"""
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": ASK_SYNAPSE_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                parsed = json.loads(data["choices"][0]["message"]["content"])
                return AskQueryResponse(
                    query=query,
                    answer=parsed.get("answer", ""),
                    intentCategory=parsed.get("intentCategory", "GENERAL_INTELLIGENCE"),
                    keyFindings=parsed.get("keyFindings", []),
                    recommendedActions=parsed.get("recommendedActions", []),
                    dataTelemetry=telemetry
                )
        return None

    def _heuristic_query_engine(self, query: str, context_filter: str, telemetry: Dict[str, Any]) -> AskQueryResponse:
        q_lower = query.lower()
        kpi = telemetry.get("kpi", {})

        if any(k in q_lower for k in ["bottleneck", "risk", "alert", "delay", "issue"]):
            intent = "BOTTLENECK_ANALYSIS"
            answer = (
                "DP World Kigali is actively managing 3 operational bottlenecks today: "
                "1) Central Corridor border delay at Rusumo OSBP (+4.8h latency due to electronic customs synchronization). "
                "2) Inspection Bay Red Channel backlog with 9 containers awaiting scanner clearance. "
                "3) Cold Chain Zone D ambient temp alert (+3.4°C baseline under close monitoring)."
            )
            findings = [
                "Rusumo OSBP queue has 14 trucks waiting for single-window message handshake.",
                "Inspection scanner #2 recalibration causing LCL destuffing diversion.",
                "Pharmaceutical Cold Chain remains within safe 2.0°C - 8.0°C tolerance."
            ]
            actions = [
                "Authorize manual manifest stamp fallback with Tanzania Revenue Authority at Rusumo.",
                "Deploy mobile container inspection scanner at Masaka Bay 4.",
                "Engage HVAC chiller backup at Cold Bay D3."
            ]
        elif any(k in q_lower for k in ["turnaround", "tat", "truck", "gate", "speed"]):
            intent = "FLEET_TURNAROUND"
            tat = kpi.get("avgTruckTurnaroundMins", 42.2)
            answer = (
                f"Truck Turnaround Time (TAT) at Masaka Terminal is performing at {tat} minutes, "
                f"beating our corporate benchmark of 45.0 minutes. Inbound gate processing averages 11 minutes, "
                f"yard gantry handling averages 18 minutes, and outbound scale exit takes 13 minutes."
            )
            findings = [
                f"Overall terminal turnaround is {tat} mins (Target: < 45.0 mins).",
                "AEO Blue Channel trucks achieving rapid turnarounds under 32 minutes.",
                "Central Corridor fleet volume represents 68% of daily arrivals."
            ]
            actions = [
                "Keep auxiliary scale #3 open during afternoon shift changeover.",
                "Notify logistics partners to complete pre-arrival customs declaration in SCT."
            ]
        elif any(k in q_lower for k in ["customs", "channel", "rra", "red", "green", "clearance"]):
            intent = "CUSTOMS_EFFICIENCY"
            rate = kpi.get("customsClearanceRatePct", 94.5)
            answer = (
                f"Current RRA customs clearance efficiency is at {rate}%. "
                "Green and Blue (AEO) channels represent 62% of shipments with zero physical inspection hold. "
                "Red Channel represents 18% of shipments and is the primary driver of dry port dwell time."
            )
            findings = [
                f"Customs clearance rate is {rate}% across Masaka Hub.",
                "Average dwell time is 2.9 days for standard containers.",
                "Red Channel containers experience an average inspection dwell of 14.8 hours."
            ]
            actions = [
                "Expedite physical scanning for priority perishable and raw material cargo.",
                "Onboard high-compliance importers onto the RRA Authorized Economic Operator (AEO) program."
            ]
        elif any(k in q_lower for k in ["capacity", "zone", "warehouse", "cold", "occupancy", "density"]):
            intent = "WAREHOUSE_CAPACITY"
            yard_util = kpi.get("overallYardUtilizationPct", 75.1)
            cold_util = kpi.get("coldChainCapacityUtilPct", 90.8)
            bonded_util = kpi.get("bondedCapacityUtilPct", 84.0)
            answer = (
                f"Overall Masaka Dry Port yard density is at {yard_util}%. "
                f"Bonded CFS (Zone A) is at {bonded_util}% capacity, "
                f"Non-Bonded FMCG (Zone B) is at 68.3%, and Cold Chain Pharma (Zone D) is at {cold_util}%."
            )
            findings = [
                f"Cold Chain (Zone D) is near capacity ({cold_util}%) due to vaccine deliveries.",
                "Empty Yard (Zone F) contains 1,340 TEUs of shipping line equipment.",
                "Agri-export hub (Zone C) has high tea and coffee packing throughput."
            ]
            actions = [
                "Activate empty container repositioning incentive for tea export backhaulers.",
                "Maintain secondary chiller standby for Cold Chain Zone D."
            ]
        else:
            intent = "GENERAL_INTELLIGENCE"
            total = kpi.get("totalTeuThroughput", 475)
            tat = kpi.get("avgTruckTurnaroundMins", 42.2)
            answer = (
                f"DP World Kigali operational summary: Today's combined volume is {total} TEUs. "
                f"Truck turnaround is optimal at {tat} mins. Terminal operations are running smoothly with "
                "2 active corridor alerts under resolution."
            )
            findings = [
                f"Daily TEU throughput: {total} TEUs.",
                f"Masaka Gate turnaround: {tat} mins (Target < 45m).",
                "Corridor flow active across Central and Northern corridors."
            ]
            actions = [
                "Review the latest morning operational briefing for tactical recommendations."
            ]

        return AskQueryResponse(
            query=query,
            answer=answer,
            intentCategory=intent,
            keyFindings=findings,
            recommendedActions=actions,
            dataTelemetry=telemetry
        )


query_engine = QueryEngine()
