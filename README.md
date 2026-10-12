# DP World Synapse: Cross-Departmental Operations & Logistics Intelligence Platform
**Project Presentation & Technical Brief**  
**Author:** Benjamin Nziza (Software Engineering Student)  
**Target Deployment:** DP World Kigali — Masaka Inland Dry Port & Warehousing Hub  

---

## 1. Executive Summary & Project Vision

Modern inland dry ports and container freight stations manage complex multi-modal logistics ecosystems. At the **DP World Kigali Logistics Platform in Masaka**, operations span bonded and non-bonded warehousing, temperature-controlled cold-chain storage, Rwanda Revenue Authority (RRA) customs documentation, and regional long-haul transport corridors (such as Dar es Salaam and Mombasa).

Traditionally, these core functions operate in isolated silos, requiring manual coordination, phone calls, and fragmented log sheets. **DP World Synapse** is engineered to eliminate these operational blind spots. It acts as a unified digital command center that bridges warehousing, customs clearance, and fleet transport into a single enterprise interface—empowering logistics teams, shift supervisors, and management to track cargo velocity, monitor zone density, and resolve bottlenecks efficiently.

---

## 2. Core Operational Pillars

The platform is structured around four foundational divisions that drive dry port operations at Masaka:

1. **Warehousing & Contract Logistics:** Manages bonded CFS, non-bonded FMCG distribution, agri-commodities export hubs, and critical cold-chain pharmaceutical storage. Tracks cubic capacity, active pallet slots, and zone density percentages in real-time.
2. **Customs Clearance & Documentation:** Integrates with RRA Single Customs Territory (SCT) workflows. Tracks the lifecycle of shipping manifests across regulatory channels (*Blue Fast-Track, Green, Yellow Document Audit, and Red Physical Scan*).
3. **Regional Fleet & Transport Corridors:** Monitors long-haul transport telemetry across the Central Corridor (Tanzania) and Northern Corridor (Kenya), tracking border weighbridge stops, transit delays, and estimated arrival times.
4. **Terminal Operations & Gate Management:** Captures ingress and egress telemetry at port gates, container handling equipment utilization, and truck turnaround times (TAT) against established SLAs.

---

## 3. System Architecture & Tech Stack

DP World Synapse is built on a robust, multi-tier enterprise architecture designed for high availability and clean separation of concerns:

* **Frontend Layer (React + Tailwind CSS):** A responsive, single-page enterprise dashboard styled to match professional logistics portals. It utilizes clean corporate palettes (`#002D56` navy, `#F4F6F8` neutral backgrounds), traffic-light status badges, and interactive drill-down cards.
* **Backend API Layer (Spring Boot / ASP.NET Core):** Exposes clean RESTful endpoints (`/api/v1/synapse/overview`, `/api/v1/synapse/warehouses`, `/api/v1/synapse/shipments/bottlenecks`) that handle secure data serialization and business logic.
* **Database Layer (PostgreSQL):** A fully normalized relational database utilizing strict `snake_case` naming conventions. Key schema tables include:
  * `warehouse_zones` (`zone_id`, `zone_code`, `zone_type`, `total_capacity_sqm`, `current_occupancy_sqm`, `status`)
  * `shipments` (`shipment_id`, `container_number`, `client_name`, `cargo_type`, `customs_channel`, `customs_status`, `dwell_days`)
  * `fleet_trips` (`trip_id`, `truck_plate`, `corridor_route`, `trip_status`, `estimated_eta`)
  * `operational_metrics` (`metric_id`, `recorded_date`, `warehouse_utilization_percentage`, `active_fleet_count`)
* **AI Intelligence Microservice (Python / LLM):** A lightweight service that ingests aggregated JSON operational metrics from the backend and interfaces with an LLM to generate automated shift briefings and natural language SQL queries.

---

## 4. Multi-Departmental Workflow & Role-Based Interaction

To ensure cross-departmental alignment, Synapse supports role-based access control (RBAC) and contextual action triggers:

* **Role-Based Accounts:** Users operate under specific departmental profiles (e.g., *Warehouse Supervisor*, *Customs Clearance Clerk*, *Fleet Dispatcher*). 
* **Contextual Action Triggers:** When an operational exception occurs—such as a customs hold or a cold-chain temperature warning—staff do not need to switch applications. Clicking action buttons like **"Request RRA Status Update"** or **"Notify Customs Team"** automatically dispatches contextual notifications with container IDs and zone codes to the responsible department queue.
* **Supervisor Escalation:** Supervisors retain elevated permissions to review multi-zone congestion, authorize storage space reallocations, and resolve critical border transit holds.

---

## 5. AI Intelligence Engine

The platform incorporates two primary AI capabilities designed to reduce administrative friction for shift personnel:

* **Automated Shift & Operational Briefings:** The AI intelligence microservice automatically analyzes daily aggregated metrics to compile structured narrative summaries highlighting throughput performance, border wait times, and recommended corrective actions.
* **"Ask Synapse" Natural Language Querying:** Staff can type plain-English questions into the search box or click suggested query chips (e.g., *"Show me all containers waiting over 5 days in bonded storage"*). The AI parses the prompt and instantly filters the relational dataset to return the precise records.

---

## 6. Full Project Demo Guide for Reviewers

Follow these steps to evaluate the fully functional prototype:

1. **Access the Live Enterprise Dashboard:** Open the deployed prototype via the provided link to view the live corporate layout and macro KPI summary row.
2. **Test Interactive Zone Filtering:** Click on any card within the **Storage & Yard Zone Matrix** (e.g., *Cold-Chain Pharma* or *Bonded CFS*). Observe how the main shipment manifest table dynamically filters to display only relevant items.
3. **Explore RRA Customs Channels:** Use the interactive toggle tabs (*All Channels*, *Green*, *Yellow*, *Red*, *Blue*) to filter manifests by regulatory status.
4. **Execute Action Triggers:** Click an action button next to a flagged bottleneck row to verify the instant success toast notification and status update handler.
5. **Test the AI Query Box:** Type a query or click one of the quick-suggestion chips in the "Ask Synapse" search bar to test real-time data filtering.