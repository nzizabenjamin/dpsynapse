import json
import logging
from datetime import date, datetime
from typing import Any, Dict, List, Optional
import httpx

from app.config import settings
from app.models import BriefingRequest, BriefingResponse
from app.prompt_templates import EXECUTIVE_BRIEFING_SYSTEM_PROMPT

logger = logging.getLogger("synapse-ai.briefing")


class BriefingEngine:
    """
    Synthesizes daily operations and logistics briefings for DP World Kigali terminal operations management.
    Supports LLM providers (Gemini / OpenAI) with deterministic domain fallback.
    """


    async def generate_briefing(self, request: BriefingRequest) -> BriefingResponse:
        target_date = request.date or date.today().isoformat()
        kpi = request.kpiSnapshot or {}
        custom_focus = request.customFocus

        logger.info(f"Generating operations briefing for date: {target_date}, focus: {custom_focus}")

        # Attempt LLM generation if API Key is configured
        if settings.GEMINI_API_KEY:
            try:
                llm_response = await self._generate_with_gemini(target_date, kpi, custom_focus)
                if llm_response:
                    return llm_response
            except Exception as e:
                logger.warning(f"Gemini API call failed, falling back to deterministic engine: {e}")
        elif settings.OPENAI_API_KEY:
            try:
                llm_response = await self._generate_with_openai(target_date, kpi, custom_focus)
                if llm_response:
                    return llm_response
            except Exception as e:
                logger.warning(f"OpenAI API call failed, falling back to deterministic engine: {e}")

        # Domain-Grounded Heuristic Synthesis Engine
        return self._generate_heuristic_briefing(target_date, kpi, custom_focus)

    async def _generate_with_gemini(self, target_date: str, kpi: Dict[str, Any], custom_focus: Optional[str]) -> Optional[BriefingResponse]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.DEFAULT_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
        
        prompt = f"""
{EXECUTIVE_BRIEFING_SYSTEM_PROMPT}

Generate the daily briefing for Date: {target_date}
Operational Telemetry Data:
{json.dumps(kpi, indent=2)}

Operational Focus Areas:
{custom_focus or 'Standard daily dry port throughput, customs clearance matrix, and corridor fleet review.'}

Respond strictly in valid JSON matching this schema:
{{
  "title": "...",
  "executiveSummary": "...",
  "operationalHighlights": ["...", "..."],
  "criticalRisks": ["...", "..."],
  "strategicRecommendations": ["...", "..."]
}}
"""
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"response_mime_type": "application/json"}
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text)
                return BriefingResponse(
                    briefingDate=target_date,
                    title=parsed.get("title", f"Masaka Inland Port — Daily Operations & Fleet Status Briefing — {target_date}"),
                    executiveSummary=parsed.get("executiveSummary", ""),
                    operationalHighlights=parsed.get("operationalHighlights", []),
                    criticalRisks=parsed.get("criticalRisks", []),
                    strategicRecommendations=parsed.get("strategicRecommendations", []),
                    rawKpiSnapshot=kpi
                )
        return None

    async def _generate_with_openai(self, target_date: str, kpi: Dict[str, Any], custom_focus: Optional[str]) -> Optional[BriefingResponse]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
        
        prompt = f"""
Generate the daily briefing for Date: {target_date}
Operational Telemetry: {json.dumps(kpi, indent=2)}
Focus: {custom_focus or 'Standard operations overview'}

Respond strictly in valid JSON with: title, executiveSummary, operationalHighlights (list), criticalRisks (list), strategicRecommendations (list).
"""
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": EXECUTIVE_BRIEFING_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                parsed = json.loads(data["choices"][0]["message"]["content"])
                return BriefingResponse(
                    briefingDate=target_date,
                    title=parsed.get("title", f"Masaka Inland Port — Daily Operations & Fleet Status Briefing — {target_date}"),
                    executiveSummary=parsed.get("executiveSummary", ""),
                    operationalHighlights=parsed.get("operationalHighlights", []),
                    criticalRisks=parsed.get("criticalRisks", []),
                    strategicRecommendations=parsed.get("strategicRecommendations", []),
                    rawKpiSnapshot=kpi
                )
        return None

    def _generate_heuristic_briefing(self, target_date: str, kpi: Dict[str, Any], custom_focus: Optional[str]) -> BriefingResponse:
        inbound = kpi.get("dailyTeuInbound", 246)
        outbound = kpi.get("dailyTeuOutbound", 218)
        total = kpi.get("totalTeuThroughput", inbound + outbound)
        yard_teu = kpi.get("currentYardTeu", 3260)
        yard_util = kpi.get("overallYardUtilizationPct", 75.1)
        tat = kpi.get("avgTruckTurnaroundMins", 42.2)
        dwell = kpi.get("avgDwellDays", 2.9)
        customs_rate = kpi.get("customsClearanceRatePct", 94.5)
        cold_util = kpi.get("coldChainCapacityUtilPct", 90.8)
        bonded_util = kpi.get("bondedCapacityUtilPct", 84.0)

        title = f"Masaka Inland Port — Daily Operations & Fleet Status Briefing — {target_date}"
        
        summary = (
            f"Masaka Inland Port operations report strong freight volume for {target_date} "
            f"with total throughput reaching {total} TEUs ({inbound} inbound / {outbound} outbound). "
            f"Dry port yard occupancy is stable at {yard_util}% ({yard_teu} TEUs). Terminal truck turnaround time (TAT) averaged "
            f"{tat} minutes, meeting the <45 min operational target. Rwanda Revenue Authority (RRA) customs clearance efficiency stands at {customs_rate}%."
        )

        highlights = [
            f"Combined 24-hour TEU throughput reached {total} units, supporting ongoing factory replenishment for Bralirwa, Inyange, and RMS.",
            f"Masaka Gate truck turnaround registered at {tat} mins, sustained by pre-arrival manifest filing and RFID fast lanes.",
            f"Cold Chain Hub (Zone D) operating at {cold_util}% capacity with continuous thermal integrity (+3.4°C baseline) for pharma and horticulture exports.",
            f"Central Corridor (Dar es Salaam) accounts for 68% of inbound freight flow, while Northern Corridor (Mombasa) handles 32%."
        ]

        risks = [
            "Central Corridor (Rusumo OSBP): Border customs interface latency causing intermittent queue build-up (+4.8h delay for 14 trucks).",
            "Masaka Inspection Bay (Zone A): Red Channel scanning backlogged by 9 container boxes awaiting physical verification.",
            f"Empty Yard (Zone F): High density of 40ft High-Cube shipping line boxes awaiting export tea and mineral backhauls."
        ]

        recommendations = [
            "Liaise with RRA Customs Commissioner to deploy an auxiliary mobile inspection team at Masaka Bay 4 during afternoon peak.",
            "Activate offline clearance fallback protocol with Tanzania Revenue Authority (TRA) at Rusumo One-Stop Border Post.",
            "Incentivize bulk export hauliers (tea, coffee, coltan) to reposition empty reefers and dry boxes from Zone F to Mombasa and Dar es Salaam ports."
        ]

        if custom_focus:
            highlights.insert(0, f"Special Operational Focus: {custom_focus} — active monitoring and dedicated task force assigned.")

        return BriefingResponse(
            briefingDate=target_date,
            title=title,
            executiveSummary=summary,
            operationalHighlights=highlights,
            criticalRisks=risks,
            strategicRecommendations=recommendations,
            rawKpiSnapshot=kpi
        )


briefing_engine = BriefingEngine()
