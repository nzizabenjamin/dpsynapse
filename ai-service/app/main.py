import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.briefing_engine import briefing_engine
from app.config import settings
from app.models import AskQueryRequest, AskQueryResponse, BriefingRequest, BriefingResponse, HealthResponse
from app.query_engine import query_engine

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("synapse-ai.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("DP World Synapse AI Microservice starting up on port %s...", settings.PORT)
    yield
    logger.info("DP World Synapse AI Microservice shutting down...")


app = FastAPI(
    title="DP World Synapse - AI Intelligence Microservice",
    description="Operational LLM and Narrative Intelligence Engine for DP World Kigali (Masaka Dry Port)",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthResponse, tags=["Health"])
@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    engine_name = "Gemini LLM" if settings.GEMINI_API_KEY else ("OpenAI LLM" if settings.OPENAI_API_KEY else "Domain Heuristic Synthesizer")
    return HealthResponse(
        status="HEALTHY",
        service="DP World Synapse AI Microservice",
        version="1.0.0",
        engine=engine_name
    )


@app.post("/api/v1/ai/briefing/generate", response_model=BriefingResponse, tags=["Briefing"])
async def generate_briefing(request: BriefingRequest):
    """
    Synthesizes the Morning Operational & Fleet Status Briefing based on live dry port telemetry.
    """
    try:
        return await briefing_engine.generate_briefing(request)
    except Exception as e:
        logger.error(f"Error generating briefing: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/ai/query", response_model=AskQueryResponse, tags=["Ask Synapse"])
async def ask_synapse(request: AskQueryRequest):
    """
    Answers operational natural language questions regarding port throughput, customs backlog, and corridor fleet delays.
    """
    try:
        return await query_engine.answer_query(request)
    except Exception as e:
        logger.error(f"Error processing query: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
