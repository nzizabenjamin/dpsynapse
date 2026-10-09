# DP World Synapse — Terminal Operations & Logistics Intelligence Platform
### DP World Kigali (Inland Dry Port & Warehousing Hub at Masaka, Rwanda)

**DP World Synapse** is an enterprise-grade operations and logistics intelligence platform purpose-built for shift supervisors, terminal operations managers, and logistics leadership at DP World Kigali (Masaka Hub). It combines real-time dry port telemetry, customs channel clearance tracking, corridor fleet telematics, and an AI intelligence engine for automated operational briefings.

---

## System Architecture

```
dpsynapse/
├── db/                                # Part 1: PostgreSQL DDL Schema & Kigali Seed Data
│   ├── 01_schema.sql                  # Strict snake_case tables & performance indexes
│   └── 02_seed_data.sql               # Realistic freight data (Zones A-F, 30+ shipments, fleet)
│
├── backend/                           # Part 2: Spring Boot 3 REST API Backend (Java 22)
│   ├── pom.xml
│   ├── src/main/resources/application.yml  # Dual-profile config (local H2 / live PostgreSQL)
│   └── src/main/java/com/dpworld/synapse/
│       ├── controller/                # REST endpoints (/kpi, /warehouse-zones, /shipments, /fleet, /briefings, /ai)
│       ├── service/                   # Business logic, KPI aggregations, and AI client
│       ├── entity/                    # JPA Entities matching PostgreSQL schema
│       └── repository/                # Spring Data JPA repositories
│
├── ai-service/                        # Part 3: Python FastAPI AI Intelligence Microservice
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py                    # FastAPI server (port 8000)
│   │   ├── briefing_engine.py         # 07:00 morning narrative operational briefing generator
│   │   ├── query_engine.py            # "Ask Synapse" natural language Q&A engine
│   │   └── prompt_templates.py        # Operations prompt engineering templates
│   └── test_service.py                # Automated pytest suite (100% pass)
│
└── frontend/                          # Part 4: Enterprise Operations Dashboard (React + Vite + Tailwind)
    ├── package.json
    ├── tailwind.config.js             # DP World corporate navy/blue enterprise palette
    └── src/
        ├── components/                # Macro KPIs, Zone Map, Customs Matrix, Fleet Radar, Ask Synapse
        ├── services/api.js            # REST API connector
        └── App.jsx                    # Operations dashboard orchestration
```

---

## Quick Start Guide

### 1. Database Setup (PostgreSQL)
In **pgAdmin** or `psql`:
```bash
# Create the database
CREATE DATABASE dpsynapse;

# Execute the schema and seed scripts
psql -U postgres -d dpsynapse -f db/01_schema.sql
psql -U postgres -d dpsynapse -f db/02_seed_data.sql
```

---

### 2. Run the Spring Boot Backend (Port 8080)
```bash
cd backend
mvn spring-boot:run
```
- **API Base:** `http://localhost:8080`
- **Swagger UI / OpenAPI Documentation:** `http://localhost:8080/swagger-ui.html`
- **H2 Web Console (when using local profile):** `http://localhost:8080/h2-console`

---

### 3. Run the AI Microservice (Port 8000)
```bash
cd ai-service
.\.venv\Scripts\activate
uvicorn app.main:app --port 8000 --reload
```
- **API Base:** `http://localhost:8000`
- **Interactive OpenAPI Docs:** `http://localhost:8000/docs`
- **Run Tests:** `pytest test_service.py -v`

---

### 4. Run the Enterprise Operations Dashboard (Port 5173)
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Key Features & Capabilities

1. **Terminal Operations Macro KPI Strip:** Real-time counters for daily TEU throughput (Inbound/Outbound), Masaka Gate Truck Turnaround Time (TAT < 45m SLA), dry port density, and RRA customs clearance efficiency.
2. **07:00 Shift Operations Briefing:** Operational narrative briefing synthesized by the AI microservice highlighting corridor splits, active bottlenecks, and tactical recommendations.
3. **Interactive 2D Warehouse & Yard Zone Matrix:** Live capacity density and thermal sensor telemetry across Zone A (Bonded CFS), Zone B (FMCG), Zone C (Agri-Export), Zone D (Cold Chain Pharma `+3.4°C`), Zone E (HAZMAT), and Zone F (Empty Yard).
4. **RRA Customs Clearance Matrix:** Single Customs Territory (SCT) channel matrix (Green, Yellow, Red, Blue) with filterable container shipment manifest.
5. **Corridor Fleet Transit Radar:** Central Corridor (Dar es Salaam -> Rusumo) vs Northern Corridor (Mombasa -> Kagitumba) truck tracking and border dwell telematics.
6. **"Ask Synapse" AI Operations Assistant:** Natural language query drawer providing instant answers grounded on live dry port telemetry.
