-- ============================================================================
-- DP World Synapse - Kigali Dry Port (Masaka) Database Schema
-- Version: 1.0.0
-- Dialect: PostgreSQL 14+
-- Naming: Strict snake_case for all tables, columns, and constraints
-- ============================================================================

-- Clean up existing objects if needed
DROP TABLE IF EXISTS executive_briefings CASCADE;
DROP TABLE IF EXISTS bottleneck_alerts CASCADE;
DROP TABLE IF EXISTS operational_metrics CASCADE;
DROP TABLE IF EXISTS fleet_trips CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS warehouse_zones CASCADE;

-- ----------------------------------------------------------------------------
-- 1. Table: warehouse_zones
-- Stores physical and functional storage zones at DP World Kigali - Masaka Hub
-- ----------------------------------------------------------------------------
CREATE TABLE warehouse_zones (
    id BIGSERIAL PRIMARY KEY,
    zone_code VARCHAR(50) UNIQUE NOT NULL,
    zone_name VARCHAR(100) NOT NULL,
    zone_type VARCHAR(50) NOT NULL, -- BONDED, NON_BONDED, COLD_CHAIN, CFS, EMPTY_YARD, HAZMAT
    total_capacity_sqm NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_capacity_teu INT NOT NULL DEFAULT 0,
    current_occupancy_teu INT NOT NULL DEFAULT 0,
    temperature_celsius NUMERIC(4, 1), -- Monitored for cold chain / reefer storage
    target_temp_min NUMERIC(4, 1),
    target_temp_max NUMERIC(4, 1),
    status VARCHAR(30) NOT NULL DEFAULT 'OPTIMAL', -- OPTIMAL, NEAR_CAPACITY, CONGESTED, MAINTENANCE
    supervisor_name VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. Table: shipments
-- Inbound, outbound, and in-transit containerized and bulk cargo shipments
-- ----------------------------------------------------------------------------
CREATE TABLE shipments (
    id BIGSERIAL PRIMARY KEY,
    tracking_number VARCHAR(64) UNIQUE NOT NULL,
    container_number VARCHAR(32) NOT NULL,
    seal_number VARCHAR(32),
    shipping_line VARCHAR(50) NOT NULL, -- Maersk, CMA CGM, MSC, Hapag-Lloyd, PIL, etc.
    consignee_name VARCHAR(150) NOT NULL,
    consignor_name VARCHAR(150),
    origin_port VARCHAR(100) NOT NULL, -- Mombasa Port, Dar es Salaam Port, etc.
    destination_hub VARCHAR(100) NOT NULL DEFAULT 'DP World Masaka',
    corridor VARCHAR(50) NOT NULL, -- CENTRAL_CORRIDOR, NORTHERN_CORRIDOR, REGIONAL_FEEDER
    cargo_type VARCHAR(50) NOT NULL, -- FCL, LCL, BULK, COLD_CHAIN, HAZMAT, GENERAL_CARGO
    commodity_description TEXT,
    weight_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    teu_count INT NOT NULL DEFAULT 1,
    customs_channel VARCHAR(20) NOT NULL, -- GREEN, YELLOW, RED, BLUE
    customs_status VARCHAR(40) NOT NULL, -- PENDING_DECLARATION, DOCUMENT_VERIFICATION, PHYSICAL_SCAN, CLEARED, CUSTOMS_HOLD
    customs_declaration_number VARCHAR(64),
    stage VARCHAR(40) NOT NULL, -- CORRIDOR_TRANSIT, BORDER_CROSSING, YARD_GATE_IN, INSPECTION_BAY, WAREHOUSE_STORED, GATE_OUT_DELIVERED
    warehouse_zone_id BIGINT REFERENCES warehouse_zones(id) ON DELETE SET NULL,
    eta TIMESTAMPTZ,
    gate_in_at TIMESTAMPTZ,
    customs_cleared_at TIMESTAMPTZ,
    gate_out_at TIMESTAMPTZ,
    dwell_time_hours NUMERIC(8, 2) DEFAULT 0.00,
    is_bonded BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. Table: fleet_trips
-- Truck & trailer operations traversing the Central and Northern Corridors
-- ----------------------------------------------------------------------------
CREATE TABLE fleet_trips (
    id BIGSERIAL PRIMARY KEY,
    trip_number VARCHAR(50) UNIQUE NOT NULL,
    truck_plate VARCHAR(30) NOT NULL,
    trailer_number VARCHAR(30),
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(30),
    transporter_company VARCHAR(100) NOT NULL,
    corridor VARCHAR(50) NOT NULL, -- CENTRAL_CORRIDOR, NORTHERN_CORRIDOR, CROSS_BORDER_DRC
    origin_location VARCHAR(100) NOT NULL,
    current_checkpoint VARCHAR(100) NOT NULL, -- Rusumo Border Post, Kagitumba, Kabanga, Masaka Gate
    destination_hub VARCHAR(100) NOT NULL DEFAULT 'DP World Masaka',
    status VARCHAR(40) NOT NULL, -- DISPATCHED, IN_TRANSIT, BORDER_HOLD, GATE_IN_MASAKA, UNLOADING, DEPARTED
    assigned_shipment_id BIGINT REFERENCES shipments(id) ON DELETE SET NULL,
    departure_time TIMESTAMPTZ,
    border_arrival_time TIMESTAMPTZ,
    border_clearance_time TIMESTAMPTZ,
    gate_in_time TIMESTAMPTZ,
    gate_out_time TIMESTAMPTZ,
    turnaround_time_minutes INT DEFAULT 0,
    delay_reason TEXT,
    gps_latitude NUMERIC(9, 6),
    gps_longitude NUMERIC(9, 6),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. Table: operational_metrics
-- Daily aggregated operational performance indicators for executive trends
-- ----------------------------------------------------------------------------
CREATE TABLE operational_metrics (
    id BIGSERIAL PRIMARY KEY,
    metric_date DATE UNIQUE NOT NULL,
    teu_inbound_today INT NOT NULL DEFAULT 0,
    teu_outbound_today INT NOT NULL DEFAULT 0,
    teu_in_yard INT NOT NULL DEFAULT 0,
    avg_truck_turnaround_mins NUMERIC(6, 1) NOT NULL DEFAULT 0.0,
    avg_dwell_time_days NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    bonded_utilization_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    non_bonded_utilization_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    cold_chain_utilization_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    customs_clearance_rate_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    green_channel_count INT NOT NULL DEFAULT 0,
    yellow_channel_count INT NOT NULL DEFAULT 0,
    red_channel_count INT NOT NULL DEFAULT 0,
    blue_channel_count INT NOT NULL DEFAULT 0,
    active_bottlenecks_count INT NOT NULL DEFAULT 0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. Table: bottleneck_alerts
-- Real-time operational alerts, congestion points, and critical incident alerts
-- ----------------------------------------------------------------------------
CREATE TABLE bottleneck_alerts (
    id BIGSERIAL PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL, -- CUSTOMS_RED_CHANNEL_SURGE, COLD_CHAIN_TEMP_ANOMALY, BORDER_CROSSING_CONGESTION, GATE_QUEUE_OVERFLOW, YARD_HIGH_DENSITY
    severity VARCHAR(20) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    affected_zone_or_corridor VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INVESTIGATING, RESOLVED
    impact_summary TEXT,
    suggested_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 6. Table: executive_briefings
-- Daily synthesized intelligence briefs for the Managing Director
-- ----------------------------------------------------------------------------
CREATE TABLE executive_briefings (
    id BIGSERIAL PRIMARY KEY,
    briefing_date DATE NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    title VARCHAR(200) NOT NULL,
    executive_summary TEXT NOT NULL,
    operational_highlights TEXT NOT NULL DEFAULT '[]', -- JSON string or JSONB array
    critical_risks TEXT NOT NULL DEFAULT '[]',
    strategic_recommendations TEXT NOT NULL DEFAULT '[]',
    raw_kpi_snapshot TEXT NOT NULL DEFAULT '{}'
);

-- ----------------------------------------------------------------------------
-- Indexes for query optimization
-- ----------------------------------------------------------------------------
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_container ON shipments(container_number);
CREATE INDEX idx_shipments_customs_channel ON shipments(customs_channel);
CREATE INDEX idx_shipments_stage ON shipments(stage);
CREATE INDEX idx_shipments_corridor ON shipments(corridor);
CREATE INDEX idx_shipments_zone_id ON shipments(warehouse_zone_id);
CREATE INDEX idx_fleet_trips_corridor ON fleet_trips(corridor);
CREATE INDEX idx_fleet_trips_status ON fleet_trips(status);
CREATE INDEX idx_fleet_trips_truck_plate ON fleet_trips(truck_plate);
CREATE INDEX idx_operational_metrics_date ON operational_metrics(metric_date);
CREATE INDEX idx_bottleneck_alerts_status ON bottleneck_alerts(status);
CREATE INDEX idx_executive_briefings_date ON executive_briefings(briefing_date);
